import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, BookOpen, Award } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import LiveBadge from './LiveBadge';

const LiveCourseCardLargeNew = ({ course }) => {
  const { theme } = useContext(ThemeContext);

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

  const imageUrl = 
    isValidImageUrl(resolveImg(course.featured_image_url)) ? resolveImg(course.featured_image_url) :
    isValidImageUrl(resolveImg(course.featured_image)) ? resolveImg(course.featured_image) :
    isValidImageUrl(resolveImg(course.course?.featured_image_url)) ? resolveImg(course.course?.featured_image_url) :
    isValidImageUrl(resolveImg(course.course?.featured_image)) ? resolveImg(course.course?.featured_image) :
    `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title?.slice(0, 30) || 'Course')}`;

  const liveCoursePrice = Number(course.price ?? 0);
  const liveCourseDiscount = Number(course.discount ?? 0);
  const discountedPrice =
    liveCourseDiscount === 100 || liveCoursePrice === 0
      ? 'Free'
      : `₹ ${Math.round(liveCoursePrice * (1 - liveCourseDiscount / 100))}`;
  const liveCourseLevel = course.level?.name || course.level || course.course?.level?.name || course.course?.level || 'All Levels';

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme === 'dark' ? 'bg-gray-900 border-gray-700 hover:border-blue-600' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
      <Link to={`/live-courses/${course.id}`} className="block relative">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title?.slice(0, 30) || 'Course')}`;
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4`}>
          <span className="text-white text-sm font-medium">Click to view details</span>
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <h3 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} title={course.title}>{course.title}</h3>

        <p className={`text-sm line-clamp-2 min-h-[40px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {course.description || course.sort_description || course.course?.sort_description || 'No description available.'}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-3">
          {(() => {
            // Prefer related course data when available
            const base = course.course || course;
            // Determine chapters count robustly from multiple possible sources
            const chaptersNum =
              (base.course_type === 'COMBO' ? (base.single_courses?.length || 0) :
                (base.chapters_count != null ? base.chapters_count : (base.chapters?.length || course.chapters_count || course.chapters?.length || 0)));
            const chaptersLabel = base.course_type === 'COMBO' ? `${chaptersNum} Courses` : `${chaptersNum} Chapters`;

            // Compute duration from next_batch if available
            const computeDuration = () => {
              try {
                if (course.next_batch && course.next_batch.start_datetime && course.next_batch.end_datetime) {
                  const s = new Date(course.next_batch.start_datetime);
                  const e = new Date(course.next_batch.end_datetime);
                  if (!isNaN(s) && !isNaN(e) && e > s) {
                    const diffMs = e - s;
                    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                    if (diffDays >= 30) {
                      const months = Math.round(diffDays / 30);
                      return `${months} ${months > 1 ? 'Months' : 'Month'}`;
                    }
                    return `${diffDays} ${diffDays > 1 ? 'Days' : 'Day'}`;
                  }
                }
              } catch (e) {
                // ignore
              }
              return base.duration ? `${base.duration} ${base.duration > 1 ? 'Months' : 'Month'}` : '1 Month';
            };

            return (
              <>
                <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">{chaptersLabel}</span>
                </div>

                <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{computeDuration()}</span>
                </div>
              </>
            );
          })()}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`px-3 p-1.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>{liveCourseLevel}</span>
          <span className={`px-3 p-1.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>{course.mode || 'Online'}</span>
          {(course.has_certificate) && (
          <div className="p-1.5 rounded-full bg-orange-500 text-white text-xs font-semibold flex items-center">
            <Award className="w-4 h-4" />
            <span>Certificate</span>
          </div>
        )}
        </div>

        <div className="flex justify-between items-center mt-3 text-sm">
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{(discountedPrice || '₹ 0').toString()}</span>
          {liveCourseDiscount > 0 && (
            <div className="flex flex-col items-end">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{course.discount}% OFF</span>
              <span className={`text-xs line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>₹{(course.price || 0).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <Link to={`/live-courses/${course.id}`} className={`block mt-2 w-full text-center py-2.5 text-white font-semibold rounded-lg transition-colors duration-200 ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
          View Details <BookOpen className="w-4 h-4 ml-2 inline" />
        </Link>
      </div>
    </div>
  );
};

export default LiveCourseCardLargeNew;

