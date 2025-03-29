'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-6 z-50">
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-red-600 text-2xl font-bold">Learn Sphere</span>
      </Link>

      <div className="flex-1 max-w-2xl mx-12">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
            <Search />
          </button>
        </form>
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
    </header>
  );
}


