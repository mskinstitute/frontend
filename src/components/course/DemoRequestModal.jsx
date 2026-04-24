import React, { useState, useContext } from 'react';
import { X, User, Phone, BookOpen, Calendar, Loader } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';

const DemoRequestModal = ({ isOpen, onClose, course, timestamp }) => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        timestamp: timestamp || new Date().toISOString(),
        sheetName: 'demoRequest',
        courseId: course.id,
        courseTitle: course.title,
        coursePrice: course.price ?? 0,
        courseDiscount: course.discount ?? 0,
        studentName: formData.name.trim(),
        studentPhone: formData.phone.replace(/\s+/g, ''),
        studentDemoDate: course.demo_date || '',
        source: 'course_detail_page'
      };

      await fetch('https://script.google.com/macros/s/AKfycbxScY9TYGyIz038mWOzYVbqy2hUxpdrybN6SFsQXXOsMVczbj-3Juhjy4bIO6nRv1o0/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(submissionData)
      });

      toast.success('Demo request submitted successfully! We will contact you soon.');
      setFormData({ name: '', phone: '' });
      onClose();
    } catch (error) {
      console.error('Demo request submission error:', error);
      toast.error('Failed to submit request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-60 px-4 py-6">
      <div className="mx-auto w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className={`${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Request Free Demo
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  3 Days Demo Class
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Course Info Card */}
            <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {course.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Duration: {course.duration ? `${course.duration} ${course.duration > 1 ? 'Months' : 'Month'}` : '1 Month'}
                  </p>
                  <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    Free 3 Days Demo
                  </p>
                </div>
              </div>
            </div>

            {/* Full Name Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name *
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  required
                />
              </div>
            </div>

            {/* Mobile Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your 10-digit mobile number"
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Request Free Demo
                </>
              )}
            </button>

            {/* Footer Note */}
            <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              We will contact you within 24 hours to schedule your free 3-day demo session.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DemoRequestModal;
