'use client';

import { useEffect } from 'react';
import { trackCourseView } from '@/lib/dataLayer';
import { Course } from '@/types';

/**
 * Client component to fire `course_view` on mounting the course page
 * with full structured course parameters from the actual data source.
 */
export default function CourseViewTracker({ course }: { course: Course }) {
  useEffect(() => {
    if (course) {
      const durationStr = course.duration
        ? `${course.duration.value} ${course.duration.unit}`
        : '';
      const primaryCategory = Array.isArray(course.categories) && course.categories.length > 0
        ? course.categories[0]
        : 'Computer Training';

      trackCourseView({
        courseId: course.id || course.slug,
        courseName: course.title,
        courseCategory: primaryCategory,
        courseDuration: durationStr,
        coursePrice: 0,
        courseMode: course.mode || 'BOTH',
      });
    }
  }, [course]);

  return null;
}
