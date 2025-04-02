'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import courseService from '@/services/course.service';
import categoryService from '@/services/category.service';
import { Course, Category } from '@/types';
import CourseCard from '@/components/CourseCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [results, setResults] = useState({ courses: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const [coursesResponse, categoriesResponse] = await Promise.all([
          courseService.searchCourses(query),
          categoryService.searchCategories(query)
        ]);

        setResults({
          courses: coursesResponse.courses || [],
          categories: categoriesResponse.data || []
        });
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        Search Results for "{query}"
      </h1>

      {/* Categories Section */}
      {results.categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(results.categories as Category[]).map((category: Category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700"
              >
                <h3 className="text-lg font-medium text-white">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-400 mt-2">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Courses Section */}
      {results.courses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(results.courses as Course[]).map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {results.courses.length === 0 && results.categories.length === 0 && (
        <div className="text-center text-gray-400">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}






