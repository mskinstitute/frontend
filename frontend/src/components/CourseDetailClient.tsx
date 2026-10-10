'use client';

import { useState } from 'react';
import DemoBookingForm from './DemoBookingForm';

export default function CourseDetailClient({ courseTitle }: { courseTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-center py-3.5 bg-secondary hover:bg-secondary-light text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      >
        Request a Free Demo Class
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm no-print animate-in fade-in duration-200">
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <DemoBookingForm courseTitle={courseTitle} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
