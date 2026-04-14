import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { phonepeApi } from '../../api/phonepeApi';

/**
 * PhonePe Checkout Component
 * Handles payment initiation and redirects to PhonePe payment gateway
 */
const PhonePeCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, ready, redirecting, error
  const [paymentData, setPaymentData] = useState(null);

  // Get amount and metadata from query params or location state
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount') || location.state?.amount;
  const courseId = queryParams.get('course_id') || location.state?.courseId;

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        if (!amount) {
          setError('Payment amount is required');
          setStatus('error');
          return;
        }

        // Convert rupees to paisa (1 rupee = 100 paisa)
        const amountInPaisa = parseInt(amount) * 100;

        // Get current page URL as redirect URL
        const redirectUrl = `${window.location.origin}/live-courses/${courseId || 'callback'}/payment-success`;

        // Prepare metadata
        const metadata = {
          udf1: courseId || '',
          udf2: id || '',
          udf3: 'web',
        };

        // Store pending payment info in sessionStorage for verification later
        if (courseId) {
          sessionStorage.setItem('pending_merchant_order_id', id);
          sessionStorage.setItem('pending_course_id', courseId);
        }

        // Initiate payment through backend
        const response = await phonepeApi.initiatePayment(
          amountInPaisa,
          redirectUrl,
          metadata
        );

        if (response.redirect_url) {
          setPaymentData(response);
          setStatus('redirecting');

          // Redirect to PhonePe checkout
          setTimeout(() => {
            window.location.href = response.redirect_url;
          }, 1500);
        } else {
          setError('Failed to get payment checkout URL');
          setStatus('error');
        }
      } catch (err) {
        console.error('Payment initiation error:', err);
        setError(
          err.response?.data?.error ||
          err.message ||
          'Failed to initiate payment'
        );
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    initiatePayment();
  }, [amount, courseId, id]);

  const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardBgClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textMutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <>
      <Helmet>
        <title>PhonePe Payment Checkout – MSK Institute</title>
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center px-4 ${bgClass}`}>
        <div className={`max-w-md w-full p-8 rounded-xl border ${cardBgClass}`}>
          
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <h2 className="text-xl font-bold mb-2">Preparing Payment</h2>
              <p className={`text-sm ${textMutedClass}`}>
                Please wait while we redirect you to PhonePe...
              </p>
            </div>
          )}

          {status === 'redirecting' && (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-bold mb-2">Redirecting</h2>
              <p className={`text-sm ${textMutedClass}`}>
                Redirecting you to PhonePe payment gateway...
              </p>
              {paymentData && (
                <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-indigo-50/30'}`}>
                  <p className={`text-xs ${textMutedClass}`}>Amount</p>
                  <p className="font-semibold">₹{(paymentData.amount / 100).toFixed(2)}</p>
                  {paymentData.order_id && (
                    <>
                      <p className={`text-xs mt-3 ${textMutedClass}`}>Order ID</p>
                      <p className="text-sm font-mono">{paymentData.order_id}</p>
                    </>
                  )}
                </div>
              )}
              <p className={`text-xs mt-4 ${textMutedClass}`}>
                If you are not redirected automatically, please wait a moment.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-red-600">Payment Error</h2>
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
                  className="w-full py-2 px-4 border rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Back to Courses
                </button>
              </div>

              <p className={`text-xs mt-4 ${textMutedClass}`}>
                If the problem persists, please contact our support team.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PhonePeCheckout;
