
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseCreateInput } from '@/types';
import toast from 'react-hot-toast';
import courseService from '@/services/course.service';

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CourseCreateInput>({
    name: '',
    description: '',
    about: '',
    price: 0,
    thumbnail: undefined,
    categoryId: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'file' && e.target instanceof HTMLInputElement && e.target.files) {
      setFormData(prev => ({
        ...prev,
        [name]: e.target instanceof HTMLInputElement ? e.target.files![0] : null
      }));
    } else if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await courseService.createCourse(formData);
      if (response.success) {
        toast.success('Course created successfully!');
        router.push('/courses/dashboard');
      } else {
        toast.error(response.message || 'Failed to create course');
      }
    } catch (error) {
      toast.error('Failed to create course');
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-white mb-2">Course Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-white mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="about" className="block text-white mb-2">About</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                rows={5}
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-white mb-2">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-white mb-2">Thumbnail</label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                accept="image/*"
                required
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-white mb-2">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                required
              >
                <option value="">Select a category</option>
                {/* Add your category options here */}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
}


