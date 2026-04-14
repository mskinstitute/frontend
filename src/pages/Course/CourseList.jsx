// src/pages/Course/CourseList.jsx
import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import axios from "../../api/axios";
import { Radio } from "lucide-react";
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
import SearchBar from '../../components/course/SearchBar';
import useUrlParams from '../../hooks/useUrlParams';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import CourseGridFallback from '../../components/course/CourseGridFallback';
import CourseGrid from '../../components/course/CourseGrid';
import CourseGridPlaceholder from '../../components/course/CourseGridPlaceholder';
import Pagination from '../../components/course/Pagination';

const CourseList = () => {
  const { theme } = useContext(ThemeContext);

  // URL params
  const { getInitialValues, updateUrl, resetParams } = useUrlParams({
    search: '',
    page: '1'
  });

  // Initialize state from URL
  const initialValues = getInitialValues();

  // Additional filters
  // live-course filter removed — handled on dedicated Live Courses page

  // State
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialValues.search);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    current: 1,
  });

  const staticCoursesCacheRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const { setBackendAvailable } = useBackendStatus();

  const COURSE_PAGE_SIZE = 12;

  const filterCourses = (items, query) => {
    const trimmed = query?.trim().toLowerCase() || '';
    if (!trimmed) return items;

    return items.filter((course) => {
      const title = String(course.title || '').toLowerCase();
      const description = String(course.sort_description || '').toLowerCase();
      const categories = Array.isArray(course.categories)
        ? course.categories.join(' ').toLowerCase()
        : String(course.categories || '').toLowerCase();
      const level = String(course.level || '').toLowerCase();
      const language = Array.isArray(course.language)
        ? course.language.join(' ').toLowerCase()
        : String(course.language || '').toLowerCase();

      return (
        title.includes(trimmed) ||
        description.includes(trimmed) ||
        categories.includes(trimmed) ||
        level.includes(trimmed) ||
        language.includes(trimmed)
      );
    });
  };

  const loadCoursesFromStatic = async (page = 1) => {
    try {
      let items = staticCoursesCacheRef.current;
      if (!items) {
        const response = await fetch('/all-courses.json');
        items = await response.json();
        staticCoursesCacheRef.current = items;
      }
      const filtered = filterCourses(items, searchTerm);
      const totalPages = Math.max(1, Math.ceil(filtered.length / COURSE_PAGE_SIZE));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const pageItems = filtered.slice((safePage - 1) * COURSE_PAGE_SIZE, safePage * COURSE_PAGE_SIZE);

      setBackendAvailable(false);
      setIsFallbackMode(true);
      setCourses(pageItems);
      setPagination({
        next: safePage < totalPages ? safePage + 1 : null,
        previous: safePage > 1 ? safePage - 1 : null,
        current: safePage,
      });
      setError(filtered.length === 0 ? 'No courses found in local fallback content.' : null);
    } catch (fallbackError) {
      console.error('Failed to load fallback courses', fallbackError);
      setCourses([]);
      setPagination({ next: null, previous: null, current: 1 });
      setError('Unable to load courses from local fallback content.');
    } finally {
      setLoading(false);
    }
  };

  // Ref to manage cancellation
  const cancelTokenRef = useRef(null);

  // Build query string for filters/search
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    // Basic filters
    if (searchTerm.trim()) params.append('search', searchTerm.trim());

    return params.toString();
  }, [searchTerm]);

  // Fetch courses
  const fetchCourses = async (page = 1) => {
    // Cancel previous request
    if (cancelTokenRef.current) cancelTokenRef.current.abort();
    const controller = new AbortController();
    cancelTokenRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      setIsFallbackMode(false);

      const query = buildQueryParams();
      const url = `/courses/courses/?page=${page}${query ? `&${query}` : ''}`;
      
      const res = await axios.get(url, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setBackendAvailable(true);
        setCourses(res.data.results || []);
        setPagination({
          next: res.data.next,
          previous: res.data.previous,
          current: page,
        });
      }
    } catch (err) {
      // Only update state if request wasn't cancelled
      if (!controller.signal.aborted) {
        const shouldFallback =
          !err.response || (err.response.status >= 500 && err.response.status < 600);

        if (shouldFallback) {
          await loadCoursesFromStatic(page);
          return;
        }

        if (err.name !== 'CanceledError') {
          setCourses([]);
          const errorMessage =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to load courses. Please try again later.";
          setError(errorMessage);
        }
      }
    } finally {
      // Only update loading state if request wasn't cancelled
      if (!controller.signal.aborted && !isFallbackMode) {
        setLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCourses(1);
  }, []);

  // Update URL when filters/search change (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrl({
        search: searchTerm,
        page: pagination.current.toString()
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, pagination.current, updateUrl]);

  // Re-fetch courses when the search term changes, with debounce.
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      fetchCourses(1);
    }, 400);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchTerm]);

  console.log(courses)

  return (
    <>
      <Helmet>
        <title>Courses - MSK Institute</title>
        {/* Meta tags omitted for brevity */}
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        
        {/* Header */}
        <header className={`sticky top-0 z-40 shadow-sm border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Explore Our Courses
              </h1>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Discover the best computer and coding courses tailored for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Link
                  to="/live-courses"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Live</span>
                </Link>
              </div>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                hasActiveFilters={false}
              />
            </div>
          </div>
        </header>

        {/* Courses Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && <div className="text-red-500 text-center py-4">{error}</div>}
          <ErrorBoundary fallback={error => <CourseGridFallback error={error} />}>
            {loading ? (
              <CourseGridPlaceholder />
            ) : (
              <CourseGrid 
                courses={courses}
                loading={loading}
              />
            )}
          </ErrorBoundary>
          {!loading && <Pagination pagination={pagination} onPageChange={fetchCourses} />}
        </main>
      </div>
    </>
  );
};

export default CourseList;
