import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
// OptimizedImage not used here; using VideoPlayer or plain img for hero
import LiveTimeInfo from '../../components/course/LiveTimeInfo';
import VideoPlayer from '../../components/video/VideoPlayer';
import { BookOpen, CalendarDays, Clock, Users, ChevronDown, PlayCircle, Play, FileText, GraduationCap, Award } from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';

const LiveCourseDetailsNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { setBackendAvailable } = useBackendStatus();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isDemoBooked, setIsDemoBooked] = useState(false);
  const [totalDemoBookings, setTotalDemoBookings] = useState(0);

  const toggleChapter = (chapterId) => {
    setOpenChapter(openChapter === chapterId ? null : chapterId);
  };

  const handleBookDemo = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a demo class");
      navigate('/auth/login');
      return;
    }

    if (isDemoBooked) {
      toast.info("You have already booked the demo class for this course");
      return;
    }

    if (totalDemoBookings >= 3) {
      toast.error("You have reached the maximum limit of 3 demo bookings");
      return;
    }

    try {
      setIsBooking(true);
      const response = await axios.post('/courses/demo-bookings/book_demo/', {
        course_id: course.id
      });

      setIsDemoBooked(true);
      setTotalDemoBookings(prev => prev + 1);
      toast.success("Demo class booked successfully! Check your email for details.");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to book demo. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const [courseRes, curriculumRes] = await Promise.all([
          api.get(`/courses/live-courses/${id}/`),
          api.get(`/courses/live-courses/${id}/curriculum/`)
        ]);

        setCourse({ ...courseRes.data, curriculum: curriculumRes.data });
        setBackendAvailable(true);

        if (isAuthenticated) {
          try {
            const [demoCheckRes, totalBookingsRes] = await Promise.all([
              axios.get('/courses/demo-bookings/check/', { params: { course_id: courseRes.data.course?.id || courseRes.data.id } }),
              axios.get('/courses/demo-bookings/')
            ]);
            setIsDemoBooked(demoCheckRes.data.is_booked);
            setTotalDemoBookings(totalBookingsRes.data.length);
          } catch (demoErr) {
            console.error('Failed to check demo booking status:', demoErr);
          }
        }
      } catch (err) {
        console.error('Failed to fetch course details', err);
        const shouldFallback = !err.response || (err.response.status >= 500 && err.response.status < 600);
        if (shouldFallback) {
          try {
            const response = await fetch('/live-courses.json');
            const items = await response.json();
            const fallbackCourse = items.find((item) => item.id?.toString() === id?.toString());
            if (fallbackCourse) {
              setCourse(fallbackCourse);
              setBackendAvailable(false);
              setError(null);
              setLoading(false);
              return;
            }
          } catch (fallbackErr) {
            console.error('Failed to load live course fallback', fallbackErr);
          }
        }
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen p-6">Loading...</div>;
  if (error) return <div className="min-h-screen p-6 text-red-500">{error}</div>;
  if (!course) return null;

  const liveDetailPrice = Number(course.price ?? 0);
  const liveDetailDiscount = Number(course.discount ?? 0);
  const discountedPrice = liveDetailDiscount === 100 || liveDetailPrice === 0
    ? 'Free'
    : `₹ ${Math.round(liveDetailPrice * (1 - liveDetailDiscount / 100))}`;

  // Use next_batch if provided by API (frontend expects ISO datetimes)
  const nextBatch = course.next_batch || null;
  const batchStart = nextBatch && nextBatch.start_datetime ? new Date(nextBatch.start_datetime) : (course.start_time ? new Date(course.start_time) : null);

  // Auto-calc duration between start and end (returns human friendly string)
  const calculateDuration = (start, end) => {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e) || e <= s) return null;
    const diffMs = e - s;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays >= 30) {
      const months = Math.round(diffDays / 30);
      return `${months} ${months > 1 ? 'Months' : 'Month'}`;
    }
    return `${diffDays} ${diffDays > 1 ? 'Days' : 'Day'}`;
  };

  const autoDuration = nextBatch && nextBatch.start_datetime && nextBatch.end_datetime
    ? calculateDuration(nextBatch.start_datetime, nextBatch.end_datetime)
    : calculateDuration(course.start_time, course.end_time);

  return (
    <div className={`bg-gray-900 min-h-screen text-white`}>
      <Helmet>
        <title>{course.title} | MSK Institute</title>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-12 mb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Image / Video */}
            <div className="space-y-6">
              <div className="relative">
                {course.featured_video ? (
                  <VideoPlayer
                    videoId={course.featured_video}
                    poster={course.featured_image?.url || course.featured_image_url || course.course?.featured_image_url || course.course?.featured_image}
                  />
                ) : (
                  <div className="aspect-video rounded-xl overflow-hidden relative shadow-2xl bg-gray-800 flex items-center justify-center">
                    <img
                      src={course.featured_image?.url || course.featured_image_url || course.course?.featured_image_url || course.course?.featured_image || `https://placehold.co/800x400/0f172a/ffffff?text=${encodeURIComponent(course.title)}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p className="text-gray-400">No video available</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-gray-400 text-sm">Course Fee</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-green-400">{discountedPrice}</span>
                      {course.discount !== 100 && course.price !== 0 && (
                        <del className="text-lg text-gray-500">₹{course.price}</del>
                      )}
                    </div>
                  </div>
                  {course.discount !== 100 && course.price !== 0 && (
                    <div className="bg-yellow-500/10 text-yellow-500 px-3 py-2 rounded-lg">
                      <span className="text-lg font-bold">{course.discount}%</span>
                      <span className="text-sm"> OFF</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBookDemo}
                  disabled={isBooking || isDemoBooked || totalDemoBookings >= 3}
                  className={`w-full text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition ${
                    isDemoBooked || totalDemoBookings >= 3
                      ? 'bg-gray-600 cursor-not-allowed'
                      : isBooking
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isDemoBooked
                    ? 'Demo Already Booked'
                    : totalDemoBookings >= 3
                      ? 'Demo Limit Reached (3/3)'
                      : isBooking
                        ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            <span>Booking...</span>
                          </>
                        )
                        : (
                          <>
                            <CalendarDays className="w-5 h-5" />
                            <span>Book Free 3 Days Demo Class</span>
                          </>
                        )
                  }
                </button>

                {course.live_status === 'upcoming' && (
                  <button
                    onClick={() => {
                      const startDT = nextBatch?.start_datetime || course.start_time;
                      const endDT = nextBatch?.end_datetime || course.end_time;
                      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(course.title)}&dates=${encodeURIComponent(startDT)}/${encodeURIComponent(endDT)}`);
                    }}
                    className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <CalendarDays className="w-5 h-5" />
                    <span>Add to Calendar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">{course.title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{course.short_description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                  <div className="mt-1">
                    <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Course Duration</h3>
                    <p className="text-gray-400">{autoDuration || (course.duration ? `${course.duration} ${course.duration === 1 ? 'Month' : 'Months'}` : 'TBA')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                  <div className="mt-1">
                    <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Class Duration</h3>
                    <p className="text-gray-400">{course.class_duration ? `${course.class_duration} ${course.class_duration > 1 ? 'Hours' : 'Hour'}` : '1 Hour'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                  <div className="mt-1">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instructor</h3>
                    <p className="text-gray-400">{course.instructor_name || course.instructor || 'TBA'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                  <div className="mt-1">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Level</h3>
                    <p className="text-gray-400">{course.level?.name || course.course?.level?.name || 'Not specified'}</p>
                  </div>
                </div>

                {(course.has_certificate || course.course?.certificate) && (
                  <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <Award className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Certificate</h3>
                      <p className="text-gray-400">Issued on completion</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upcoming Batches */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Upcoming Batches</h2>
          <div className="space-y-4">
            {course.upcoming_batches && course.upcoming_batches.length > 0 ? (
              course.upcoming_batches.map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700/30 rounded-lg gap-2">
                  <div>
                    <div className="font-medium">{b.batch_name || 'Batch'}</div>
                    <div className="text-sm text-gray-400">{b.start_datetime ? new Date(b.start_datetime).toLocaleString() : (b.start_date || 'TBA')}</div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {b.end_datetime ? new Date(b.end_datetime).toLocaleString() : (b.end_date || '')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-6">No upcoming batches</div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Course Curriculum</h2>
          <div className="space-y-4">
            {course.curriculum && course.curriculum.length > 0 ? (
              course.curriculum.map((chapter, idx) => (
                <div key={chapter.id} className="p-4 rounded-lg border transition-colors duration-200 bg-gray-700/30">
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
                    <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${openChapter === chapter.id ? 'rotate-180' : ''}`} />
                  </button>

                  {openChapter === chapter.id && (
                    <div className="border-t border-gray-600/50">
                      {chapter.topics?.length > 0 ? (
                        <div className="p-4 space-y-2">
                          {chapter.topics.map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-600/30 transition-colors group">
                              <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{topic.title}</span>
                              <div className="flex items-center gap-2">
                                {topic.video_url && (
                                  <a href={topic.video_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-gray-700" title="Watch Video">
                                    <PlayCircle className="w-4 h-4" />
                                  </a>
                                )}
                                {topic.notes_url && (
                                  <a href={topic.notes_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-gray-700" title="View Notes">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCourseDetailsNew;
