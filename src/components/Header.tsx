'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import courseService from '@/services/course.service';
import categoryService from '@/services/category.service';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    courses: any[];
    categories: any[];
  }>({ courses: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setIsSearching(true);
        const [coursesResponse, categoriesResponse] = await Promise.all([
          courseService.searchCourses(searchQuery),
          categoryService.searchCategories(searchQuery)
        ]);

        setSearchResults({
          courses: coursesResponse.courses || [],
          categories: categoriesResponse.data || []
        });

        // Redirect to search results page with query parameters
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-6 z-50">
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-red-600 text-2xl font-bold">Learn Sphere</span>
      </Link>

      <div className="flex-1 max-w-2xl mx-12 relative">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses and categories..."
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            disabled={isSearching}
          >
            <Search />
          </button>
        </form>

        {/* Search Results Dropdown */}
        {searchQuery && (searchResults.courses.length > 0 || searchResults.categories.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {searchResults.courses.length > 0 && (
              <div className="p-2">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Courses</h3>
                {searchResults.courses.slice(0, 3).map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    {course.name}
                  </Link>
                ))}
              </div>
            )}
            {searchResults.categories.length > 0 && (
              <div className="p-2 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Categories</h3>
                {searchResults.categories.slice(0, 3).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="block px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            router.push(`/category/${e.target.value}`);
          }}
          className="bg-gray-800 text-white px-3 py-1 rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {user?.isEducator && (
        <Link 
          href="/educator/profile" 
          className="text-white hover:text-gray-300"
        >
          Educator Profile
        </Link>
      )}

      {user && (
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 text-white hover:text-gray-300"
          >
            <img
              src={user.pfp || '/default-avatar.png'}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span>{user.name}</span>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="border-t border-gray-700"></div>
              <Link
                href="/logout"
                className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}







