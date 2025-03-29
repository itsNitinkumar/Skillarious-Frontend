'use client'
import educatorService from "@/services/educator.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Course } from "@/types";
import CourseCard from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCard";

export default function EducatorCourses() {
  const params = useParams();
  const edid = params.eid as string;
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await educatorService.getEdCourses(edid);
        if (response.courses) {
          setCourses(response.courses);
        } else {
          setError(response.message || 'Failed to fetch courses');
        }
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [edid]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Your Courses</h1>
      
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
              course={{
                ...course,
                title: course.title, // Map name to title as per Course type
                price: parseFloat(course.price as unknown as string), // Convert price to number
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
