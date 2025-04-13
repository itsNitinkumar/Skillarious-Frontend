'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, BookOpen, Video, FileText, Lock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Course, Module } from '@/types';
import CourseService from '@/services/course.service';
import contentService from '@/services/content.service';
import { motion } from 'framer-motion';
import PaymentModal from '@/components/PaymentModal';

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentSuccess = () => {
    setHasAccess(true);
    checkAccess(); // Refresh the course access status
  };

  useEffect(() => {
    if (user) {
      checkAccess();
    }
  }, [user, params.courseId]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      
      // Check course ownership if user is educator
      if (user?.isEducator) {
        const ownershipResponse = await CourseService.checkCourseOwnership(params.courseId);
        setIsOwner(ownershipResponse.success);
      }

      // Check course access for all users
      const accessResponse = await CourseService.checkCourseAccess(params.courseId);
      setHasAccess(accessResponse.success);

      // Fetch course details
      const courseResponse = await CourseService.getSingleCourse(params.courseId);
      console.log('Course response:', courseResponse);
      setCourse(courseResponse.data);

      // Fetch modules if user has access or is owner
      if (accessResponse.success || (user?.isEducator && isOwner)) {
        const modulesResponse = await contentService.getAllModules(params.courseId);
        setModules(modulesResponse.data);
      }
    } catch (error) {
      toast.error('Error loading course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Course not found</h1>
        <button onClick={() => router.push('/courses')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 mb-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative w-full md:w-1/3 aspect-video rounded-xl overflow-hidden">
              <Image
                src={course.thumbnail || '/placeholder-course.jpg'}
                alt={course.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
              <p className="text-gray-300 text-lg mb-6">{course.description}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-800 px-4 py-2 rounded-full">
                  <span className="font-semibold">₹{course.price}</span>
                </div>
                {hasAccess && (
                  <div className="bg-green-800 px-4 py-2 rounded-full flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Enrolled</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                {!hasAccess && !isOwner && (
                  <button 
                    onClick={handlePurchase}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Purchase Course
                  </button>
                )}
                {isOwner && (
                  <>
                    <button 
                      onClick={() => router.push(`/courses/edit/${params.courseId}`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Edit Course
                    </button>
                    <button 
                      onClick={() => router.push(`/courses/modules/create/${params.courseId}`)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Add Module
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modules Section */}
        {(hasAccess || isOwner) ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold mb-6">Course Modules</h2>
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{module.name}</h3>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/courses/modules/edit/${module.id}`)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this module?')) {
                            try {
                              const response = await contentService.deleteModule(module.id);
                              if (response.success) {
                                setModules(modules.filter(m => m.id !== module.id));
                                toast.success('Module deleted successfully');
                              }
                            } catch (error) {
                              toast.error('Failed to delete module');
                              console.error(error);
                            }
                          }
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => router.push(`/courses/materials/${module.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Study Materials
                  </button>
                  <button
                    onClick={() => router.push(`/courses/videos/${module.id}`)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Watch Videos
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl font-bold mb-2">Purchase this course to access content</h2>
            <p className="text-gray-400">Get full access to all modules and study materials</p>
          </motion.div>
        )}
      </div>
      {showPaymentModal && (
        <PaymentModal
          course={{
            id: course!.id,
            title: course!.name,
            price: course!.price
          }}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
















