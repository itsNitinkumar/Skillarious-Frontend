'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Target, BookOpen, TrendingUp, Award } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('progress');
  const [userStats, setUserStats] = useState({
    coursesCompleted: 0,
    hoursLearned: 0,
    certificatesEarned: 0,
    currentStreak: 0
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/default-avatar.png"
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">John Doe</h2>
            <p className="text-gray-400 mb-4">Web Developer</p>
            <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
              Edit Profile
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Learning Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Courses Completed</span>
                <span className="text-white">{userStats.coursesCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hours Learned</span>
                <span className="text-white">{userStats.hoursLearned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Certificates</span>
                <span className="text-white">{userStats.certificatesEarned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-white">{userStats.currentStreak} days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Learning Progress</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BookOpen className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-white">Active Courses</span>
                </div>
                <div className="text-2xl font-bold text-white">4</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-white">Goals Completed</span>
                </div>
                <div className="text-2xl font-bold text-white">12</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-white">Certificates</span>
                </div>
                <div className="text-2xl font-bold text-white">3</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-white">Avg. Score</span>
                </div>
                <div className="text-2xl font-bold text-white">85%</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Learning Goals</h3>
            <div className="space-y-4">
              {/* Add your learning goals components here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



