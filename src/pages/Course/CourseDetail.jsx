// src/pages/Course/CourseDetail.jsx
import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { externalInstance } from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import VideoPlayer from '../../components/video/VideoPlayer';
import CourseCard from '../../components/course/CourseCard';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { AuthContext } from '../../context/AuthContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
import { slugify } from '../../utils/slugify';
import {
  Play, CalendarDays, BookOpenCheck, Users, Languages, Star,
  PlayCircle, FileText, ChevronDown, ChevronRight, Award,
  Clock, GraduationCap, Globe, BadgeCheck, BarChart,
  BookOpen, Loader2
} from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';


const CourseDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { setBackendAvailable } = useBackendStatus();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkEnroll, setCheckEnroll] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);
  const [readmeContent, setReadmeContent] = useState(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [hasReadmeLink, setHasReadmeLink] = useState(false);

  const setBackendAvailableRef = useRef(setBackendAvailable);

  useEffect(() => {
    setBackendAvailableRef.current = setBackendAvailable;
  }, [setBackendAvailable]);

  // Add to calendar handling
  const handleAddToCalendar = (course) => {
    const event = encodeURIComponent(course.title);
    const start = encodeURIComponent(course.start_time);
    const end = encodeURIComponent(course.end_time);
    const details = encodeURIComponent(course.description || 'Live course session');
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event}&dates=${start}/${end}&details=${details}`,
      '_blank'
    );
  };

  // Form states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [finalPrice, setFinalPrice] = useState('');
  const navigate = useNavigate();

  // Function to fetch README from GitHub URL
  const fetchReadmeFromGitHub = async (readmeUrl) => {
    if (!readmeUrl) {
      setHasReadmeLink(false);
      setReadmeContent(null);
      return;
    }

    setReadmeLoading(true);
    try {
      // Convert GitHub HTML URL to raw content URL
      let rawUrl = readmeUrl;
      if (readmeUrl.includes('github.com')) {
        rawUrl = readmeUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      const { data } = await externalInstance.get(rawUrl);
      setReadmeContent(data);
      setHasReadmeLink(true);
    } catch (error) {
      console.error('Failed to fetch README:', error);
      setHasReadmeLink(false);
      setReadmeContent(null);
      toast.error('Could not load README file');
    } finally {
      setReadmeLoading(false);
    }
  };

  // -----------------------------
  // Fetch course details
  // -----------------------------
  const fetchCourse = useCallback(async (signal) => {
    const loadStaticCourse = async () => {
      try {
        const response = await fetch('/all-courses.json');
        const items = await response.json();
        const normalizedSlug = slugify(slug);
        const fallbackCourse = items.find((item) => {
          const itemSlug = slugify(item.slug || item.title);
          return itemSlug === normalizedSlug || String(item.id) === String(slug);
        });
        if (fallbackCourse) {
          const normalizedCourse = {
            ...fallbackCourse,
            slug: fallbackCourse.slug || slugify(fallbackCourse.title),
            id: fallbackCourse.id ?? slugify(fallbackCourse.title),
            level: typeof fallbackCourse.level === 'string'
              ? { name: fallbackCourse.level }
              : fallbackCourse.level,
            sort_description: fallbackCourse.sort_description || fallbackCourse.description || '',
            description: fallbackCourse.description || fallbackCourse.sort_description || fallbackCourse.title || '',
            chapters: fallbackCourse.chapters?.map((chapter, chapterIndex) => ({
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
          setBackendAvailableRef.current(false);
          setNotFound(false);
          setError(null);
          setHasReadmeLink(false);
          setReadmeContent(null);
          setActiveTab('curriculum');
          return true;
        }
      } catch (fallbackErr) {
        console.error('Failed to load static course fallback', fallbackErr);
        return false;
      }
      return false;
    };

    try {
      setLoading(true);
      const { data } = await axios.get(`/courses/courses/${slug}/with_chapters/`, { signal });
      setCourse(data);
      setOpenChapter(data.chapters?.[0]?.id || null);
      setBackendAvailableRef.current(true);

      if (data.github_readme_link) {
        await fetchReadmeFromGitHub(data.github_readme_link);
      } else {
        setHasReadmeLink(false);
        setReadmeContent(null);
        setActiveTab('curriculum');
      }
    } catch (err) {
      if (!signal.aborted) {
        const shouldFallback = !err.response || (err.response.status >= 500 && err.response.status < 600);
        if (shouldFallback) {
          const loaded = await loadStaticCourse();
          if (!loaded) {
            setCourse(null);
            setNotFound(true);
            setError('Course not found');
          }
        } else {
          setCourse(null);
          if (err.response?.status === 404) {
            setNotFound(true);
          } else {
            toast.error('Course not found');
          }
        }
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [slug, fetchReadmeFromGitHub]);

  const toggleChapter = (chapterId) => {
    setOpenChapter(openChapter === chapterId ? null : chapterId);
  };

  const handleEnroll = async () => {
    try {
      setIsSubmitting(true);
      const enrollData = couponCode ? { coupon_code: couponCode } : {};

      const response = await axios.post(`/courses/courses/${slug}/enroll/`, enrollData);

      if (response.data.success) {
        if (response.data.is_free) {
          toast.success("Successfully enrolled in the course!");
          // Redirect to dashboard or course content
          navigate('/dashboard');
        } else if (response.data.payment_required) {
          // Handle payment flow
          toast.success("Coupon applied successfully! Proceeding to payment...");
          // Here you would integrate with payment gateway
          // For now, just show the final amount
          alert(`Final amount to pay: ₹${response.data.final_amount}`);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to enroll. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookDemo = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a demo class");
      navigate('/auth/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post('/courses/demo-bookings/book_demo/', {
        course_id: course.id
      });

      toast.success("Demo class booked successfully! Check your email for details.");
      // Optionally redirect to dashboard or show booking details
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to book demo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Effects with AbortController
  // -----------------------------
  useEffect(() => {
    const controller = new AbortController();
    fetchCourse(controller.signal);
    return () => controller.abort();
  }, [fetchCourse]);

  if (loading) return <LoadingSkeleton />;
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Course Not Found</h2>
          <p className="text-gray-400 mb-6">The course you are looking for may have been deleted, unpublished, or the URL is incorrect.</p>
          <a href="/courses" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Browse Courses
          </a>
        </div>
      </div>
    );
  }
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Unable to load course</h2>
          <p className="text-gray-400">There was an error loading this course. Please try again later.</p>
          <a href="/courses" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Browse Courses
          </a>
        </div>
      </div>
    );
  }

  const discountedPrice =
    course.discount === 100 || course.price === 0
      ? 'Free'
      : `₹ ${Math.round(course.price * (1 - course.discount / 100))}`;


  return (
    <>

      <Helmet>
        {/* 🔹 Basic Meta */}
        <title>{course.title} | MSK Institute</title>
        <meta
          name="description"
          content={
            course.short_description ||
            "Learn coding and computer skills with MSK Institute – practical, affordable, and career-focused courses."
          }
        />
        <meta
          name="keywords"
          content={`MSK Institute, ${course.title}, ${course.category?.name || ""}, online learning, coding, programming, education`}
        />
        <meta name="author" content="MSK Institute" />
        <link rel="canonical" href={`https://mskinstitute.in/courses/${course.slug}`} />

        {/* 🔹 Open Graph / Facebook / LinkedIn */}
        <meta property="og:title" content={`${course.title} | MSK Institute`} />
        <meta
          property="og:description"
          content={
            course.short_description ||
            "Join MSK Institute's hands-on courses and boost your career in tech."
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mskinstitute.in/courses/${course.slug}`} />
        <meta
          property="og:image"
          content={course.image || "https://mskinstitute.in/static/default-course.jpg"}
        />
        <meta property="og:site_name" content="MSK Institute" />

        {/* 🔹 Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${course.title} | MSK Institute`} />
        <meta
          name="twitter:description"
          content={
            course.short_description ||
            "Learn practical skills with MSK Institute’s affordable online courses."
          }
        />
        <meta
          name="twitter:image"
          content={course.image || "https://mskinstitute.in/static/default-course.jpg"}
        />

        {/* 🔹 Schema.org JSON-LD for Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description":
              course.short_description ||
              "Learn coding and computer skills with MSK Institute.",
            "provider": {
              "@type": "Organization",
              "name": "MSK Institute",
              "sameAs": "https://mskinstitute.in",
            },
            "educationalCredentialAwarded": course.certificate
              ? "Certificate of Completion"
              : "No Certificate",
            "offers": {
              "@type": "Offer",
              "url": `https://mskinstitute.in/courses/${course.slug}`,
              "priceCurrency": "INR",
              "price": course.discount_price || course.price || "0",
              "availability": "https://schema.org/InStock",
              "validFrom": new Date().toISOString(),
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "duration": course.duration ? `P${course.duration}D` : "P30D", // ISO 8601 duration
              "instructor": {
                "@type": "Person",
                "name": course.instructor?.name || "MSK Instructor",
              },
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": course.average_rating || "4.5",
              // "reviewCount": course.total_reviews || "25",
            },
          })}
        </script>
      </Helmet>


      <div className="bg-gray-900 min-h-screen text-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-12 mb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left: Video + Price */}
              <div className="space-y-6">
                <div className="relative">
                  {(() => {
                    const placeholder = `https://placehold.co/800x400/0f172a/ffffff?text=${encodeURIComponent(course.title)}`;
                    const featuredImage = course.featured_image?.url || course.featured_image || course.featured_image_url || null;

                    if (course.featured_video) {
                      return (
                        <VideoPlayer
                          videoId={course.featured_video}
                          poster={featuredImage || placeholder}
                        />
                      );
                    }

                    // No video: show featured image if present (without overlay), else placeholder with overlay
                    if (featuredImage) {
                      return (
                        <div className="aspect-video rounded-xl overflow-hidden relative shadow-2xl bg-gray-800">
                          <img
                            src={featuredImage}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    }

                    return (
                      <div className="aspect-video rounded-xl overflow-hidden relative shadow-2xl bg-gray-800 flex items-center justify-center">
                        <img
                          src={placeholder}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                            <p>No video available</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Price Section */}
                <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">

                    {/* Left Section */}
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs sm:text-sm">Course Fee</p>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400">
                          {couponApplied ? finalPrice : discountedPrice}
                        </span>

                        {course.discount !== 100 && course.price !== 0 && !couponApplied && (
                          <del className="text-base sm:text-lg text-gray-500">₹{course.price}</del>
                        )}

                        {couponApplied && (
                          <del className="text-base sm:text-lg text-gray-500">{discountedPrice}</del>
                        )}
                      </div>
                    </div>

                    {/* Right Discount Badge */}
                    {course.discount !== 100 && course.price !== 0 && (
                      <div className="bg-yellow-500/10 text-yellow-500 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg self-start sm:self-auto">
                        <span className="text-base sm:text-lg font-bold">{course.discount}%</span>
                        <span className="text-xs sm:text-sm"> OFF</span>
                      </div>
                    )}

                  </div>


                  {/* Coupon Code Section */}
                  {course.price > 0 && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          disabled={isSubmitting}
                        />
                        <button
                          onClick={async () => {
                            if (!couponCode.trim()) return;
                            try {
                              const response = await axios.post(`/courses/courses/${slug}/enroll/`, { coupon_code: couponCode });
                              if (response.data.success && response.data.payment_required) {
                                setCouponApplied({
                                  code: couponCode,
                                  discount: response.data.discount_amount,
                                  finalAmount: response.data.final_amount
                                });
                                setFinalPrice(`₹ ${response.data.final_amount}`);
                                toast.success(`Coupon applied! Saved ₹${response.data.discount_amount}`);
                              }
                            } catch (error) {
                              toast.error(error?.response?.data?.error || "Invalid coupon code");
                              setCouponApplied(null);
                              setFinalPrice(discountedPrice);
                            }
                          }}
                          disabled={!couponCode.trim() || isSubmitting}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                      {couponApplied && (
                        <div className="text-green-400 text-sm">
                          ✓ Coupon "{couponApplied.code}" applied! You save ₹{couponApplied.discount}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Call to action button - DISABLED for demo booking */}
                  <button
                    disabled={true}
                    className="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <CalendarDays className="w-5 h-5" />
                    <span>Demo Booking Disabled</span>
                  </button>

                  {/* Add to Calendar Button for Live Courses */}
                  {course.is_live_course && course.live_status === 'upcoming' && (
                    <button
                      onClick={() => handleAddToCalendar(course)}
                      className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <CalendarDays className="w-5 h-5" />
                      <span>Add to Calendar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Course Information */}
              <div className="space-y-6">
                {/* Course Title and Description */}
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">{course.title}</h1>
                  <p className="text-gray-300 text-lg leading-relaxed">{course.sort_description}</p>
                </div>

                {/* Course Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <CalendarDays className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Duration</h3>
                      <p className="text-gray-400">{course.duration} {course.duration === 1 ? "Month" : "Months"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <BookOpenCheck className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{course.course_type === 'COMBO' ? 'Courses' : 'Chapters'}</h3>
                      <p className="text-gray-400">
                        {course.course_type === 'COMBO'
                          ? `${course.single_courses?.length || 0} courses included`
                          : `${course.chapters?.length || 0} chapters`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <Languages className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Language</h3>
                      <p className="text-gray-400">{course.language || 'English'}</p>
                    </div>
                  </div>

                  {course.certificate && (
                    <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                      <div className="mt-1">
                        <Award className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Certificate</h3>
                        <p className="text-gray-400">Course completion certificate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-700">
              {['overview', 'curriculum'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === 'overview' && !hasReadmeLink) return; // Prevent clicking if no README
                    setActiveTab(tab);
                  }}
                  disabled={tab === 'overview' && !hasReadmeLink}
                  className={`flex-1 py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium tracking-wide transition-colors
                    ${tab === 'overview' && !hasReadmeLink
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : activeTab === tab
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  title={tab === 'overview' && !hasReadmeLink ? 'No README available' : ''}
                >
                  {tab === 'overview' ? 'Course Overview' : 'Course Curriculum'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 lg:p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && hasReadmeLink && (
                <div className="space-y-8">
                  {readmeLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                  ) : readmeContent ? (
                    <MarkdownRenderer content={readmeContent} />
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">README content not available</p>
                    </div>
                  )}
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {course.course_type === 'COMBO' ? 'Included Courses' : 'Course Curriculum'}
                  </h2>
                  <div className="space-y-4">
                    {course.course_type === 'COMBO' ? (
                      // Display courses for combo type
                      course.single_courses?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {course.single_courses?.map((includedCourse) => (
                            <CourseCard
                              key={includedCourse.id}
                              course={{
                                ...includedCourse,
                                featured_image_url: includedCourse.featured_image_url || null,
                                language: includedCourse.language || []
                              }}
                            />
                          )) || (
                              <div className="text-gray-500">No courses available.</div>
                            )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No courses added to this combo yet</p>
                        </div>
                      )
                    ) : (
                      // Display chapters for regular course
                      course.chapters?.length > 0 ? (
                        course.chapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className="bg-gray-700/30 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleChapter(chapter.id)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-100">{chapter.title}</h3>
                                  {chapter.topics?.length > 0 && (
                                    <p className="text-sm text-gray-400">{chapter.topics.length} topics</p>
                                  )}
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${openChapter === chapter.id ? 'rotate-180' : ''
                                  }`}
                              />
                            </button>

                            {openChapter === chapter.id && (
                              <div className="border-t border-gray-600/50">
                                {chapter.topics?.length > 0 ? (
                                  <div className="p-4 space-y-2">
                                    {chapter.topics.map((topic) => (
                                      <div
                                        key={topic.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-600/30 transition-colors group"
                                      >
                                        <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                                          {topic.title}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {topic.video_url && (
                                            <a
                                              href={topic.video_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                                              title="Watch Video"
                                            >
                                              <PlayCircle className="w-4 h-4" />
                                            </a>
                                          )}
                                          {topic.notes_url && (
                                            <a
                                              href={topic.notes_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                                              title="View Notes"
                                            >
                                              <FileText className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="p-4 text-sm text-gray-400">No topics available yet</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Course curriculum coming soon...</p>
                        </div>
                      )
                    )}
                  </div>
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
