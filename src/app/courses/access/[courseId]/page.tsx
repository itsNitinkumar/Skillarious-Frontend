'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CourseReviews from '@/components/CourseReviews';
import CourseDoubts from '@/components/CourseDoubts';
import CourseContent from '@/components/CourseContent';
import { useState } from 'react';

interface PageProps {
  params: {
    courseId: string;
  };
}

export default function CoursePage({ params }: PageProps) {
  const [currentLesson, setCurrentLesson] = useState<{ id: string } | null>(null);

  return (
    <Tabs defaultValue="content">
      <TabsList>
        <TabsTrigger value="content">Course Content</TabsTrigger>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="doubts">Doubts</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="notes">My Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <CourseContent courseId={String(params.courseId)} />
      </TabsContent>

      <TabsContent value="doubts">
        <CourseDoubts 
          courseId={String(params.courseId)} 
          contentId={currentLesson?.id || ''} 
        />
      </TabsContent>

      <TabsContent value="reviews">
        <CourseReviews courseId={String(params.courseId)} />
      </TabsContent>

      <TabsContent value="overview">
        <div>Overview content here</div>
      </TabsContent>

      <TabsContent value="notes">
        <div>Notes content here</div>
      </TabsContent>
    </Tabs>
  );
}

