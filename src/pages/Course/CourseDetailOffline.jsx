import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ThemeContext } from '../../context/ThemeContext';
import { slugify } from '../../utils/slugify';

const CourseDetailOffline = () => {
  const { slug } = useParams();
  const { theme } = useContext(ThemeContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadCourse = async () => {
      try {
        const response = await fetch('/all-courses.json');
        const data = await response.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];

        const foundCourse = items.find((item) => {
          const itemSlug = item.slug || slugify(item.title || String(item.id || ''));
          return itemSlug === slug;
        });

        if (mounted) {
          if (foundCourse) {
            setCourse(foundCourse);
          } else {
            setError('Course not found.');
          }
        }
      } catch (err) {
        console.error('Failed to load course details', err);
        if (mounted) {
          setError('Unable to load course details offline.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCourse();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const themeBg = theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
  const courseTitle = course?.title || 'Course details';
  const courseDescription = course?.sort_description || course?.description || 'No description available.';
  const priceValue = Number(course?.price || course?.amount || 0);
  const discountValue = Number(course?.discount || 0);
  const finalPrice = priceValue > 0 ? `₹ ${Math.round(priceValue * (1 - discountValue / 100))}` : 'Free';

  const handleEnroll = () => {
    toast.success('This course is available offline for browsing. Contact support to enroll.');
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-10 transition-colors duration-300 ${themeBg}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl bg-white p-10 shadow-sm dark:bg-gray-900">
            <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="h-64 rounded-3xl bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-4">
                <div className="h-5 w-80 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-12 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-32 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 transition-colors duration-300 ${themeBg}`}>
      <Helmet>
        <title>{courseTitle} - MSK Institute</title>
        <meta name="description" content={courseDescription} />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800 lg:w-1/2">
              <img
                src={course?.featured_image_url || course?.featured_image || `https://placehold.co/900x600/0f172a/ffffff?text=${encodeURIComponent(courseTitle)}`}
                alt={courseTitle}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-6 lg:w-1/2">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">Offline course</p>
                <h1 className="text-3xl font-semibold">{courseTitle}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">{finalPrice}</p>
              </div>

              <div className="space-y-3 rounded-3xl bg-gray-50 p-5 text-sm text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                <p>
                  <strong>Mode:</strong> Offline browsing only
                </p>
                <p>
                  <strong>Duration:</strong> {course?.duration || 'Details unavailable'}
                </p>
                <p>
                  <strong>Category:</strong> {course?.category || course?.categories?.join(', ') || 'Unknown'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-500"
                >
                  Request Enrollment
                </button>
                <Link
                  to="/courses"
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Back to courses
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-semibold">Course overview</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {courseDescription}
          </p>

          {course?.outcomes && Array.isArray(course.outcomes) && (
            <div className="mt-8">
              <h3 className="mb-3 text-xl font-semibold">What you will learn</h3>
              <ul className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
                {course.outcomes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailOffline;
