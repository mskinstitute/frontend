import React, { useEffect, useState, useContext, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import api from '../../api/axios';
import LiveCourseGrid from '../../components/course/LiveCourseGrid';
import { ThemeContext } from '../../context/ThemeContext';
import { useBackendStatus } from '../../context/BackendStatusContext';

const LiveCourses = () => {
  const { theme } = useContext(ThemeContext);
  const { setBackendAvailable } = useBackendStatus();
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

        setBackendAvailable(false);
        setCourses(filtered);
        setError(filtered.length === 0 ? 'No live courses found in local fallback content.' : null);
      } catch (fallbackError) {
        console.error('Failed to load live course fallback', fallbackError);
        setError('Unable to load live courses from local fallback content.');
      } finally {
        setLoading(false);
      }
    };

    const fetchLive = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = searchQuery ? { search: searchQuery } : {};
        const res = await api.get('/courses/live-courses/', { params });
        const items = res.data.results || res.data || [];

        const normalized = items.map((i) => ({
          ...i,
          id: i.id,
          title: i.title,
          featured_image_url:
            i.featured_image_url ||
            (i.featured_image && (i.featured_image.url || i.featured_image)) ||
            (i.course && (i.course.featured_image_url || i.course.featured_image)) ||
            null,
          price: i.price,
          discount: i.discount,
          instructor_name:
            i.instructor_name ||
            (i.created_by && i.created_by.username) ||
            (i.instructor && i.instructor.username) ||
            null,
          start_time:
            i.start_time || i.start_date ||
            (i.next_batch && i.next_batch.start_datetime) ||
            null,
          end_time:
            i.end_time || i.end_date ||
            (i.next_batch && i.next_batch.end_datetime) ||
            null,
          mode: i.mode || null,
          sort_description:
            i.description || i.sort_description ||
            (i.course && i.course.sort_description) ||
            null,
          course: i.course || null,
          next_batch: i.next_batch || null,
        }));

        setBackendAvailable(true);
        setCourses(normalized);
      } catch (err) {
        console.error('Failed to fetch live courses', err);
        const shouldFallback = !err.response || (err.response.status >= 500 && err.response.status < 600);
        if (shouldFallback) {
          await loadLiveCoursesFromStatic();
          return;
        }
        setError(err.response?.data?.detail || err.message || 'Failed to fetch live courses');
      } finally {
        setLoading(false);
      }
    };

    if (liveSearchDebounceRef.current) {
      clearTimeout(liveSearchDebounceRef.current);
    }
    liveSearchDebounceRef.current = setTimeout(() => {
      fetchLive();
    }, 400);

    return () => {
      if (liveSearchDebounceRef.current) {
        clearTimeout(liveSearchDebounceRef.current);
      }
    };
  }, [searchQuery, setBackendAvailable]);

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
