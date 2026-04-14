import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import {
  Calendar, Clock, Users, CreditCard, CheckCircle,
  AlertCircle, Loader2, ArrowRight, X
} from 'lucide-react';
import api from '../../api/axios';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { convertTo12HourFormat } from '../../utils/dateUtils';

const LiveCourseEnroll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { refreshAccessToken } = useAuth();

  const [course, setCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  // Payment modal / flow states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentWaiting, setPaymentWaiting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    const fetchCourseAndBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching course:', id);
        const [courseRes, batchesRes] = await Promise.all([
          api.get(`/courses/live-courses/${id}/`),
          api.get(`/courses/live-batches/`, {
            params: { course: id, is_active: true }
          }).catch((err) => {
            console.error('Batches fetch error:', err);
            return { data: [] };
          })
        ]);

        console.log('Course data:', courseRes.data);
        console.log('Batches data:', batchesRes.data);
        setCourse(courseRes.data);
        const activeBatches = (batchesRes.data?.results || batchesRes.data || []);
        console.log('Active batches count:', activeBatches.length);
        setBatches(activeBatches);

        // Auto-select first batch if available
        if (activeBatches.length > 0) {
          setSelectedBatch(activeBatches[0].id);
          console.log('Auto-selected batch:', activeBatches[0].id);
        } else {
          console.log('No batches available');
        }
      } catch (err) {
        console.error('Failed to fetch course and batches', err);
        setError(err.response?.data?.detail || err.message || 'Failed to load enrollment data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndBatches();
  }, [id]);

  // When selected batch or course changes, check if user already enrolled
  useEffect(() => {
    if (selectedBatch && course) {
      checkExistingEnrollment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch, course]);

  const handlePaymentInitiate = async () => {
    console.log('handlePaymentInitiate called');
    console.log('selectedBatch:', selectedBatch);
    console.log('course:', course);
    
    if (!selectedBatch) {
      console.log('No batch selected');
      toast.error('Please select a batch');
      return;
    }

    if (!course) {
      console.log('No course data');
      toast.error('Course data not available');
      return;
    }

    // ✅ Check if course is FREE (price=0 or discount=100)
    const isFree = course.price === 0 || course.discount === 100;
    console.log('🎁 Is free course?', isFree);

    if (isFree) {
      // ✅ Free course - auto-enroll without payment
      await createPaymentForMethod('free');
    } else {
      // Paid course - directly initiate PhonePe flow (skip modal)
      // This opens PhonePe checkout in a new tab and polls in the current tab
      console.log('Directly initiating PhonePe payment flow');
      setPaymentMethod('phonepe');
      await createPaymentForMethod('phonepe');
    }
  };

  const checkExistingEnrollment = async () => {
    if (!selectedBatch || !course) return;
    try {
      const resp = await api.get('/courses/live-enrollments/', {
        params: { course: course.id, batch: selectedBatch }
      });
      const results = resp.data?.results || resp.data || [];
      if (Array.isArray(results) && results.length > 0) {
        setIsEnrolled(true);
        setEnrollmentData(results[0]);
      } else {
        setIsEnrolled(false);
        setEnrollmentData(null);
      }
    } catch (err) {
      console.error('checkExistingEnrollment failed', err);
      // don't force logout here; caller/UI will handle auth flows
    }
  };

  const startEnrollmentPolling = async (maxAttempts = 100, intervalMs = 3000) => {
    let attempts = 0;
    setPaymentWaiting(true);
    setPaymentStatus('pending');

    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const resp = await api.get('/courses/live-enrollments/', {
          params: { course: course.id, batch: selectedBatch }
        });
        const results = resp.data?.results || resp.data || [];
        if (Array.isArray(results) && results.length > 0) {
          // Enrollment created by backend webhook — success
          clearInterval(pollRef.current);
          setPaymentWaiting(false);
          setPaymentStatus('success');
          toast.success('Payment confirmed — enrollment complete.');
          // Redirect to student dashboard enrollments after short delay
          setTimeout(() => navigate('/student-dashboard/courses'), 1200);
        } else if (attempts >= maxAttempts) {
          clearInterval(pollRef.current);
          setPaymentWaiting(false);
          setPaymentStatus('timeout');
          toast.error('Payment not confirmed yet. Please check later.');
        }
      } catch (err) {
        console.error('Polling enrollments failed', err);
        // If we got a 401 Unauthorized, try a silent token refresh and retry once
        const status = err.response?.status;
        if (status === 401) {
          try {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              // Retry immediately once after refresh
              const retryResp = await api.get('/courses/live-enrollments/', {
                params: { course: course.id, batch: selectedBatch }
              });
              const retryResults = retryResp.data?.results || retryResp.data || [];
              if (Array.isArray(retryResults) && retryResults.length > 0) {
                clearInterval(pollRef.current);
                setPaymentWaiting(false);
                setPaymentStatus('success');
                toast.success('Payment confirmed — enrollment complete.');
                setTimeout(() => navigate('/student-dashboard/courses'), 1200);
                return;
              }
              // otherwise continue polling normally
              return;
            }
          } catch (refreshErr) {
            console.error('Silent refresh during polling failed', refreshErr);
          }

          // If refresh didn't work, stop polling and ask user to login to claim enrollment
          clearInterval(pollRef.current);
          setPaymentWaiting(false);
          setPaymentStatus('failed');
          toast.error('Session expired. Please log in to complete enrollment.');
          return;
        }
        // For other errors, ignore transient issues and continue polling until maxAttempts
      }
    }, intervalMs);
  };

  const stopEnrollmentPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPaymentWaiting(false);
  };

  const createPaymentForMethod = async (method) => {
    console.log('🔵 createPaymentForMethod called');
    console.log('   Method:', method);
    console.log('   Batch:', selectedBatch);
    console.log('   Course:', course?.id, course?.title);
    
    if (!selectedBatch || !course) {
      toast.error('Please select a batch');
      return;
    }
    
    setIsProcessing(true);
    try {
      const paymentData = {
        batch_id: selectedBatch
      };

      console.log('📤 Sending to API:', `/courses/live-courses/${id}/create-payment/`);
      console.log('📦 Payload:', JSON.stringify(paymentData, null, 2));
      
      const response = await api.post(`/courses/live-courses/${id}/create-payment/`, paymentData);
      console.log('✅ API Response:', response.status, response.data);
      
      const { is_free, checkout_url, merchant_order_id, enrollment_no } = response.data || {};

      // ✅ Handle FREE course enrollment
      if (is_free) {
        console.log('✅ Free course - auto-enrolled');
        toast.success('✅ Successfully enrolled in the course!');
        setShowPaymentModal(false);
        setIsProcessing(false);
        
        // Redirect to dashboard after short delay
        setTimeout(() => navigate('/student-dashboard/courses'), 1000);
        return;
      }

      // Handle PAID course - proceed with payment
      if (!checkout_url) {
        console.error('❌ No checkout_url in response:', response.data);
        toast.error('Failed to generate payment URL');
        setIsProcessing(false);
        return;
      }

      console.log('🔄 Storing session data');
      sessionStorage.setItem('pending_merchant_order_id', merchant_order_id);
      sessionStorage.setItem('pending_course_id', course.id);
      sessionStorage.setItem('pending_batch_id', selectedBatch);
      
      console.log('🚀 Redirecting to PhonePe...');
      toast.success('Opening payment gateway...');
      setShowPaymentModal(false);
      
      // Start polling for enrollment confirmation before opening checkout
      console.log('📊 Starting enrollment polling...');
      startEnrollmentPolling();

      // Open PhonePe checkout in a new tab so user can complete payment
      // and we keep polling here in the main tab to detect the webhook/enrollment
      console.log('🌐 Opening checkout in a new tab');
      try {
        window.open(checkout_url, '_blank');
      } catch (e) {
        // Fallback to navigating if popup blocked
        window.location.href = checkout_url;
      }
      
    } catch (err) {
      console.error('❌ Payment initiation error');
      console.error('   Status:', err.response?.status);
      console.error('   Data:', err.response?.data);
      console.error('   Message:', err.message);
      
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Payment failed. Try again.';
      toast.error(errorMsg);
      setIsProcessing(false);
      setShowPaymentModal(false);
    }
  };

  const cancelPaymentWait = () => {
    stopEnrollmentPolling();
    setPaymentRequest(null);
    setPaymentStatus(null);
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  {/* Payment Options Modal / Polling Status */ }
  {
    (showPaymentModal || paymentWaiting) && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => {
            if (!paymentWaiting) setShowPaymentModal(false);
          }}
        ></div>

        <div
          className={`relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg ${theme === 'dark'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-900'
            }`}
        >
          <div className="flex justify-between items-center p-6 border-b" style={{borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'}}>
            <h3 className="text-xl font-semibold">Choose Payment Method</h3>
            <button
              onClick={() => !paymentWaiting && setShowPaymentModal(false)}
              disabled={paymentWaiting}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <div className="p-6">
            {!paymentWaiting ? (
              <>
                <p
                  className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                >
                  Select your preferred payment option.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('phonepe')}
                    className={`p-3 rounded-lg border ${paymentMethod === 'phonepe'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200'
                      } text-left`}
                  >
                    PhonePe
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-lg border ${paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200'
                      } text-left`}
                  >
                    UPI (QR / ID)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border ${paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200'
                      } text-left`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-lg border ${paymentMethod === 'netbanking'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200'
                      } text-left`}
                  >
                    Netbanking
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => createPaymentForMethod(paymentMethod)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">
                  Waiting for payment confirmation
                </h3>
                <p
                  className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                >
                  The payment page was opened in a new tab. We will confirm your enrollment
                  automatically.
                </p>

                <div className="flex items-center gap-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium">
                      Payment status: {paymentStatus === 'pending' ? 'Pending' : paymentStatus}
                    </p>
                    <p className="text-sm text-gray-500">
                      If this takes long, please check your bank or UPI app.
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={cancelPaymentWait}
                      className="px-3 py-1 rounded-lg border"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }




  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Course</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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

  const selectedBatchData = batches.find(b => b.id === selectedBatch);
  const discountedPrice = course.discount === 100 || course.price === 0
    ? 0
    : Math.round(course.price * (1 - course.discount / 100));
  // Treat course.price as GST-inclusive. Compute the GST portion included in the
  // discounted price and do NOT add it again to the total. For inclusive GST:
  // base = discountedPrice / 1.18, tax = discountedPrice * (18/118)
  const taxAmount = Math.round(discountedPrice * (18 / 118)); // inclusive GST portion
  const finalAmount = discountedPrice; // GST already included in displayed price

  return (
    <>
      <Helmet>
        <title>Enroll in {course.title} – MSK Institute</title>
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/live-courses/${id}`)}
              className={`flex items-center gap-2 mb-6 transition-colors duration-200 ${theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <X className="w-5 h-5" />
              Back to Course
            </button>
            <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              Enroll in {course.title}
            </h1>
            <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Select a batch and complete your enrollment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Batch Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Batch Selection Card */}
              <div className={`p-8 rounded-xl border-2 transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 hover:border-indigo-600'
                : 'bg-white border-gray-200 hover:border-indigo-600'
                }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Select a Batch</h2>
                  {selectedBatch && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                {batches.length > 0 ? (
                  <div className="space-y-4">
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        onClick={() => setSelectedBatch(batch.id)}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${selectedBatch === batch.id
                          ? theme === 'dark'
                            ? 'bg-indigo-600/20 border-indigo-600'
                            : 'bg-indigo-50/50 border-indigo-600'
                          : theme === 'dark'
                            ? 'bg-gray-700/30 border-gray-600 hover:border-indigo-500'
                            : 'bg-gray-50/50 border-gray-300 hover:border-indigo-400'
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center ${selectedBatch === batch.id
                            ? 'bg-indigo-600 border-indigo-600'
                            : theme === 'dark'
                              ? 'border-gray-400'
                              : 'border-gray-400'
                            }`}>
                            {selectedBatch === batch.id && (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-3">
                              {batch.batch_name || `Batch ${batch.id}`}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {batch.start_date && (
                                <div className="flex items-center gap-2">
                                  <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                    }`} />
                                  <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                      }`}>Starts</p>
                                    <p className="text-sm font-medium">
                                      {new Date(batch.start_date).toLocaleDateString('en-IN', {
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {batch.end_date && (
                                <div className="flex items-center gap-2">
                                  <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                    }`} />
                                  <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                      }`}>Ends</p>
                                    <p className="text-sm font-medium">
                                      {new Date(batch.end_date).toLocaleDateString('en-IN', {
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {batch.start_time && (
                                <div className="flex items-center gap-2">
                                  <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                    }`} />
                                  <div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                      }`}>Time</p>
                                    <p className="text-sm font-medium">
                                      {convertTo12HourFormat(batch.start_time)} {batch.end_time && `- ${convertTo12HourFormat(batch.end_time)}`}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No available batches at this time</p>
                  </div>
                )}
              </div>

              {/* Course Summary */}
              {selectedBatchData && (
                <div className={`p-6 rounded-xl border ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
                  }`}>
                  <h3 className="text-lg font-semibold mb-4">Your Selection</h3>
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Batch</p>
                    <p className="font-semibold">
                      {selectedBatchData.batch_name || `Batch ${selectedBatchData.id}`}
                    </p>
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {new Date(selectedBatchData.start_date).toLocaleDateString('en-IN')} - {new Date(selectedBatchData.end_date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Price Summary & Payment */}
            <div className="lg:col-span-1">
              <div className={`sticky top-6 p-6 rounded-xl border-2 transition-all duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-indigo-600'
                : 'bg-gradient-to-b from-indigo-50 to-white border-indigo-600'
                }`}>
                <h3 className="text-lg font-bold mb-6">Price Summary</h3>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Course Price
                    </span>
                    <span className="font-medium">₹{course.price.toLocaleString('en-IN')}</span>
                  </div>

                  {course.discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-500">
                        Discount ({course.discount}%)
                      </span>
                      <span className="font-medium text-green-500">
                        -₹{(course.price * course.discount / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className={`my-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}></div>

                  <div className="flex justify-between items-center text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Subtotal
                    </span>
                    <span className="font-medium">₹{discountedPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      GST (18%)
                    </span>
                    <span className="font-medium text-green-500">Already Included</span>
                  </div>

                  <div className={`my-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}></div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                      ₹{finalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className={`mb-6 p-4 rounded-lg ${theme === 'dark'
                  ? 'bg-gray-700/30 border border-gray-600'
                  : 'bg-indigo-100/30 border border-indigo-200'
                  }`}>
                  <div className="flex items-start gap-2">
                    <CreditCard className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                      }`} />
                    <div className="text-sm">
                      <p className="font-medium">Secure Payment</p>
                      <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Powered by PhonePe
                      </p>
                      <p className={`mt-2 text-xs font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        ✓ GST (18%) is already included
                      </p>
                    </div>
                  </div>
                </div>

                {/* Already Enrolled Banner */}
                {isEnrolled && (
                  <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/40 text-white' : 'bg-green-50 text-green-900'} border ${theme === 'dark' ? 'border-green-700' : 'border-green-100'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">You're already enrolled</p>
                        <p className="text-sm">You are enrolled in this batch. You won't be able to enroll again.</p>
                      </div>
                      <div>
                        <button onClick={() => navigate('/student-dashboard/courses')} className="px-3 py-1 bg-white/10 rounded text-sm">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={handlePaymentInitiate}
                  disabled={isProcessing || !selectedBatch || batches.length === 0 || isEnrolled}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${isProcessing || !selectedBatch || batches.length === 0 || isEnrolled
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isEnrolled ? 'Already Enrolled' : (finalAmount === 0 ? '✅ Enroll Now (Free)' : 'Proceed to Payment')}</span>
                      {!isEnrolled && <ArrowRight className="w-5 h-5" />}
                    </>
                  )}
                </button>

                {/* Security Note */}
                <p className={`text-xs text-center mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                  {finalAmount === 0 ? '🎁 Free Course - No payment needed' : '🔒 Your payment is secure and encrypted'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveCourseEnroll;