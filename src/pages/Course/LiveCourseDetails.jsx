import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { 
  Play, Clock, Users, Award, CalendarDays, MapPin, 
  BookOpen, ChevronRight, BadgeCheck, Loader2, Radio,
  Share2, Heart
} from 'lucide-react';
import api from '../../api/axios';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

const LiveCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const [courseRes, curriculumRes] = await Promise.all([
          api.get(`/courses/live-courses/${id}/`),
          api.get(`/courses/live-courses/${id}/curriculum/`).catch(() => ({ data: [] }))
        ]);

        setCourse({
          ...courseRes.data,
          curriculum: curriculumRes.data || []
        });

        // Check wishlist status after course is loaded
        if (isAuthenticated) {
          checkWishlistStatus();
        }
      } catch (err) {
        console.error('Failed to fetch course details', err);
        setError(err.response?.data?.detail || err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated]);

  const checkWishlistStatus = async () => {
    try {
      setCheckingWishlist(true);
      const response = await api.get('/courses/wishlists/check/', {
        params: { live_course_id: id }
      });
      setIsWishlisted(response.data.is_wishlisted);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    } finally {
      setCheckingWishlist(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      navigate('/auth/login');
      return;
    }

    try {
      const response = await api.post('/courses/wishlists/toggle/', {
        live_course_id: id
      });
      setIsWishlisted(response.data.is_wishlisted);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update wishlist");
    }
  };

  const handleAddToCalendar = (course) => {
    if (!course.start_time || !course.end_time) {
      toast.error('Calendar dates not available');
      return;
    }
    const event = encodeURIComponent(course.title);
    const start = new Date(course.start_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(course.end_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const details = encodeURIComponent(course.description || 'Live course session');
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event}&dates=${start}/${end}&details=${details}`,
      '_blank'
    );
  };

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      navigate(`/live-courses/${id}/enroll`);
    } catch (error) {
      toast.error('Failed to proceed with enrollment');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Course Not Found</h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {error}
          </p>
          <button
            onClick={() => navigate('/live-courses')}
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Live Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const discountedPrice =
    course.discount === 100 || course.price === 0
      ? 'Free'
      : `₹ ${Math.round(course.price * (1 - course.discount / 100))}`;

  const startDate = course.start_time 
    ? new Date(course.start_time).toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    : 'TBA';

  const startTime = course.start_time 
    ? new Date(course.start_time).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    : 'TBA';

  // Auto-calc duration between start and end
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

  const autoDuration = calculateDuration(course.start_time, course.end_time);

  return (
    <>
      <Helmet>
        <title>{course.title} – Live Course – MSK Institute</title>
        <meta name="description" content={course.description || `Join ${course.title} live course at MSK Institute`} />
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        {/* Hero Section */}
        <div className={`${theme === 'dark' ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-blue-50 to-gray-50'} py-12 mb-10`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Left: Featured Image + Price Card */}
              <div className="space-y-6">
                {/* Featured Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                    <img
                      src={course.featured_image?.url || course.featured_image_url || course.featured_image || `https://placehold.co/800x450/0f172a/ffffff?text=${encodeURIComponent(course.title)}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white opacity-75" />
                    </div>
                  </div>

                  {/* Live Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-red-900/90 text-red-200'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <Radio className="w-4 h-4 animate-pulse" />
                      LIVE
                    </div>
                  </div>
                </div>

                {/* Price and Enrollment Card */}
                <div className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 hover:border-indigo-600'
                    : 'bg-white/50 border-gray-200 hover:border-indigo-600'
                }`}>
                  <div className="mb-6">
                    <p className={`text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Price
                    </p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-3xl sm:text-4xl font-bold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {discountedPrice}
                      </span>
                      {course.discount > 0 && course.discount !== 100 && (
                        <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          theme === 'dark'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.discount}% OFF
                        </div>
                      )}
                    </div>
                    {course.discount > 0 && course.discount !== 100 && (
                      <del className={`text-lg ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ₹{course.price}
                      </del>
                    )}
                  </div>

                  {/* Enrollment Button */}
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 mb-3 ${
                      theme === 'dark'
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                    }`}
                  >
                    {isEnrolling ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        <span>Enroll Now</span>
                      </>
                    )}
                  </button>

                  {/* Add to Calendar Button */}
                  <button
                    onClick={() => handleAddToCalendar(course)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 text-gray-200'
                        : 'bg-gray-100/50 hover:bg-gray-200/50 border-gray-300 text-gray-800'
                    }`}
                  >
                    <CalendarDays className="w-5 h-5" />
                    <span>Add to Calendar</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={handleWishlistToggle}
                    disabled={checkingWishlist}
                    className={`w-full mt-3 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                      checkingWishlist
                        ? 'opacity-50 cursor-not-allowed'
                        : isWishlisted
                        ? 'bg-red-500/20 text-red-500 border-2 border-red-500'
                        : theme === 'dark'
                        ? 'bg-gray-700/30 text-gray-300 border-2 border-gray-600 hover:border-red-500'
                        : 'bg-gray-200/30 text-gray-700 border-2 border-gray-300 hover:border-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    <span>{checkingWishlist ? 'Loading...' : isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>

              {/* Right: Course Information */}
              <div className="space-y-6">
                {/* Course Title and Meta */}
                <div className="space-y-4">
                  <h1 className={`text-3xl md:text-4xl font-bold leading-tight ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {course.title}
                  </h1>
                  
                  <p className={`text-lg leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {course.description || course.sort_description}
                  </p>
                </div>

                {/* Key Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Instructor */}
                  <div className={`flex items-start gap-3 p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100/50 border border-gray-200'
                  }`}>
                    <Users className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-sm">Instructor</h3>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {course.instructor_name || course.instructor || 'TBA'}
                      </p>
                    </div>
                  </div>

                  {/* Start Date & Time */}
                  <div className={`flex items-start gap-3 p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100/50 border border-gray-200'
                  }`}>
                    <CalendarDays className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-sm">Starts</h3>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {startDate}
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {startTime}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className={`flex items-start gap-3 p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100/50 border border-gray-200'
                  }`}>
                    <Clock className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-sm">Duration</h3>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {autoDuration || (course.duration ? `${course.duration} ${course.duration === 1 ? 'Month' : 'Months'}` : 'TBA')}
                      </p>
                    </div>
                  </div>

                  {/* Level */}
                  <div className={`flex items-start gap-3 p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100/50 border border-gray-200'
                  }`}>
                    <BookOpen className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-sm">Level</h3>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {course.level?.name || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100/50 border border-gray-200'
                  }`}>
                    <Clock className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-sm">Class Duration</h3>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {course.class_duration ? `${course.class_duration} ${course.class_duration > 1 ? 'Hours' : 'Hour'}` : '1 Hour'}
                      </p>
                    </div>
                  </div>

                  {/* Certificate */}
                  <div className={`flex items-start gap-3 p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100/50 border border-gray-200'
                  }`}>
                    <Award className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-sm">Certificate</h3>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Included
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className={`rounded-xl overflow-hidden shadow-xl border ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            {/* Tab Buttons */}
            <div className={`flex border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {['overview', 'curriculum'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 ${
                    activeTab === tab
                      ? `bg-indigo-600 text-white`
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'overview' ? 'Overview' : 'Curriculum'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  {/* About Course */}
                  <div>
                    <h2 className={`text-2xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      About This Course
                    </h2>
                    <p className={`text-lg leading-relaxed whitespace-pre-line ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {course.description}
                    </p>
                  </div>

                  {/* What You'll Learn */}
                  {course.features && course.features.length > 0 && (
                    <div>
                      <h2 className={`text-2xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        What You'll Learn
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <BadgeCheck className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            }`} />
                            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {feature}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  {course.curriculum && course.curriculum.length > 0 ? (
                    course.curriculum.map((chapter, idx) => (
                      <div key={chapter.id} className={`p-4 rounded-lg border transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700/30 border-gray-600 hover:border-indigo-500'
                          : 'bg-gray-50 border-gray-200 hover:border-indigo-500'
                      }`}>
                        <h3 className={`font-semibold flex items-center gap-2 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <ChevronRight className="w-4 h-4" />
                          Chapter {idx + 1}: {chapter.title}
                        </h3>
                        {chapter.topics && chapter.topics.length > 0 && (
                          <ul className="ml-6 mt-3 space-y-2">
                            {chapter.topics.map((topic) => (
                              <li key={topic.id} className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                • {topic.title}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className={`text-center py-8 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Curriculum coming soon...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveCourseDetails;
