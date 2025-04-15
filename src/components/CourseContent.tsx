'use client';

import { useState, useEffect } from 'react';
import ContentService from '@/services/content.service';
import { Module } from '@/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CourseContentProps {
  courseId: string;
}

export default function CourseContent({ courseId }: CourseContentProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await ContentService.getAllModules(courseId);
      if (response.success) {
        setModules(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div key={module.id} className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white">{module.name}</h3>
          <div className="text-sm text-gray-400 mt-1">
            Duration: {module.duration}h | Videos: {module.videoCount} | Materials: {module.materialCount}
          </div>
        </div>
      ))}
      {modules.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No content available for this course yet.
        </div>
      )}
    </div>
  );
}