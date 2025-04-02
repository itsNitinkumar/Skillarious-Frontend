
import { ReactNode } from 'react';
import { Course } from '@/types';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  courses: Course[];
  onCreateCourse: (courseData: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function EducatorDashboard({ 
  courses, 
  onCreateCourse,
  onEditCourse, 
  onDeleteCourse, 
  isLoading = false,
  error = null 
}: DashboardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-800 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Your Courses</h1>
        <button
          onClick={() => router.push('/courses/create')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create New Course
        </button>
      </div>
      
      {error && (
        <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-2">No courses created yet</h2>
          <p className="text-gray-400">
            Start creating your first course to share your knowledge!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => onEditCourse(course)}
              onDelete={() => onDeleteCourse(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img
        src={course.thumbnail || '/default-course-thumbnail.jpg'}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">${course.price}</span>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400">{title}</h3>
        <div className="text-red-500">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}










