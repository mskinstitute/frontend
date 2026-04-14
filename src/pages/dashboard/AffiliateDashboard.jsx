import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { ThemeContext } from '../../context/ThemeContext';

const AffiliateDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAffiliate = async () => {
      setLoading(true);
      try {
        // Try the most likely endpoints — app may mount affiliate routes differently
        const tryUrls = ['/affiliate/profile/', '/api/affiliate/profile/'];
        let resp = null;
        for (const url of tryUrls) {
          try {
            resp = await api.get(url);
            if (resp && resp.data) break;
          } catch (e) {
            // ignore and try next
          }
        }

        if (!resp || !resp.data) {
          setError('Affiliate features are not available on the API (endpoint not found).');
          setProfile(null);
        } else {
          // If viewset list returns results in array, pick first
          const data = Array.isArray(resp.data) ? resp.data[0] : resp.data;
          setProfile(data);
        }
      } catch (err) {
        setError('Failed to fetch affiliate data');
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliate();
  }, []);

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className={`p-4 rounded ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'}`}>{error}</div>
        ) : !profile ? (
          <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p>You do not have an affiliate profile yet.</p>
            <p>If you want to become an affiliate, contact support or check the admin dashboard.</p>
          </div>
        ) : (
          <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-semibold">Your Affiliate Profile</h2>
            <p>Referral Link: <a className="text-blue-500" href={profile.referral_link}>{profile.referral_link}</a></p>
            <p>Total Earnings: ₹{parseFloat(profile.total_earnings || 0).toFixed(2)}</p>
            <p>Pending Earnings: ₹{parseFloat(profile.pending_earnings || 0).toFixed(2)}</p>
            <p>Total Referred Users: {profile.total_referred_users}</p>
            <p>Successful Referrals: {profile.total_successful_referrals}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateDashboard;
