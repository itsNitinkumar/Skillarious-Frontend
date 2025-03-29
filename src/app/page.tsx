'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Learning Platform</h1>
        <p className="text-xl mb-8">Discover a wide range of courses to enhance your skills</p>
        <Link 
          href="/courses" 
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Browse All Courses
        </Link>
      </div>
    </main>
  );
}





