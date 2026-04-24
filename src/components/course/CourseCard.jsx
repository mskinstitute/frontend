import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users, BookOpen, Radio, CalendarDays } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import LiveBadge from "./LiveBadge";
import LiveTimeInfo from "./LiveTimeInfo";
import DemoCountdownCompact from "./DemoCountdownCompact";
import { slugify } from "../../utils/slugify";

const CourseCard = ({ course }) => {
  const { theme } = useContext(ThemeContext);

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
    if (url.includes('drive.google.com') && url.includes('/view')) return false;
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

  // Demo date logic
  const nextDemoDate = course?.demo_date ? new Date(course.demo_date) : null;
  const hasUpcomingDemo = nextDemoDate && nextDemoDate > new Date();

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${hasUpcomingDemo ? 'border-t-4 border-t-indigo-500' : ''} ${theme === 'dark'
      ? 'bg-gray-900 border-gray-700 hover:border-blue-600'
      : 'bg-white border-gray-200 hover:border-blue-300'
      }`}>

      <Link to={`/courses/${courseSlug}`} className="block relative">
        {/* Live Course Badge */}
        {course.is_live_course && (
          <LiveBadge status={course.live_status} theme={theme} />
        )}

        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title?.slice(0, 30) || 'Course')}`;
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
          <span className="text-white text-sm font-medium">
            Click to view details
          </span>
        </div>
      </Link>

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
                <BookOpen className="w-4 h-4" />
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

        {/* Demo Countdown */}
        {hasUpcomingDemo && (
          <div className="mt-3">
            <DemoCountdownCompact targetDate={nextDemoDate} theme={theme} />
          </div>
        )}

        <Link
          to={`/courses/${courseSlug}`}
          className={`block mt-2 w-full text-center py-2.5 text-white font-semibold rounded-lg transition-colors duration-200 ${theme === 'dark'
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          Explore Course <BookOpen className="w-4 h-4 ml-2 inline" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;

