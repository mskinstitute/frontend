import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  Clock,
  Award,
  ShieldCheck,
  ChevronLeft,
  CheckCircle,
  Info,
  Users,
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import DemoRequestModal from '../../components/course/DemoRequestModal';
import ClassCountdown from '../../components/course/ClassCountdown';

const formatDateTime = (value) => {
  if (!value) return 'TBA';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (value) => {
  if (!value) return 'TBA';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const LiveCourseDetails = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoTimestamp, setDemoTimestamp] = useState(null);

  const loadCourse = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/live-courses.json');
      const items = await response.json();
      const foundCourse = items.find((item) => String(item.id) === String(id));
      if (!foundCourse) {
        setError('Live course not found');
        setCourse(null);
        return;
      }
      setCourse(foundCourse);
      setError(null);
    } catch (err) {
      console.error('Failed to load live course details:', err);
      setError('Unable to load live course details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const openDemoModal = () => {
    setDemoTimestamp(new Date().toISOString());
    setIsDemoOpen(true);
  };

  const closeDemoModal = () => {
    setIsDemoOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-10">
        <div className="text-center space-y-3">
          <div className="animate-pulse rounded-full h-12 w-12 bg-slate-700 mx-auto" />
          <p className="text-lg text-gray-300">Loading live course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-xl">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-3">{error}</h2>
          <p className="text-gray-400 mb-6">The live course could not be loaded right now. Please verify the course link or return to the live course list.</p>
          <Link
            to="/live-courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Live Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const priceValue = Number(course.price ?? 0);
  const discountValue = Number(course.discount ?? 0);
  const discountedPrice = priceValue > 0
    ? `₹ ${Math.round(priceValue * (1 - discountValue / 100))}`
    : 'Free';
  const hasDiscount = priceValue > 0 && discountValue > 0;
  const durationLabel = course.duration ? `${course.duration} ${course.duration === 1 ? 'Month' : 'Months'}` : '1 Month';
  const levelLabel = course.level || 'All Levels';
  const liveStatusLabel = String(course.live_status || 'upcoming').replace('_', ' ').toUpperCase();
  const nextDemo = course.next_demo_date || course.demo_date;
  const startDate = course.next_batch?.start_datetime || course.start_time;
  const endDate = course.next_batch?.end_datetime || course.end_time;
  const courseImage = course.featured_image_url || course.featured_image || `https://placehold.co/900x600/0f172a/ffffff?text=${encodeURIComponent(course.title || 'Live+Course')}`;
  const topicsCount = course.chapters?.reduce((sum, chapter) => sum + (chapter.topics?.length || 0), 0) || 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Helmet>
        <title>{course.title} | Live Courses – MSK Institute</title>
        <meta name="description" content={course.sort_description || course.description || 'Join a live course from MSK Institute.'} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Link to="/live-courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Live Courses
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/15 px-4 py-2 text-sm font-semibold text-blue-50 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {liveStatusLabel}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">{course.title}</h1>
            <p className="max-w-3xl text-base sm:text-lg text-slate-400">{course.sort_description || course.description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className={`rounded-3xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Next class starts</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{formatDateTime(startDate)}</p>
            </div>
            {nextDemo && (
              <div className={`rounded-3xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Demo class</p>
                    <p className="mt-2 text-lg font-semibold text-slate-100">{formatDateTime(nextDemo)}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-200">Free</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8">
            <div className={`overflow-hidden rounded-[2.25rem] border shadow-2xl ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
              <img
                src={courseImage}
                alt={course.title}
                className="w-full h-[420px] object-cover"
                loading="lazy"
              />
              <div className="p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Mode</p>
                    <p className="text-base font-semibold text-slate-100">{course.mode || 'Online'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Level</p>
                    <p className="text-base font-semibold text-slate-100">{levelLabel}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Duration</p>
                    <p className="mt-2 text-lg font-semibold text-white">{durationLabel}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Chapters</p>
                    <p className="mt-2 text-lg font-semibold text-white">{course.chapters?.length || 0}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Topics</p>
                    <p className="mt-2 text-lg font-semibold text-white">{topicsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-[2rem] border p-6 sm:p-8 ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Course investment</p>
                  <div className="mt-3 flex items-end gap-3">
                    <span className="text-4xl font-extrabold text-white">{discountedPrice}</span>
                    {hasDiscount && (
                      <span className="text-sm line-through text-slate-500">₹{priceValue.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={openDemoModal}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Request Free Demo
                  </button>
                  <Link
                    to="/live-courses"
                    className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-100 transition-colors duration-200 hover:border-slate-500 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to courses
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Course status</p>
                  <p className="mt-2 text-white font-semibold">{liveStatusLabel}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Certificate</p>
                  <p className="mt-2 text-white font-semibold">{course.has_certificate ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {nextDemo && <div className="mt-6">
                <ClassCountdown targetDate={nextDemo} />
              </div>}
            </div>

            <div className={`rounded-[2rem] border p-6 sm:p-8 ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              <p className="text-sm text-slate-400 mb-6">Live classroom sessions mapped to practical projects and instructor-led support.</p>
              <div className="space-y-4">
                {(course.chapters || []).map((chapter, chapterIndex) => (
                  <details key={chapterIndex} className="group rounded-3xl border border-slate-700/50 bg-slate-950/70 p-4 transition duration-200 open:bg-slate-900">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-base font-semibold text-white">
                      <span>{chapter.title}</span>
                      <span className="text-sm text-slate-400">{chapter.topics?.length || 0} topics</span>
                    </summary>
                    <div className="mt-4 space-y-3 pb-2 text-sm text-slate-300">
                      {chapter.topics?.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-3 rounded-2xl bg-slate-950/80 p-3">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>{topic.title || topic.name || `Topic ${topicIndex + 1}`}</span>
                        </div>
                      ))}
                      {!chapter.topics?.length && (
                        <p className="text-slate-500">No topics listed for this chapter.</p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className={`rounded-[2rem] border p-6 sm:p-8 ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-3xl bg-blue-500/10 p-3 text-blue-300">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Instructor</p>
                  <p className="mt-2 text-lg font-semibold text-white">{course.instructor_name || 'MSK Instructor'}</p>
                  <p className="mt-2 text-sm text-slate-400">Experienced trainer for live sessions, project support and career guidance.</p>
                </div>
              </div>
            </div>

            <div className={`rounded-[2rem] border p-6 sm:p-8 ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
              <h3 className="text-xl font-semibold mb-4">What you get</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-400"><CheckCircle className="w-4 h-4" /></span>
                  <span>Live instructor-led sessions with practical projects.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-400"><ShieldCheck className="w-4 h-4" /></span>
                  <span>Certificate of completion and placement guidance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-400"><Award className="w-4 h-4" /></span>
                  <span>Curated course content for real-world job readiness.</span>
                </li>
              </ul>
            </div>

            <div className={`rounded-[2rem] border p-6 sm:p-8 ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-3xl bg-slate-800 p-3 text-slate-200">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Need help?</p>
                  <p className="text-base font-semibold text-white">Contact our support team</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">For course questions, batch details, or enrollment assistance, our team is ready to help.</p>
              <a href="tel:+911234567890" className="mt-5 inline-flex items-center justify-center rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700">
                Call support
              </a>
            </div>
          </aside>
        </div>
      </div>

      <DemoRequestModal isOpen={isDemoOpen} onClose={closeDemoModal} course={course} timestamp={demoTimestamp} />
    </div>
  );
};

export default LiveCourseDetails;

