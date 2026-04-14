import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const LiveCourseCardCompact = ({ course }) => {
  const { theme } = useContext(ThemeContext);
  const start = course.start_time ? new Date(course.start_time).toLocaleDateString() : null;

  const resolveImg = (img) => {
    if (!img) return '/placeholder-course.jpg';
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return String(img);
  };

  return (
    <div className={`p-4 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex items-center gap-4`}>
      <img src={resolveImg(course.featured_image_url) || resolveImg(course.featured_image)} alt={course.title} className="w-24 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{course.title}</div>
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{course.instructor_name || course.instructor || 'TBA'}</div>
        <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{start ? `Starts: ${start}` : 'Start date TBA'}</div>
      </div>
      <div className="text-right">
        <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{course.price || '0.00'}</div>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{course.mode || ''}</div>
      </div>
    </div>
  );
};

export default LiveCourseCardCompact;
