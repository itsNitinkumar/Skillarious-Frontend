import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <div className="relative h-48">
          <Image
            src={course.thumbnail || '/placeholder-course.jpg'}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{course.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-red-600 font-bold">₹{course.price}</span>
            <span className="text-sm text-gray-500">{course.viewCount ?? 0} views</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}







