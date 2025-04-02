import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Course } from '@/types';
import PaymentModal from './PaymentModal';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    setShowPaymentModal(true);
  };

  return (
    <>
      <Link href={`/courses/${course.id}`}>
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="relative h-48">
            <Image
              src={course.thumbnail || '/placeholder-course.jpg'}
              alt={course.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-2">{course.name}</h3>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-red-500 font-semibold">₹{course.price}</span>
              <button
                onClick={handleBuyNow}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>

      {showPaymentModal && (
        <PaymentModal
          course={{
            id: course.id,
            title: course.name,
            price: course.price
          }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-700 animate-pulse" />
      <div className="p-4">
        <div className="h-6 bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-700 rounded animate-pulse mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}



