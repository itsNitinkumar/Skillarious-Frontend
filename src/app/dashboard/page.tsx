'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Book, Award, Activity } from 'lucide-react';
import CourseCard from '@/components/CourseCard';

export default function DashboardPage() {
  const [activeCourses, setActiveCourses] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Book className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Active Courses</h3>
          </div>
          <div className="text-3xl font-bold text-white">5</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Learning Hours</h3>
          </div>
          <div className="text-3xl font-bold text-white">24.5</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
          </div>
          <div className="text-3xl font-bold text-white">8</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Daily Streak</h3>
          </div>
          <div className="text-3xl font-bold text-white">12</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Continue Learning</h2>
            <div className="space-y-4">
              {activeCourses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="text-white">
                  {/* Add activity content */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="text-white">
                  {/* Add deadline content */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
