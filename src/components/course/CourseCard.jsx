import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Users, BookOpen, Heart, Radio, CalendarDays } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { useBackendStatus } from "../../context/BackendStatusContext";
import OptimizedImage from "../common/OptimizedImage";
import LiveBadge from "./LiveBadge";
import LiveTimeInfo from "./LiveTimeInfo";
import DemoBookingModal from "./DemoBookingModal";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { slugify } from "../../utils/slugify";

const CourseCard = ({ course }) => {
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(false);
  const [isDemoBooked, setIsDemoBooked] = useState(false);
  const [checkingDemo, setCheckingDemo] = useState(false);
  const [totalDemoBookings, setTotalDemoBookings] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Check wishlist and demo booking status on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
      checkDemoBookingStatus();
    }
  }, [isAuthenticated, course.id]);

  const checkWishlistStatus = async () => {
    try {
      setCheckingWishlist(true);
      const response = await axios.get('/courses/wishlists/check/', {
        params: { course_id: course.id }
      });
      setIsWishlisted(response.data.is_wishlisted);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    } finally {
      setCheckingWishlist(false);
    }
  };

  const checkDemoBookingStatus = async () => {
    try {
      setCheckingDemo(true);
      const response = await axios.get('/courses/demo-bookings/check/', {
        params: { course_id: course.id }
      });
      setIsDemoBooked(response.data.is_booked);

      // Also get total demo bookings count
      const totalResponse = await axios.get('/courses/demo-bookings/');
      setTotalDemoBookings(totalResponse.data.length);
    } catch (error) {
      console.error('Failed to check demo booking status:', error);
    } finally {
      setCheckingDemo(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      navigate('/auth/login');
      return;
    }

    try {
      const response = await axios.post('/courses/wishlists/toggle/', {
        course_id: course.id
      });
      setIsWishlisted(response.data.is_wishlisted);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update wishlist");
    }
  };

  const handleBookDemo = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isBackendAvailable) {
      setShowDemoModal(true);
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to book demo class");
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
      toast.error(error?.response?.data?.error || "Failed to book demo class");
    } finally {
      setIsBooking(false);
    }
  };

  const courseSlug = course.slug || slugify(course.title);
  const coursePrice = Number(course.price ?? 0);
  const courseDiscount = Number(course.discount ?? 0);
  const courseLevel = course.level?.name || course.level || 'All Levels';
  const chaptersCount = course.course_type === 'COMBO'
    ? (course.single_courses?.length || course.chapters?.length || course.chapters_count || 0)
    : (course.chapters_count || course.chapters?.length || 0);

  const isDefaultImage = !course.featured_image_url || course.featured_image_url?.includes("/media/course/poster/default.jpg");
  const resolveImg = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return String(img);
  };
  
  // Check if image URL is valid (not a Google Drive view link or invalid URL)
  const isValidImageUrl = (url) => {
    if (!url) return false;
    // Reject Google Drive view links (they don't work as image sources)
    if (url.includes('drive.google.com') && url.includes('/view')) return false;
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  const imageUrl = isDefaultImage
    ? `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title?.slice(0, 30) || 'Course')}`
    : (isValidImageUrl(resolveImg(course.featured_image_url)) ? resolveImg(course.featured_image_url) : 
       isValidImageUrl(resolveImg(course.featured_image)) ? resolveImg(course.featured_image) :
       `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title?.slice(0, 30) || 'Course')}`);

  const discountedPrice =
    courseDiscount === 100 || coursePrice === 0
      ? 'Free'
      : `₹ ${Math.round(coursePrice * (1 - courseDiscount / 100))}`;

  const { isBackendAvailable } = useBackendStatus();
  const detailsDisabled = !isBackendAvailable;



  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme === 'dark'
      ? 'bg-gray-900 border-gray-700 hover:border-blue-600'
      : 'bg-white border-gray-200 hover:border-blue-300'
      }`}>




      {detailsDisabled ? (
        <div className="block relative cursor-not-allowed opacity-90">
          <OptimizedImage
            src={imageUrl}
            alt={course.title}
            className="w-full h-48"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            fallbackSrc={`https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent("Loading...")}`}
          />
        </div>
      ) : (
        <>

          <button
            onClick={handleWishlistToggle}
            disabled={checkingWishlist}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${theme === 'dark'
              ? 'bg-gray-800/80 hover:bg-gray-700'
              : 'bg-white/80 hover:bg-gray-100'
              } ${checkingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${isWishlisted
                ? 'fill-red-500 stroke-red-500'
                : theme === 'dark'
                  ? 'stroke-gray-300'
                  : 'stroke-gray-600'
                }`}
            />
          </button>


          <Link to={`/courses/${courseSlug}`} className="block relative">
            {/* Live Course Badge */}
            {course.is_live_course && (
              <LiveBadge status={course.live_status} theme={theme} />
            )}

            <OptimizedImage
              src={imageUrl}
              alt={course.title}
              className="w-full h-48"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              fallbackSrc={`https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent("Loading...")}`}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
              <span className="text-white text-sm font-medium">
                Click to view details
              </span>
            </div>
          </Link>
        </>

      )}

      <div className="p-5 space-y-3">
        <h3 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} title={course.title}>
          {course.title}
        </h3>

        <p className={`text-sm line-clamp-2 min-h-[40px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
          {course.sort_description || "No description available."}
        </p>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          {/* Duration + Chapters/Courses */}
          <div
            className={`flex items-center gap-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
          >
            {/* Live course timing or chapters/courses */}
            {course.is_live_course ? (
              <LiveTimeInfo
                startTime={course.start_time}
                endTime={course.end_time}
                theme={theme}
                showDuration={false}
              />
            ) : (
              <>
                {/* Agar combo course hai to Courses icon, warna Chapters icon */}
                {course.course_type === "COMBO" ? (
                  <BookOpen className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {course.course_type === "COMBO"
                    ? `${course.single_courses?.length || course.chapters?.length || 0} Courses`
                    : `${chaptersCount} Chapters`}
                </span>
              </>
            )}
          </div>

          {/* Duration */}
          {course.is_live_course ? (
            <div
              className={`flex flex-col text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>
                  {course.duration ? `${course.duration} ${course.duration > 1 ? 'Months' : 'Month'}` : '1 Month'}
                </span>
              </div>
              <div className="text-xs mt-0.5">
                Class: {course.class_duration ? `${course.class_duration} ${course.class_duration > 1 ? 'Hours' : 'Hour'}` : '1 Hour'}
              </div>
            </div>
          ) : course.duration && (
            <div
              className={`flex items-center gap-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {course.duration} {course.duration > 1 ? "Months" : "Month"}
              </span>
            </div>
          )}

        </div>


        {/* Course Mode, Level and Type */}
        <div className="flex flex-wrap gap-2 mt-3">
          {/* Level */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
            ? 'bg-purple-900 text-purple-200'
            : 'bg-purple-100 text-purple-800'
            }`}>
            {courseLevel}
          </span>

          {/* Mode(s) */}
          {course.mode === 'BOTH' ? (
            <>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
                ? 'bg-blue-900 text-blue-200'
                : 'bg-blue-100 text-blue-800'
                }`}>
                Online
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
                ? 'bg-indigo-900 text-indigo-200'
                : 'bg-indigo-100 text-indigo-800'
                }`}>
                Offline
              </span>
            </>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
              ? 'bg-blue-900 text-blue-200'
              : 'bg-blue-100 text-blue-800'
              }`}>
              {course.mode}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-3 text-sm">
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            {(discountedPrice || 0).toLocaleString("en-IN")}
          </span>
          {course.discount > 0 && (
            <div className="flex flex-col items-end">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                {course.discount}% OFF
              </span>
              <span className={`text-xs line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                ₹{(course.price || 0).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        {/* Book Demo Button */}
        <button
          onClick={handleBookDemo}
          disabled={isBooking || isDemoBooked || totalDemoBookings >= 3}
          className={`block mt-4 w-full text-center py-2.5 text-white font-semibold rounded-lg transition-colors duration-200 ${isDemoBooked || totalDemoBookings >= 3
            ? 'bg-gray-500 cursor-not-allowed'
            : isBooking
              ? 'bg-gray-500 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isDemoBooked
            ? 'Demo Already Booked'
            : totalDemoBookings >= 3
              ? 'Demo Limit Reached (3/3)'
              : isBooking
                ? 'Booking...'
                : 'Book Free 3 Days Demo'
          }
          <CalendarDays className="w-4 h-4 ml-2 inline" />
        </button>

        {detailsDisabled ? (
          <>
          </>
        ) : (
          <Link
            to={`/courses/${course.slug}`}
            className={`block mt-2 w-full text-center py-2.5 text-white font-semibold rounded-lg transition-colors duration-200 ${theme === 'dark'
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Explore Course <BookOpen className="w-4 h-4 ml-2 inline" />
          </Link>
        )}

        <DemoBookingModal
          isOpen={showDemoModal}
          onClose={() => setShowDemoModal(false)}
          course={course}
        />

        {/* Course Progress (if enrolled) */}
        {course.is_enrolled && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {course.progress || 0}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${course.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;