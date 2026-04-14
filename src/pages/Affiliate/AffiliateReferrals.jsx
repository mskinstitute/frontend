import React, { useContext, useState, useEffect } from 'react';
import { Copy, TrendingUp } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { 
  getReferrals, 
  getReferralList, 
  copyToClipboard, 
  generateShareUrls, 
  formatCurrency, 
  formatDate 
} from '../../api/affiliateApi';

const AffiliateReferrals = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrls, setShareUrls] = useState({});

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      console.log('[AffiliateReferrals.fetchReferralData] START');
      
      const referralData = await getReferrals();
      console.log('[AffiliateReferrals.fetchReferralData] Referral data:', referralData);
      
      const fullLink = `${window.location.origin}/?ref=${referralData.referralLink}`;
      setReferralLink(fullLink);
      setShareUrls(generateShareUrls(referralData.referralLink));
      
      const referralList = await getReferralList();
      console.log('[AffiliateReferrals.fetchReferralData] Referral list:', referralList);
      
      // Calculate conversions (all registered referrals) and successful (enrolled referrals)
      const conversionsCount = referralList?.length || 0;  // Total referred users registered
      const successfulCount = referralList?.filter(r => r.is_enrolled)?.length || 0;  // Users who enrolled
      
      console.log('[AffiliateReferrals.fetchReferralData] Conversions (registered):', conversionsCount);
      console.log('[AffiliateReferrals.fetchReferralData] Successful (enrolled):', successfulCount);
      
      const transformedReferrals = (referralList || []).map((r, idx) => ({
        id: r.id,
        username: r.username,
        name: r.first_name ? `${r.first_name} ${r.last_name}`.trim() : (r.username || `Referral ${idx+1}`),
        email: r.email || 'N/A',
        course: '—',
        date: formatDate(r.created_at),
        status: r.status || (r.is_enrolled ? 'Enrolled' : 'Registered'),  // Use backend status
        is_enrolled: r.is_enrolled,
        earning: 0
      }));
      
      setReferrals(transformedReferrals);
      setStats({
        totalClicks: referralData.totalReferred || 0,  // Total visits from referral link
        conversions: conversionsCount,  // Registered users
        totalEarnings: transformedReferrals.reduce((sum, ref) => sum + parseFloat(ref.earning || 0), 0),
        successfulReferrals: successfulCount,  // Enrolled users
      });
      
      console.log('[AffiliateReferrals.fetchReferralData] COMPLETE - Stats:', {
        totalClicks: referralData.totalReferred,
        conversions: conversionsCount,
        successfulReferrals: successfulCount
      });
    } catch (error) {
      console.error('[AffiliateReferrals.fetchReferralData] Error:', error);
      toast.error('Failed to load referral data');
      setStats({ totalClicks: 0, conversions: 0, totalEarnings: 0, successfulReferrals: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralLink);
    success ? toast.success('Referral link copied!') : toast.error('Failed to copy link');
  };

  const handleShareOnPlatform = (platform) => {
    if (!shareUrls[platform]) {
      toast.error(`Share option not available for ${platform}`);
      return;
    }
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    toast.success(`Opening ${platform}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Your Referrals</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Track your referrals and monitor their progress
        </p>
      </div>

      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Total Clicks</p>
          <p className="text-3xl font-bold">{stats?.totalClicks || 0}</p>
          <p className="text-sm text-gray-500 mt-2">Link views and clicks</p>
        </div>
        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Conversions</p>
          <p className="text-3xl font-bold">{stats?.conversions || 0}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats?.totalClicks > 0 
              ? `${((stats.conversions / stats.totalClicks) * 100).toFixed(1)}% conversion rate` 
              : 'Registered users'}
          </p>
        </div>
        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Successful</p>
          <p className="text-3xl font-bold">{stats?.successfulReferrals || 0}</p>
          <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
            Enrolled in courses
          </p>
        </div>
      </div>


      {/* Referral Link Card */}
      <div className={`${bgColor} rounded-xl border ${borderColor} p-8`}>
        <h2 className="text-2xl font-bold mb-6">Your Unique Referral Link</h2>
        <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Share this link to earn commission
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <input
              type="text"
              value={referralLink}
              readOnly
              className={`flex-1 px-4 py-3 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-800' : 'bg-white'} w-full`}
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors w-full sm:w-auto"
            >
              <Copy size={20} />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button 
            onClick={() => handleShareOnPlatform('whatsapp')}
            className={`p-4 rounded-lg border ${borderColor} hover:bg-green-500/10 transition-colors text-center`}
          >
            🔗 WhatsApp
          </button>
          <button 
            onClick={() => handleShareOnPlatform('facebook')}
            className={`p-4 rounded-lg border ${borderColor} hover:bg-blue-500/10 transition-colors text-center`}
          >
            📘 Facebook
          </button>
          <button 
            onClick={() => handleShareOnPlatform('twitter')}
            className={`p-4 rounded-lg border ${borderColor} hover:bg-sky-400/10 transition-colors text-center`}
          >
            𝕏 Twitter
          </button>
          <button 
            onClick={() => handleShareOnPlatform('telegram')}
            className={`p-4 rounded-lg border ${borderColor} hover:bg-sky-500/10 transition-colors text-center`}
          >
            📢 Telegram
          </button>
          <button 
            onClick={() => handleShareOnPlatform('email')}
            className={`p-4 rounded-lg border ${borderColor} hover:bg-gray-500/10 transition-colors text-center`}
          >
            ✉️ Email
          </button>
        </div>
      </div>

      {/* Referrals Table */}
      {referrals.length > 0 ? (
        <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
          <div className="p-8 border-b border-gray-700 dark:border-gray-600">
            <h2 className="text-2xl font-bold">Recent Referrals ({referrals.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Username</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 dark:divide-gray-600">
                {referrals.map((ref) => (
                  <tr key={ref.id} className={isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 font-semibold">{ref.username}</td>
                    <td className="px-6 py-4 font-semibold">{ref.name}</td>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{ref.email}</td>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{ref.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ref.status === 'Completed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : ref.status === 'Pending' 
                          ? 'bg-yellow-500/20 text-yellow-500' 
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`${bgColor} rounded-xl border ${borderColor} p-12 text-center`}>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No referrals yet. Start sharing your link!</p>
        </div>
      )}
    </div>
  );
};

export default AffiliateReferrals;
