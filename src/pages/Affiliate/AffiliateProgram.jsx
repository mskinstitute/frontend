import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Wallet, Users, Coins, GraduationCap, DollarSign, Share2 } from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const AffiliateProgram = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [checkingAffiliate, setCheckingAffiliate] = useState(false);
  const isDark = theme === 'dark';

  const handleBecomeAffiliate = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (isAffiliate) {
      // Already affiliate - safety check to avoid POSTing again
      navigate('/affiliate-dashboard');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/affiliate/profile/become-affiliate/');
      if (response.data) {
        toast.success('Welcome to our Affiliate Program!');
        navigate('/affiliate-dashboard');
      }
    } catch (error) {
      // If backend says user is already an affiliate (400), silently redirect without any toast
      if (error.response?.status === 400) {
        const msg = (error.response?.data && (error.response.data.error || error.response.data.message)) || '';
        if (typeof msg === 'string' && msg.toLowerCase().includes('already')) {
          // Silent redirect - don't show any toast or error
          setIsAffiliate(true);
          navigate('/affiliate-dashboard', { replace: true });
          setLoading(false);
          return;
        }
      }
      // If backend returns 405, try to GET the profile as a fallback (maybe created already)
      if (error.response?.status === 405) {
        toast.error('Method "POST" not allowed. Verifying status...');
        try {
          const { data } = await axios.get('/affiliate/profile/');
          const hasProfile = Array.isArray(data) ? data.length > 0 : !!data?.id;
          if (hasProfile) {
            toast.success('You are already an affiliate. Redirecting...');
            navigate('/affiliate-dashboard');
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore and show generic error below
        }
      }

      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to join affiliate program';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // On mount (or when user changes), check if the user is already an affiliate and redirect
  useEffect(() => {
    let mounted = true;
    const checkAffiliate = async () => {
      if (!user) return;
      setCheckingAffiliate(true);
      try {
        const { data } = await axios.get('/affiliate/profile/');
        const hasProfile = Array.isArray(data) ? data.length > 0 : !!data?.id;
        if (mounted) {
          setIsAffiliate(hasProfile);
          if (hasProfile) {
            navigate('/affiliate-dashboard');
          }
        }
      } catch (err) {
        // ignore 401/403 or network errors here
      } finally {
        if (mounted) setCheckingAffiliate(false);
      }
    };
    checkAffiliate();
    return () => { mounted = false; };
  }, [user, navigate]);

  const features = [
    {
      icon: <Coins className="h-12 w-12 text-blue-500" />,
      title: 'High Commission Rates',
      description: 'Earn up to 50% commission on every successful referral enrollment.'
    },
    {
      icon: <Share2 className="h-12 w-12 text-purple-500" />,
      title: 'Easy Sharing',
      description: 'Get your unique referral link and share it anywhere - social media, WhatsApp, or email.'
    },
    {
      icon: <Wallet className="h-12 w-12 text-green-500" />,
      title: 'Secure Payments',
      description: 'Track your earnings in real-time and withdraw securely to your bank account.'
    },
    {
      icon: <Users className="h-12 w-12 text-red-500" />,
      title: 'Referral Tracking',
      description: 'Monitor your referrals, visits, and conversions with detailed analytics.'
    },
  ];

  const stats = [
    { number: '1000+', label: 'Active Affiliates' },
    { number: '₹10L+', label: 'Paid to Affiliates' },
    { number: '5000+', label: 'Successful Referrals' },
    { number: '50%', label: 'Max Commission Rate' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Affiliate Program
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Partner with MSK Institute and earn money by referring students to our quality courses.
          </p>
          <button
            onClick={isAffiliate ? () => navigate('/affiliate-dashboard') : handleBecomeAffiliate}
            disabled={loading || checkingAffiliate}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            {loading || checkingAffiliate ? 'Processing...' : (user && isAffiliate ? 'Go to Your Dashboard' : 'Become an Affiliate Now')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stat.number}</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>Why Become an Affiliate?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-lg text-center transition-colors ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className={`py-16 transition-colors ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Register</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Sign up and get approved as an affiliate partner</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Share</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Share your unique referral link with potential students</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Earn</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Earn commissions when referred students enroll</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="container mx-auto px-4 py-16">
        <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>How much can I earn?</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Commission rates start at 15% and can go up to 50% based on your performance. The more students you refer, the higher your commission rate.</p>
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>When do I get paid?</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Commissions are added to your wallet after the referred student's enrollment is confirmed. You can withdraw your earnings once they exceed ₹1000.</p>
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Who can become an affiliate?</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Anyone can apply! Whether you're a student, teacher, or professional - if you can bring students to our platform, you're welcome to join.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8">Join our affiliate program today and start earning commissions!</p>
          <button
            onClick={isAffiliate ? () => navigate('/affiliate-dashboard') : handleBecomeAffiliate}
            disabled={loading || checkingAffiliate}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            {loading || checkingAffiliate ? 'Processing...' : (user && isAffiliate ? 'Go to Your Dashboard' : 'Become an Affiliate Now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;
