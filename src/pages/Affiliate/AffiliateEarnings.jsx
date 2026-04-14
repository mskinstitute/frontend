import React, { useContext, useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, Plus } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { getAffiliateProfile, getAffiliateStats, getTransactions, requestWithdrawal, formatCurrency, formatDate } from '../../api/affiliateApi';

const AffiliateEarnings = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [stats, setStats] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const profileData = await getAffiliateProfile();
      setProfile(profileData);
      // fetch dashboard stats for counts and today's metrics
      const statsData = await getAffiliateStats(profileData.id);
      setStats(statsData);

      const transactions = statsData?.recent_transactions || await getTransactions();
      const earningsData = (transactions || []).map(trans => ({
        id: trans.id,
        date: formatDate(trans.created_at),
        description: trans.description || (trans.transaction_type === 'commission' ? 'Referral Commission' : trans.transaction_type === 'withdrawal' ? 'Withdrawal' : 'Transaction'),
        amount: trans.amount,
        type: trans.transaction_type === 'withdrawal' ? 'debit' : 'credit',
        status: trans.transaction_type
      }));
      setEarnings(earningsData);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings data');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!profile || parseFloat(withdrawAmount) > parseFloat(profile.account_balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    if (!bankName && !upiId) {
      toast.error('Please provide bank details or UPI ID');
      return;
    }

    try {
      setWithdrawLoading(true);
      const withdrawData = {
        amount: withdrawAmount,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        upi_id: upiId,
        note: 'Withdrawal request'
      };
      await requestWithdrawal(withdrawData);
      toast.success('Withdrawal request submitted successfully!');
      
      // Reset form
      setWithdrawAmount('');
      setBankName('');
      setAccountNumber('');
      setIfscCode('');
      setUpiId('');
      setShowWithdrawModal(false);
      
      // Refresh data
      await fetchEarningsData();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error(error.response?.data?.error || 'Failed to submit withdrawal request');
    } finally {
      setWithdrawLoading(false);
    }
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
        <h1 className="text-4xl font-bold mb-2">Earnings</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Track your earnings and manage withdrawals
        </p>
      </div>

      {/* Earnings Overview: Today's + Totals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Today Income</p>
          <p className="text-2xl font-bold">{formatCurrency(stats?.today_earnings || 0)}</p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Today Withdrawals</p>
          <p className="text-2xl font-bold">{formatCurrency(stats?.today_withdrawals || 0)}</p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Today Referral Visits</p>
          <p className="text-2xl font-bold">{stats?.today_visits ?? 0}</p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Today Referrals (Registered)</p>
          <p className="text-2xl font-bold">{stats?.today_successful_referrals ?? 0}</p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-2xl font-bold">{formatCurrency(stats?.total_earnings || profile?.total_earnings || 0)}</p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Total Withdrawals</p>
          <p className="text-2xl font-bold">{formatCurrency(stats?.total_withdrawals || 0)}</p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Total Referral Visits</p>
          <p className="text-2xl font-bold">{stats?.total_visits ?? 0}</p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-6`}> 
          <p className="text-sm text-gray-500">Total Referrals (Registered)</p>
          <p className="text-2xl font-bold">{stats?.successful_referrals ?? profile?.total_successful_referrals ?? 0}</p>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className={`${bgColor} rounded-xl border ${borderColor} p-8`}>
        <h2 className="text-2xl font-bold mb-6">Earnings Breakdown</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10">
            <div>
              <p className="font-semibold">Completed Referrals</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Successful conversions</p>
            </div>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(profile?.total_earnings || 0)}</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-500/10">
            <div>
              <p className="font-semibold">Pending Referrals</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending conversions</p>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{formatCurrency(profile?.pending_earnings || 0)}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {earnings.length > 0 ? (
        <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
          <div className="p-8 border-b border-gray-700 dark:border-gray-600 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          </div>
          <div className="divide-y divide-gray-700 dark:divide-gray-600">
            {earnings.map((earning) => (
              <div key={earning.id} className="p-6 flex items-center justify-between hover:bg-gray-700/50 dark:hover:bg-gray-700 transition-colors">
                <div>
                  <p className="font-semibold">{earning.description}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{earning.date} • {earning.status}</p>
                </div>
                <p className={`text-2xl font-bold ${earning.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                  {earning.type === 'credit' ? '+' : '-'}{formatCurrency(earning.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`${bgColor} rounded-xl border ${borderColor} p-12 text-center`}>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No transactions yet</p>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl border ${borderColor} p-8 max-w-md w-full max-h-96 overflow-y-auto`}>
            <h3 className="text-2xl font-bold mb-6">Request Withdrawal</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Available: {formatCurrency(profile?.account_balance || 0)} (Minimum: ₹1,000)
                </p>
              </div>

              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g., State Bank of India"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="Enter IFSC code"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g., yourname@upi"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} font-semibold hover:bg-gray-700/50 transition-colors`}
              >
                Cancel
              </button>
              <button
                disabled={withdrawLoading}
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {withdrawLoading ? 'Processing...' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateEarnings;
