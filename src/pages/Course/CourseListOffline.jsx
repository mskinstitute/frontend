import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { ThemeContext } from '../../context/ThemeContext';
import CourseCard from '../../components/course/CourseCard';

const PAGE_SIZE = 12;

const CourseListOffline = () => {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
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

  const categoryOptions = useMemo(() => {
    const options = new Set(['All']);
    courses.forEach((course) => {
      if (Array.isArray(course.categories)) {
        course.categories.forEach((category) => options.add(category));
      } else if (course.categories) {
        options.add(String(course.categories));
      }
    });
    return Array.from(options);
  }, [courses]);

  const levelOptions = useMemo(() => {
    const options = new Set(['All']);
    courses.forEach((course) => {
      if (course.level) {
        options.add(String(course.level));
      }
    });
    return Array.from(options);
  }, [courses]);

  const modeOptions = useMemo(() => {
    const options = new Set(['All']);
    courses.forEach((course) => {
      if (course.mode) {
        options.add(String(course.mode));
      }
    });
    return Array.from(options);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const title = String(course.title || course.name || '').toLowerCase();
      const description = String(course.sort_description || course.description || '').toLowerCase();
      const categories = Array.isArray(course.categories)
        ? course.categories.join(' ').toLowerCase()
        : String(course.categories || '').toLowerCase();

      const matchesSearch = !query || title.includes(query) || description.includes(query) || categories.includes(query);
      const matchesCategory = categoryFilter === 'All' || categories.includes(categoryFilter.toLowerCase());
      const matchesLevel = levelFilter === 'All' || String(course.level).toLowerCase() === levelFilter.toLowerCase();
      const matchesMode = modeFilter === 'All' || String(course.mode).toLowerCase() === modeFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesLevel && matchesMode;
    });
  }, [courses, search, categoryFilter, levelFilter, modeFilter]);

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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              autoFocus
              placeholder="Search courses..."
              className="w-full lg:w-1/2 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-3 w-full lg:w-auto">
              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setPage(1);
                }}
                className="w-full dark:bg-gray-900 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={levelFilter}
                onChange={(event) => {
                  setLevelFilter(event.target.value);
                  setPage(1);
                }}
                className="w-full dark:bg-gray-900 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <select
                value={modeFilter}
                onChange={(event) => {
                  setModeFilter(event.target.value);
                  setPage(1);
                }}
                className="w-full dark:bg-gray-900 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {modeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
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
            {pageCourses.map((course) => (
              <CourseCard key={course.id || course.slug} course={course} />
            ))}
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
