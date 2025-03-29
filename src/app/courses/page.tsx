'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/CourseCard';
import courseService from '@/services/course.service';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Course } from '@/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        setCourses(response.courses);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      
      {courses.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No courses available at the moment</p>
          <p className="text-sm mt-2">Check back later for new courses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={{
                ...course,
                price: course.price,
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}










