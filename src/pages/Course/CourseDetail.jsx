import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { slugify } from '../../utils/slugify';
import {
  CalendarDays, BookOpenCheck, Languages, Award, ChevronDown,
  BookOpen, PlayCircle, FileText, GraduationCap
} from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);

  const loadCourse = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/all-courses.json');
      const items = await response.json();

      const normalizedSlug = slugify(slug);
      const foundCourse = items.find((item) => {
        const itemSlug = item.slug ? slugify(item.slug) : slugify(item.title || String(item.id || ''));
        return itemSlug === normalizedSlug;
      });

      if (foundCourse) {
        const normalizedCourse = {
          ...foundCourse,
          slug: foundCourse.slug || slugify(foundCourse.title),
          chapters: foundCourse.chapters?.map((chapter, chapterIndex) => ({
            ...chapter,
            id: chapter.id || `chapter-${chapterIndex + 1}`,
            topics: chapter.topics?.map((topic, topicIndex) => ({
              ...topic,
              id: topic.id || `topic-${chapterIndex + 1}-${topicIndex + 1}`
            })) || []
          })) || []
        };
        setCourse(normalizedCourse);
        setOpenChapter(normalizedCourse.chapters?.[0]?.id || null);
        setError(null);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      console.error('Failed to load course:', err);
      setError('Unable to load course details.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const discountedPrice = course?.price && course.price > 0
    ? `₹ ${Math.round(course.price * (1 - (course.discount || 0) / 100))}`
    : 'Free';

  const toggleChapter = (chapterId) => {
    setOpenChapter(openChapter === chapterId ? null : chapterId);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Course Not Found</h2>
          <p className="text-gray-400 mb-8">{error || 'Course information unavailable.'}</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} | MSK Institute</title>
        <meta name="description" content={course.sort_description || 'Learn coding and computer skills with MSK Institute.'} />
      </Helmet>

      <div className="bg-gray-900 min-h-screen text-white">
        {/* Hero */}
        <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-black py-10 sm:py-16 mb-8 sm:mb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
              {/* Left: Image + Price */}
              <div className="space-y-6">
                <div className="aspect-[16/9] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-gray-800 relative group">
                  <img
                    src={course.featured_image_url || `https://placehold.co/900x506/1e293b/ffffff?text=${course.title.substring(0,20)}...`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Price Card */}
                <div className="bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-gray-600 shadow-2xl">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">Price</p>
                      <div className="flex items-baseline gap-2 sm:gap-3">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 drop-shadow-lg">{discountedPrice}</span>
                        {course.price > 0 && course.discount > 0 && (
                          <span className="text-base sm:text-xl text-gray-500 line-through">₹{course.price}</span>
                        )}
                      </div>
                    </div>
                    {course.discount > 0 && (
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 px-3 sm:px-6 py-1.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold border border-yellow-500/30 shadow-lg text-sm sm:text-base">
                        −{course.discount}%
                      </div>
                    )}
                  </div>

                  <button
                    disabled
                    className="w-full bg-gray-600 text-gray-400 font-bold py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-2xl text-base sm:text-lg shadow-xl cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
                    Offline Mode — Booking Unavailable
                  </button>
                </div>
              </div>

              {/* Right: Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">
                    {course.mode?.toUpperCase() || 'ONLINE'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {course.title}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">{course.sort_description}</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 bg-gray-800/40 hover:bg-gray-700/60 rounded-2xl border border-gray-700/50 transition-all cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 text-base sm:text-lg mb-1 group-hover:text-white">Duration</h3>
                      <p className="text-sm sm:text-base text-gray-400">{course.duration} {course.duration === 1 ? 'Month' : 'Months'}</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 bg-gray-800/40 hover:bg-gray-700/60 rounded-2xl border border-gray-700/50 transition-all cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 text-base sm:text-lg mb-1 group-hover:text-white">{course.course_type === 'COMBO' ? 'Courses' : 'Chapters'}</h3>
                      <p className="text-sm sm:text-base text-gray-400">{course.chapters?.length || 0} Modules</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 bg-gray-800/40 hover:bg-gray-700/60 rounded-2xl border border-gray-700/50 transition-all cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 text-base sm:text-lg mb-1 group-hover:text-white">Languages</h3>
                      <p className="text-sm sm:text-base text-gray-400">{Array.isArray(course.language) ? course.language.join(', ') : course.language?.join(', ') || 'English'}</p>
                    </div>
                  </div>

                  {course.certificate && (
                    <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 bg-gray-800/40 hover:bg-gray-700/60 rounded-2xl border border-gray-700/50 transition-all cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-100 text-base sm:text-lg mb-1 group-hover:text-white">Certificate</h3>
                        <p className="text-sm sm:text-base text-gray-400">Awarded on completion</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-12 border border-gray-700 shadow-2xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Course Curriculum
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-300">Explore {course.chapters?.length || 0} chapters with {course.chapters?.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0) || 0} topics</p>
              </div>
            </div>

            <div className="space-y-4 pr-4 -mr-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
              {course.chapters?.map((chapter) => (
                <div key={chapter.id} className="group">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 lg:p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 hover:from-gray-800/70 hover:to-gray-700/70 rounded-2xl lg:rounded-3xl border border-gray-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">{chapter.title}</h3>
                        <p className="text-sm sm:text-base text-indigo-300 font-semibold">{chapter.topics?.length || 0} Topics</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-400 transition-transform duration-300 ${openChapter === chapter.id ? 'rotate-180 scale-110' : ''}`} />
                  </button>

                  {openChapter === chapter.id && (
                    <div className="mt-4 pl-4 sm:pl-8 lg:pl-24 pr-4 lg:pr-8 pb-4 lg:pb-8 space-y-3 animate-in slide-in-from-top-4 duration-300">
                      {chapter.topics && chapter.topics.length > 0 ? (
                        chapter.topics.map((topic) => (
                          <div key={topic.id} className="group/topic flex items-start justify-between p-3 sm:p-4 lg:p-6 bg-gray-800/40 hover:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-600/50 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1">
                            <span className="flex-1 text-gray-200 font-medium text-sm sm:text-base lg:text-lg group-hover/topic:text-white pr-4 leading-relaxed">
                              {topic.title}
                            </span>
                            <div className="flex items-center gap-2 opacity-60 group-hover/topic:opacity-100 transition-opacity">
                              {topic.video_url && (
                                <a
                                  href={topic.video_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-indigo-300 hover:from-indigo-500/40 hover:to-blue-500/40 hover:text-indigo-200 rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                                  title="Watch Video"
                                >
                                  <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                </a>
                              )}
                              {topic.notes_url && (
                                <a
                                  href={topic.notes_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 hover:from-emerald-500/40 hover:to-teal-500/40 hover:text-emerald-200 rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                                  title="View Notes"
                                >
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 sm:p-6 lg:p-8 text-center py-8 sm:py-10 lg:py-12 bg-gray-800/30 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-600">
                          <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 text-base sm:text-lg">Topics for this chapter coming soon...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {(!course.chapters || course.chapters.length === 0) && (
                <div className="p-8 sm:p-12 lg:p-16 text-center bg-gray-800/30 rounded-2xl lg:rounded-3xl border-2 border-dashed border-gray-600">
                  <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-500 mx-auto mb-4 sm:mb-6 opacity-50" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">Curriculum Coming Soon</h3>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">Course content and detailed chapter breakdown will be available soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;

