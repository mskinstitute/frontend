'use client';

import Link from 'next/link';

export default function CourseDetailClient({ courseTitle }: { courseTitle: string }) {
  return (
    <Link
      href={`/book-demo?course=${encodeURIComponent(courseTitle)}`}
      className="w-full text-center py-3.5 bg-secondary hover:bg-secondary-light text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 block"
    >
      Request a Free Demo Class ➔
    </Link>
  );
}
