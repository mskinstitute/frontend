import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import LiveCourseCardLarge from './LiveCourseCardLargeNew';

const LiveCourseGrid = ({ courses = [] }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Showing {courses.length} live courses
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <LiveCourseCardLarge key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
};

export default LiveCourseGrid;
