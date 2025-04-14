
'use client';
import { Course } from '@/types';
import courseService from '@/services/course.service';
import educatorService from '@/services/educator.service';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function CoursesPage() {
  const router = useRouter();
  const auth = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Course>({
    id: '',
    name: '',
    description: '',
    about: '',
    price: 0,
    thumbnail: '',
    educatorId: '',
    start: new Date(),
    end: new Date(),
    viewcount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    // Add console logs to debug
    console.log('Current user:', auth.user);

    // Check if user is logged in
    if (!auth.user && !auth.loading) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }

    // Check if user is an educator
    if (!auth.user?.isEducator && !auth.loading) {
      console.log('User is not an educator, redirecting to home');
      router.push('/');
      return;
    }

    // Fetch educator courses only if we have the user
    if (auth.user?.id) {
      fetchCourses();
    }
  }, [auth.user, auth.loading]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (!auth.user?.id) {
        throw new Error('No user ID found');
      }
      
      // First get the educator profile to get the educator ID
      const educatorResponse = await educatorService.getEducatorProfile();
      if (!educatorResponse.success) {
        throw new Error('Failed to fetch educator profile');
      }
      
      const educatorId = educatorResponse.data.id;
      const response = await courseService.getCoursesByEducator(educatorId);
      
      if (response.courses) {
        setCourses(response.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-white" />
      </div>
    );
  }

  const createCourse = async () => {
    try {
      setLoading(true);
      if (!auth.user?.id) {
        throw new Error('No educator ID found');
      }

      const submitData = {
        name: formData.name,
        description: formData.description,
        about: formData.about || '',
        price: Number(formData.price),
        thumbnail: formData.thumbnail || '',
        start: formData.start,
        end: formData.end,
        viewcount: 0,
      };

      if (!submitData.name || !submitData.description || !submitData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await courseService.createCourse(auth.user.id, {
        body: submitData,
      });
      setCourses([...courses, response.course]);
      setSelectedCourse(response.course);
      resetForm();
      toast.success('Course created successfully');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async () => {
    try {
      setLoading(true);
      if (!selectedCourse) {
        throw new Error('No course selected for update');
      }
      const response = await courseService.updateCourse(selectedCourse.id, formData);
      setCourses(courses.map(course => course.id === selectedCourse.id ? response.course : course));
      setSelectedCourse(response.course);
      resetForm();
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      setLoading(true);
      await courseService.deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      setSelectedCourse(null);
      resetForm();
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      about: '',
      price: 0,
      thumbnail: '',
      educatorId: '',
      start: new Date(),
      end: new Date(),
      viewcount: 0,
    });
    setSelectedCourse(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: new Date(value)
    }));
  };

  const selectCourseForEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      ...course,
      start: new Date(course.start),
      end: new Date(course.end)
    });
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Manage Courses</h1>

        {/* Form Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {selectedCourse ? 'Edit Course' : 'Create New Course'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                placeholder="Course name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                placeholder="Course price"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Course description"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="About the course"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Thumbnail URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date *</label>
              <input
                type="date"
                name="start"
                value={formData.start.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e, 'start')}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date *</label>
              <input
                type="date"
                name="end"
                value={formData.end.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e, 'end')}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={selectedCourse ? updateCourse : createCourse}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedCourse ? 'Update Course' : 'Create Course'}
            </button>
            {selectedCourse && (
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-gray-700 rounded-lg overflow-hidden">
              {/* Thumbnail and basic info */}
              <div 
                className="flex cursor-pointer"
                onClick={() => toggleCourseExpansion(course.id)}
              >
                <div className="relative w-48 h-32">
                  <Image
                    src={course.thumbnail || '/placeholder-course.jpg'}
                    alt={course.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{course.name}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        Price: ₹{course.price} | Start: {new Date(course.start).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCourseForEdit(course);
                        }}
                        className="p-2 text-gray-400 hover:text-white"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCourse(course.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded content */}
              {expandedCourseId === course.id && (
                <div className="p-4 bg-gray-800">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Description</h4>
                      <p className="text-white">{course.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">About</h4>
                      <p className="text-white">{course.about}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Start Date</h4>
                        <p className="text-white">{new Date(course.start).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">End Date</h4>
                        <p className="text-white">{new Date(course.end).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/content/module/${course.id}`)}
                      className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      View Modules
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



