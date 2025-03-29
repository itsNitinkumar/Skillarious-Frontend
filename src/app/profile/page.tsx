'use client';

import { Users, Star, Award, PlayCircle } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/types';
import axios from 'axios';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function Profile() {


  const instructor = {
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    banner: 'https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b',
    bio: 'Senior Software Engineer with 10+ years of experience. Passionate about teaching web development and helping others succeed in tech.',
    subscribers: 15420,
    totalStudents: 45890,
    averageRating: 4.8,
    coursesCount: 12
  };

  const courses: Course[] = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      instructor: instructor.name,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      price: 89.99,
      rating: 4.9,
      students: 2345,
      description: 'Master advanced React patterns and concepts',
      preview_url: 'https://example.com/preview1.mp4'
    },
    {
      id: '2',
      title: 'Node.js Microservices',
      instructor: instructor.name,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
      price: 79.99,
      rating: 4.7,
      students: 1890,
      description: 'Build scalable microservices with Node.js',
      preview_url: 'https://example.com/preview2.mp4'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="ml-64">
        <div className="h-48 relative -z-10">
          <img
            src={instructor.banner}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-16">
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <div className="flex items-start space-x-6">
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-800 -mt-20"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{instructor.name}</h1>
                <p className="text-gray-400 mb-4">{instructor.bio}</p>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{instructor.subscribers.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Subscribers</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <Star className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{instructor.averageRating}</div>
                    <div className="text-sm text-gray-400">Average Rating</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <Award className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{instructor.totalStudents.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Students</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <PlayCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{instructor.coursesCount}</div>
                    <div className="text-sm text-gray-400">Courses</div>
                  </div>
                </div>

                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
