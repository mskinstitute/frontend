import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Users, DollarSign,
  ArrowUpRight, ArrowDownLeft, Eye
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { getAffiliateProfile, getTransactions, formatCurrency } from '../../api/affiliateApi';
import toast from 'react-hot-toast';

const StatsCard = ({ icon: Icon, title, value, change, isDark }) => {
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const isPositive = change >= 0;

  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} p-6 transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Icon size={24} className="text-blue-500" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isPositive ? (
          <ArrowUpRight size={16} className="text-green-500" />
        ) : (
          <ArrowDownLeft size={16} className="text-red-500" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}% from last month
        </span>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const profileData = await getAffiliateProfile();
      
      setStats({
        totalEarnings: profileData?.total_earnings || 0,
        pendingEarnings: profileData?.pending_earnings || 0,
        totalReferrals: profileData?.total_referred_users || 0,
        successfulReferrals: profileData?.total_successful_referrals || 0,
        commissionRate: profileData?.commission_rate || 15,
      });

      // Fetch recent transactions for activity
      const transactions = await getTransactions();
      const activity = (transactions || []).slice(0, 5).map(trans => ({
        id: trans.id,
        type: trans.transaction_type,
        description: trans.transaction_type === 'commission' 
          ? 'New referral enrolled' 
          : trans.transaction_type === 'withdrawal'
          ? 'Withdrawal request approved'
          : trans.transaction_type === 'refund'
          ? 'Refund processed'
          : 'Transaction processed',
        amount: trans.amount,
        timestamp: new Date(trans.created_at)
      }));
      
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setStats({
        totalEarnings: 0,
        pendingEarnings: 0,
        totalReferrals: 0,
        successfulReferrals: 0,
        commissionRate: 15,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Here's what's happening with your affiliate program
        </p>
      </div>

      {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={DollarSign}
          title="Total Earnings"
            value={formatCurrency(stats?.totalEarnings || 0)}
          change={15}
          isDark={isDark}
        />
        <StatsCard
          icon={TrendingUp}
          title="Pending Earnings"
            value={formatCurrency(stats?.pendingEarnings || 0)}
          change={8}
          isDark={isDark}
        />
        <StatsCard
          icon={Users}
          title="Total Referrals"
          value={stats?.totalReferrals || 0}
          change={12}
          isDark={isDark}
        />
        <StatsCard
          icon={Eye}
          title="Commission Rate"
          value={`${stats?.commissionRate}%`}
          change={0}
          isDark={isDark}
        />
      </div>

      {/* Quick Actions */}
      <div className={`${bgColor} rounded-xl border ${borderColor} p-8`}>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/affiliate-dashboard/referrals')}
            className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            📋 Get Referral Link
          </button>
          <button 
            onClick={() => navigate('/affiliate-dashboard/wallet')}
            className="p-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            💳 Request Withdrawal
          </button>
          <button 
            onClick={() => navigate('/affiliate-dashboard/coupons')}
            className="p-4 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            🎁 Create Coupon
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${bgColor} rounded-xl border ${borderColor} p-8`}>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className={`space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center justify-between py-3 border-b border-gray-700 dark:border-gray-600 last:border-0">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
              <div>
                <p className="font-semibold">New referral enrolled</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>2 hours ago</p>
              </div>
            </div>
            <p className="font-bold text-green-500">+₹500</p>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700 dark:border-gray-600 last:border-0">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full bg-blue-500`}></div>
              <div>
                <p className="font-semibold">Coupon code created</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>5 hours ago</p>
              </div>
            </div>
            <p className="text-gray-500">-</p>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700 dark:border-gray-600 last:border-0">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full bg-yellow-500`}></div>
              <div>
                <p className="font-semibold">Withdrawal request approved</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>1 day ago</p>
              </div>
            </div>
            <p className="font-bold text-yellow-500">-₹5000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
