import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Loader2, Clock, Home } from 'lucide-react';
import api from '../../api/axios';
import { ThemeContext } from '../../context/ThemeContext';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [error, setError] = useState(null);
  const [attempting, setAttempting] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const merchantOrderId = sessionStorage.getItem('pending_merchant_order_id');
        const courseId = sessionStorage.getItem('pending_course_id');
        const batchId = sessionStorage.getItem('pending_batch_id');

        if (!merchantOrderId || !courseId) {
          setVerificationStatus('failed');
          setError('Payment session information not found. Please try again.');
          return;
        }

        setAttempting(prev => prev + 1);

        const response = await api.post(
          `/courses/live-courses/${courseId}/verify-payment/`,
          { 
            merchant_order_id: merchantOrderId,
            batch_id: batchId
          }
        );

        if (response.data.success) {
          setVerificationStatus('success');
          setEnrollmentData(response.data.enrollment);
          
          sessionStorage.removeItem('pending_merchant_order_id');
          sessionStorage.removeItem('pending_course_id');
          
          toast.success('Payment confirmed! Enrollment successful.');
          
          setTimeout(() => {
            navigate('/student-dashboard/courses');
          }, 3000);
        } else {
          setVerificationStatus('pending');
          setError('Payment is being processed. Please wait...');
          
          if (attempting < 10) {
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            setError('Payment verification timeout. Please check your account or contact support.');
            setVerificationStatus('failed');
          }
        }
      } catch (err) {
        console.error('Payment verification failed:', err);
        
        if (err.response?.status === 404 && attempting < 10) {
          setVerificationStatus('pending');
          setError('Payment is being processed. Retrying...');
          
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setVerificationStatus('failed');
          setError(
            err.response?.data?.detail ||
            err.response?.data?.error ||
            'Failed to verify payment. Please check your account or contact support.'
          );
        }
      }
    };

    verifyPayment();
  }, []);

  const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardBgClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textMutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const textDimClass = theme === 'dark' ? 'text-gray-500' : 'text-gray-500';

  return (
    <>
      <Helmet>
        <title>Verifying Payment – MSK Institute</title>
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center px-4 ${bgClass}`}>
        <div className={`max-w-md w-full p-8 rounded-xl border ${cardBgClass}`}>
          
          {verificationStatus === 'verifying' && (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <h2 className="text-xl font-bold mb-2">Verifying Payment</h2>
              <p className={`text-sm ${textMutedClass}`}>
                Please wait while we confirm your payment...
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-green-600">Payment Confirmed!</h2>
              <p className={`text-sm mb-6 ${textMutedClass}`}>
                Your enrollment is complete.
              </p>

              {enrollmentData && (
                <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-indigo-50/30'}`}>
                  <p className={`text-xs ${textMutedClass}`}>Enrollment #</p>
                  <p className="font-semibold">{enrollmentData.enrollment_no}</p>
                  <p className={`text-sm mt-2 ${textMutedClass}`}>
                    {enrollmentData.course}
                  </p>
                  {enrollmentData.batch && (
                    <p className={`text-sm ${textMutedClass}`}>
                      {enrollmentData.batch}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate('/student-dashboard/courses')}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
              >
                Go to Dashboard
              </button>
              
              <p className={`text-xs mt-4 ${textDimClass}`}>
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          )}

          {verificationStatus === 'pending' && (
            <div className="text-center">
              <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
              <p className={`text-sm mb-4 ${textMutedClass}`}>
                {error}
              </p>
              <p className={`text-xs ${textDimClass}`}>
                Attempt {attempting} / 10
              </p>
              
              <button
                onClick={() => navigate('/student-dashboard/courses')}
                className="w-full mt-4 py-2 px-4 border rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-red-600">Verification Failed</h2>
              <p className={`text-sm mb-6 ${textMutedClass}`}>
                {error}
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => navigate('/live-courses')}
                  className="w-full py-2 px-4 border rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Courses
                </button>
              </div>

              <p className={`text-xs mt-4 ${textDimClass}`}>
                If you continue to experience issues, please contact our support team.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentCallback;
