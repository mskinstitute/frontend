import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ThemeContext } from '../../context/ThemeContext';
import { slugify } from '../../utils/slugify';

const PAGE_SIZE = 12;

const CourseListOffline = () => {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const loadCourses = async () => {
      try {
        const response = await fetch('/all-courses.json');
        const data = await response.json();
        if (!mounted) return;

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];

        setCourses(items);
      } catch (err) {
        console.error('Failed to load local courses', err);
        if (mounted) {
          setError('Unable to load the course catalog locally.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCourses();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;

    return courses.filter((course) => {
      const title = String(course.title || course.name || '').toLowerCase();
      const description = String(course.sort_description || course.description || '').toLowerCase();
      const categories = Array.isArray(course.categories)
        ? course.categories.join(' ').toLowerCase()
        : String(course.categories || '').toLowerCase();
      return title.includes(query) || description.includes(query) || categories.includes(query);
    });
  }, [courses, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageCourses = filteredCourses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const themeBg = theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen py-10 transition-colors duration-300 ${themeBg}`}>
      <Helmet>
        <title>Courses - MSK Institute</title>
        <meta name="description" content="Browse offline courses from the MSK Institute catalog." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-semibold">Courses</h1>
          <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
            Explore available courses offline. Search by title, description, or category.
          </p>

          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search courses..."
              className="w-full md:max-w-xl rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-700/40 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p>No courses match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageCourses.map((course) => {
              const courseSlug = course.slug || slugify(course.title || String(course.id || 'course'));
              const priceValue = Number(course.price || course.amount || 0);
              const discountValue = Number(course.discount || 0);
              const finalPrice = priceValue > 0 ? `₹ ${Math.round(priceValue * (1 - discountValue / 100))}` : 'Free';

              return (
                <Link
                  key={course.id || courseSlug}
                  to={`/courses/${courseSlug}`}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-4 h-40 overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
                    <img
                      src={course.featured_image_url || course.featured_image || `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title || 'Course')}`}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold leading-tight">{course.title || 'Untitled course'}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {course.sort_description || course.description || 'No description available.'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{finalPrice}</span>
                      <span>{course.level?.name || course.level || 'All Levels'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filteredCourses.length > PAGE_SIZE && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-full border px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListOffline;
