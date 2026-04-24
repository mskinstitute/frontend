import React, { useEffect, useState, useContext, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import LiveCourseGrid from '../../components/course/LiveCourseGrid';
import { ThemeContext } from '../../context/ThemeContext';

const LiveCourses = () => {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const staticLiveCoursesCacheRef = useRef(null);
  const liveSearchDebounceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadLiveCoursesFromStatic = async () => {
      try {
        let items = staticLiveCoursesCacheRef.current;
        if (!items) {
          const response = await fetch('/live-courses.json');
          items = await response.json();
          staticLiveCoursesCacheRef.current = items;
        }
        const loweredQuery = searchQuery.trim().toLowerCase();

        const filtered = !loweredQuery
          ? items
          : items.filter((item) => {
              const title = String(item.title || '').toLowerCase();
              const description = String(item.sort_description || item.description || '').toLowerCase();
              const instructor = String(item.instructor_name || item.instructor || '').toLowerCase();
              return (
                title.includes(loweredQuery) ||
                description.includes(loweredQuery) ||
                instructor.includes(loweredQuery)
              );
            });

        setCourses(filtered);
        setError(filtered.length === 0 ? 'No live courses found in local content.' : null);
      } catch (fallbackError) {
        console.error('Failed to load live course content', fallbackError);
        setError('Unable to load live courses from local content.');
      } finally {
        setLoading(false);
      }
    };

    if (liveSearchDebounceRef.current) {
      clearTimeout(liveSearchDebounceRef.current);
    }
    liveSearchDebounceRef.current = setTimeout(() => {
      loadLiveCoursesFromStatic();
    }, 400);

    return () => {
      if (liveSearchDebounceRef.current) {
        clearTimeout(liveSearchDebounceRef.current);
      }
    };
  }, [searchQuery]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Helmet>
        <title>Live Courses – MSK Institute</title>
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Live Courses</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Browse upcoming and ongoing live courses.</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="max-w-md">
            <div className={`relative rounded-lg border-2 transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-500'
            }`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search courses by title, instructor, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors duration-200
                ${theme === 'dark'
                  ? 'bg-gray-800 text-white placeholder-gray-400'
                  : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-8">Loading...</div>
        ) : error ? (
          <div className="py-8 text-red-500">{error}</div>
        ) : courses.length === 0 ? (
          <div className="py-8 text-center">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              No live courses are available at the moment.
            </p>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Please check back later for upcoming live courses.
            </p>
          </div>
        ) : (
          <LiveCourseGrid courses={courses} defaultView="grid" />
        )}
      </div>
    </div>
  );
};

export default LiveCourses;

