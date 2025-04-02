'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Users, Star, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
            alt="Education Background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Unlock Your Potential with Learn Sphere
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Access world-class courses, expert instructors, and a global community 
              of learners to advance your career and skills.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/courses" 
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Explore Courses
              </Link>
              <Link 
                href="/signup" 
                className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">50K+</h3>
              <p className="text-gray-400">Active Learners</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">1000+</h3>
              <p className="text-gray-400">Total Courses</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Star className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">4.8</h3>
              <p className="text-gray-400">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">89%</h3>
              <p className="text-gray-400">Completion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all transform hover:-translate-y-1"
              >
                <div className="text-red-500 mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm">{category.courseCount} courses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners already learning on Learn Sphere
          </p>
          <Link 
            href="/signup" 
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold inline-block"
          >
            Get Started For Free
          </Link>
        </div>
      </section>
    </main>
  );
}

// Define icon components first
const CodeIcon = () => <div>Code</div>;
const ChartIcon = () => <div>Chart</div>;
const SmartphoneIcon = () => <div>Phone</div>;
const PaletteIcon = () => <div>Palette</div>;

const categories = [
  {
    id: 'web-dev',
    name: 'Web Development',
    courseCount: '150+',
    icon: <CodeIcon className="w-8 h-8" />
  },
  {
    id: 'data-science',
    name: 'Data Science',
    courseCount: '120+',
    icon: <ChartIcon className="w-8 h-8" />
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    courseCount: '90+',
    icon: <SmartphoneIcon className="w-8 h-8" />
  },
  {
    id: 'design',
    name: 'Design',
    courseCount: '80+',
    icon: <PaletteIcon className="w-8 h-8" />
  }
];

