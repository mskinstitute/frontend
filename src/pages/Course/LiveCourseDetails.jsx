import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, GraduationCap } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';

const LiveCourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch('/live-courses.json');
        const items = await response.json();
        const found = items.find((item) => String(item.id) === String(id));
        if (found) {
          setCourse(found);
          setError(null);
        } else {
          setError('Live course not found');
        }
      } catch (err) {
        setError('Unable to load live course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">{error}</h2>
          <Link to="/live-courses" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
            <BookOpen className="w-5 h-5" />
            Browse Live Courses
          </Link>
        </div>
      </div>
    );
  }
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Helmet><title>{course.title} – Live Course – MSK Institute</title></Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-300 mb-6">{course.description || course.sort_description}</p>
        <Link to="/live-courses" className="text-indigo-400 hover:text-indigo-300">← Back to Live Courses</Link>
      </div>
    </div>
  );
};

export default LiveCourseDetails;

