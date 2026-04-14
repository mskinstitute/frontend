import React, { useContext, useState, useEffect } from 'react';
import { DollarSign, Send, Lock, Unlock, ArrowRight, History, AlertCircle, Download, Check, X } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  getWalletInfo,
  setWalletPassword,
  verifyWalletPassword,
  transferToWallet,
  sendToFriend,
  getUserByUsername,
  getAffiliateProfile,
  requestWithdrawal,
  getWithdrawalRequests,
  formatCurrency,
  formatDate
} from '../../api/affiliateApi';

const AffiliateWallet = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // State for main wallet info
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // State for password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [walletPassword, setWalletPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [passwordModalClosed, setPasswordModalClosed] = useState(false);

  // State for transfer modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  // State for send money modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendUsername, setSendUsername] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [userSuggestion, setUserSuggestion] = useState(null);
  const [sendLoading, setSendLoading] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  // State for withdrawal modal
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [upiMobile, setUpiMobile] = useState('');
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);

  // Fetch wallet data on component mount
  useEffect(() => {
    console.log('[useEffect] Component mounted, calling fetchWalletData');
    fetchWalletData();
  }, []);

  // Keyboard event handler for password modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showPasswordModal) return;
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (isSettingPassword || !walletInfo?.has_password) {
          handleSetNewPassword();
        } else {
          handlePasswordSubmit();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowPasswordModal(false);
        setWalletPassword('');
        setPasswordError('');
        setPasswordModalClosed(true);
      }
    };

    if (showPasswordModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPasswordModal, walletPassword, isSettingPassword, walletInfo?.has_password]);

  // Show password modal if wallet has password but not yet verified
  useEffect(() => {
    if (walletInfo?.has_password && !isPasswordVerified && !loading && !passwordModalClosed) {
      // Show password verification modal only once on page load
      setShowPasswordModal(true);
    }
  }, [walletInfo, isPasswordVerified, loading, passwordModalClosed]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      console.log('[fetchWalletData] Starting API calls...');
      
      let walletData = null, profileData = null, withdrawalData = [];
      
      try {
        console.log('[fetchWalletData] Calling getWalletInfo...');
        walletData = await getWalletInfo();
        console.log('[fetchWalletData] Wallet data received:', walletData);
      } catch (error) {
        console.error('[fetchWalletData] getWalletInfo failed:', error);
        toast.error('Failed to load wallet info');
      }
      
      try {
        console.log('[fetchWalletData] Calling getAffiliateProfile...');
        profileData = await getAffiliateProfile();
        console.log('[fetchWalletData] Profile data received:', profileData);
      } catch (error) {
        console.error('[fetchWalletData] getAffiliateProfile failed:', error);
        toast.error('Failed to load profile data');
      }
      
      try {
        console.log('[fetchWalletData] Calling getWithdrawalRequests...');
        withdrawalData = await getWithdrawalRequests();
        console.log('[fetchWalletData] Withdrawal requests received:', withdrawalData);
      } catch (error) {
        console.error('[fetchWalletData] getWithdrawalRequests failed:', error);
        withdrawalData = [];
      }
      
      setWalletInfo(walletData || {});
      setProfile(profileData || {});
      setWithdrawalRequests(withdrawalData || []);
      setIsPasswordVerified(false);
      
      // Pre-fill UPI details from profile if available
      if (profileData?.upi_id) {
        setUpiId(profileData.upi_id);
      }
      if (profileData?.upi_mobile) {
        setUpiMobile(profileData.upi_mobile);
      }
      console.log('[fetchWalletData] All data loading completed');
    } catch (error) {
      console.error('[fetchWalletData] Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!walletPassword) {
      setPasswordError('Password required');
      return;
    }

    try {
      setPasswordLoading(true);
      const result = await verifyWalletPassword(walletPassword);
      if (result.ok) {
        setIsPasswordVerified(true);
        setPasswordError('');
        setWalletPassword('');
        setShowPasswordModal(false);
        toast.success('Password verified successfully');
      } else {
        setPasswordError('Invalid password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError(error.response?.data?.error || 'Failed to verify password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    console.log('[handleSetNewPassword] ===== STARTING PASSWORD SET =====');
    
    if (!walletPassword || walletPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      console.log('[handleSetNewPassword] Password validation passed');
      console.log('[handleSetNewPassword] About to call setWalletPassword API...');
      
      const result = await setWalletPassword(walletPassword);
      
      console.log('[handleSetNewPassword] GOT RESULT:', result);
      
      if (result?.ok) {
        console.log('[handleSetNewPassword] SUCCESS - Password saved!');
        toast.success('Wallet password set successfully!');
        setWalletPassword('');
        setPasswordError('');
        setShowPasswordModal(false);
        setIsSettingPassword(false);
        await fetchWalletData();
      } else {
        console.log('[handleSetNewPassword] FAILED - Response not ok');
        const errorMsg = result?.message || result?.error || 'Failed to set wallet password';
        setPasswordError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.log('[handleSetNewPassword] CAUGHT EXCEPTION');
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to set wallet password';
      console.log('[handleSetNewPassword] Error message:', errorMessage);
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log('[handleSetNewPassword] ===== PASSWORD SET COMPLETE =====');
      setPasswordLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(transferAmount) > parseFloat(profile?.account_balance || 0)) {
      toast.error('Insufficient account balance');
      return;
    }

    try {
      setTransferLoading(true);
      const result = await transferToWallet(transferAmount);
      toast.success('Transferred to wallet successfully!');
      setTransferAmount('');
      setShowTransferModal(false);
      await fetchWalletData();
    } catch (error) {
      console.error('Error transferring to wallet:', error);
      toast.error(error.response?.data?.error || 'Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleSearchUser = async () => {
    if (!sendUsername.trim()) {
      setUserSuggestion(null);
      return;
    }

    try {
      const user = await getUserByUsername(sendUsername);
      setUserSuggestion(user);
    } catch (error) {
      console.error('Error searching user:', error);
      setUserSuggestion(null);
    }
  };

  const handleSendMoney = async () => {
    if (!sendUsername || !sendAmount || parseFloat(sendAmount) <= 0) {
      toast.error('Please enter username and amount');
      return;
    }

    if (parseFloat(sendAmount) > parseFloat(walletInfo?.wallet_balance || 0)) {
      toast.error('Insufficient wallet balance');
      return;
    }

    // For Send to Friend, we need the user to enter wallet password in the modal
    // We don't require isPasswordVerified here because it's specific to send transaction
    if (!walletPassword) {
      toast.error('Please enter your wallet password');
      return;
    }


    try {
      setSendLoading(true);
      const result = await sendToFriend(sendUsername, sendAmount, walletPassword, sendMessage);
      toast.success(`Sent ${formatCurrency(sendAmount)} to ${userSuggestion?.full_name || sendUsername}`);
      setSendUsername('');
      setSendAmount('');
      setSendMessage('');
      setWalletPassword('');
      setUserSuggestion(null);
      setShowSendModal(false);
      await fetchWalletData();
    } catch (error) {
      console.error('Error sending money:', error);
      const errorMsg = error.response?.data?.error;
      if (errorMsg === 'Invalid wallet password') {
        toast.error('Wallet password is incorrect');
      } else {
        toast.error(errorMsg || 'Failed to send money');
      }
    } finally {
      setSendLoading(false);
    }
  };

  const handleRequestWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setWithdrawalError('Please enter a valid amount');
      return;
    }

    // Enforce minimum withdrawal amount of ₹100
    if (parseFloat(withdrawalAmount) < 100) {
      setWithdrawalError('Minimum withdrawal amount is ₹100');
      return;
    }

    if (parseFloat(withdrawalAmount) > parseFloat(walletInfo?.wallet_balance || 0)) {
      setWithdrawalError('Insufficient wallet balance');
      return;
    }

    if (!withdrawalPassword) {
      setWithdrawalError('Please enter your wallet password');
      return;
    }

    // Validate UPI details
    if (!upiId || !upiMobile) {
      setWithdrawalError('Please enter both UPI ID and mobile number');
      return;
    }

    try {
      setWithdrawalLoading(true);
      const withdrawalData = {
        amount: withdrawalAmount,
        wallet_password: withdrawalPassword,
        payment_method: 'upi',
        upi_id: upiId,
        upi_mobile: upiMobile
      };

      const result = await requestWithdrawal(withdrawalData);
      toast.success('Withdrawal request submitted! Pending admin approval.');
      
      // Reset form
      setWithdrawalAmount('');
      setWithdrawalPassword('');
      setWithdrawalError('');
      setShowWithdrawalModal(false);
      
      await fetchWalletData();
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to request withdrawal';
      setWithdrawalError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setWithdrawalLoading(false);
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
        <h1 className="text-4xl font-bold mb-2">Wallet</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Manage your wallet balance and send money to friends
        </p>
      </div>

      {/* Password Alert */}
      {!walletInfo?.has_password && (
        <div className={`${bgColor} rounded-xl border ${borderColor} p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10`}>
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Set Wallet Password</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Your wallet needs a password for security. This password is required to send money and request withdrawals.
              </p>
              <button
                onClick={() => {
                  setIsSettingPassword(true);
                  setShowPasswordModal(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
              >
                <Lock size={18} />
                Set Password Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${bgColor} rounded-xl border ${borderColor} p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Wallet Balance</p>
              <p className="text-4xl font-bold text-blue-500">{formatCurrency(walletInfo?.wallet_balance || 0)}</p>
            </div>
            <DollarSign className="text-blue-500" size={32} />
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Available funds in your wallet
          </p>
        </div>

        <div className={`${bgColor} rounded-xl border ${borderColor} p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Account Balance</p>
              <p className="text-4xl font-bold text-green-500">{formatCurrency(profile?.account_balance || 0)}</p>
            </div>
            <DollarSign className="text-green-500" size={32} />
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Available earnings to transfer
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {isPasswordVerified ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <button
            onClick={() => setShowTransferModal(true)}
            className={`${bgColor} rounded-xl border ${borderColor} p-6 hover:shadow-lg transition-shadow text-left`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <ArrowRight className="text-blue-500" size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Transfer to Wallet</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Move from account balance to wallet
            </p>
          </button>

          <button
            onClick={() => setShowSendModal(true)}
            className={`${bgColor} rounded-xl border ${borderColor} p-6 hover:shadow-lg transition-shadow text-left`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Send className="text-purple-500" size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Send to Friend</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Send money to another affiliate
            </p>
          </button>

          <button
            onClick={() => setShowWithdrawalModal(true)}
            className={`${bgColor} rounded-xl border ${borderColor} p-6 hover:shadow-lg transition-shadow text-left`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Download className="text-emerald-500" size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Request Withdrawal</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Withdraw to your bank/UPI
            </p>
          </button>

          <button
            onClick={() => window.location.href = '/affiliate-dashboard/settings'}
            className={`${bgColor} rounded-xl border ${borderColor} p-6 hover:shadow-lg transition-shadow text-left`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Lock className="text-orange-500" size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Security</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Change wallet password
            </p>
          </button>
        </div>
      ) : (
        <div className={`${bgColor} rounded-xl border ${borderColor} p-8 text-center`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Please verify your wallet password to access wallet features.
          </p>
        </div>
      )}


      {/* Withdrawal History */}
      {withdrawalRequests && withdrawalRequests.length > 0 && (
        <div className={`${bgColor} rounded-xl border ${borderColor} p-8`}>
          <h2 className="text-2xl font-bold mb-6">Withdrawal Requests</h2>
          <div className="space-y-4">
            {withdrawalRequests.map((request) => (
              <div key={request.id} className={`p-4 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">₹ {formatCurrency(request.amount)}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                        request.status === 'approved' ? 'bg-green-500/20 text-green-600' :
                        request.status === 'rejected' ? 'bg-red-500/20 text-red-600' :
                        'bg-blue-500/20 text-blue-600'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {request.payment_method === 'upi' ? `UPI: ${request.upi_id}` : `Bank: ${request.account_number}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(request.requested_at)}</p>
                    {request.tax_amount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Tax: -₹ {formatCurrency(request.tax_amount)}</p>
                    )}
                  </div>
                </div>
                {request.status === 'completed' && request.final_amount && (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <Check size={16} />
                    <span>Transferred: ₹ {formatCurrency(request.final_amount)}</span>
                  </div>
                )}
                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="flex items-start gap-2 text-red-500 text-sm">
                    <X size={16} className="mt-0.5" />
                    <span>Reason: {request.rejection_reason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl border ${borderColor} p-8 max-w-md w-full`}>
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-blue-500" size={24} />
              <h3 className="text-2xl font-bold">
                {walletInfo?.has_password ? 'Verify Wallet Password' : 'Set Wallet Password'}
              </h3>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-500 text-sm">{passwordError}</p>
              </div>
            )}

            <div className="mb-6">
              <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                {walletInfo?.has_password ? 'Wallet Password' : 'Create Password'}
              </label>
              <input
                type="password"
                value={walletPassword}
                onChange={(e) => {
                  setWalletPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder={walletInfo?.has_password ? 'Enter your password' : 'Min. 4 characters'}
                className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
              />
            </div>

            {!walletInfo?.has_password && (
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-6`}>
                This password is required to send money and make withdrawals. Keep it safe!
              </p>
            )}

            {walletInfo?.has_password && (
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-6`}>
                <p>
                  Forgot your password?{' '}
                  <button
                    onClick={() => {
                      window.location.href = '/affiliate-dashboard/settings';
                    }}
                    className="text-blue-500 hover:text-blue-600 underline font-semibold"
                  >
                    Reset it here
                  </button>
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setWalletPassword('');
                  setPasswordError('');
                  setPasswordModalClosed(true);
                }}
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} font-semibold hover:bg-gray-700/50 transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={isSettingPassword || !walletInfo?.has_password ? handleSetNewPassword : handlePasswordSubmit}
                disabled={passwordLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {passwordLoading ? 'Processing...' : isSettingPassword || !walletInfo?.has_password ? 'Set Password' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl border ${borderColor} p-8 max-w-md w-full`}>
            <h3 className="text-2xl font-bold mb-6">Transfer to Wallet</h3>

            <div className="mb-6">
              <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                Amount (₹)
              </label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount"
                className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
              />
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                Available: {formatCurrency(profile?.account_balance || 0)}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferAmount('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} font-semibold hover:bg-gray-700/50 transition-colors`}
              >
                Cancel
              </button>
              <button
                disabled={transferLoading}
                onClick={handleTransfer}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {transferLoading ? 'Processing...' : 'Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Money Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl border ${borderColor} p-8 max-w-md w-full max-h-96 overflow-y-auto`}>
            <h3 className="text-2xl font-bold mb-6">Send Money to Friend</h3>

            <div className="space-y-4 mb-6">
              {/* Username Search */}
              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Friend's Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sendUsername}
                    onChange={(e) => {
                      setSendUsername(e.target.value);
                      setShowUserSearch(true);
                      handleSearchUser();
                    }}
                    placeholder="Enter username"
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  />
                  {userSuggestion && showUserSearch && (
                    <div className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-lg border ${borderColor} ${bgColor} z-10`}>
                      <p className="text-sm font-semibold">{userSuggestion.full_name}</p>
                      <p className="text-xs text-gray-500">@{userSuggestion.username}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Available: {formatCurrency(walletInfo?.wallet_balance || 0)}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Message (Optional)
                </label>
                <textarea
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  placeholder="Add a message"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'} resize-none`}
                  rows="2"
                />
              </div>

              {/* Password Verification */}
              {!isPasswordVerified && (
                <div>
                  <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                    Wallet Password
                  </label>
                  <input
                    type="password"
                    value={walletPassword}
                    onChange={(e) => setWalletPassword(e.target.value)}
                    placeholder="Enter wallet password"
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowSendModal(false);
                  setSendUsername('');
                  setSendAmount('');
                  setSendMessage('');
                  setWalletPassword('');
                  setUserSuggestion(null);
                  setIsPasswordVerified(false);
                }}
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} font-semibold hover:bg-gray-700/50 transition-colors`}
              >
                Cancel
              </button>
              <button
                disabled={sendLoading}
                onClick={handleSendMoney}
                className="flex-1 px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {sendLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl border ${borderColor} p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Download className="text-emerald-500" size={24} />
              Request Withdrawal
            </h3>

            {withdrawalError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-500 text-sm">{withdrawalError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Amount */}
              <div className="md:col-span-1">
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => {
                    setWithdrawalAmount(e.target.value);
                    setWithdrawalError('');
                  }}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Available: {formatCurrency(walletInfo?.wallet_balance || 0)}
                </p>
              </div>

              {/* UPI ID */}
              <div className="md:col-span-1">
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setWithdrawalError('');
                  }}
                  placeholder="yourname@bank"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              {/* UPI Mobile */}
              <div className="md:col-span-1">
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Mobile Number (Linked to UPI)
                </label>
                <input
                  type="tel"
                  value={upiMobile}
                  onChange={(e) => {
                    setUpiMobile(e.target.value);
                    setWithdrawalError('');
                  }}
                  placeholder="Enter mobile number"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              {/* Password */}
              <div className="md:col-span-1">
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Wallet Password (Confirmation)
                </label>
                <input
                  type="password"
                  value={withdrawalPassword}
                  onChange={(e) => {
                    setWithdrawalPassword(e.target.value);
                    setWithdrawalError('');
                  }}
                  placeholder="Enter your wallet password"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>
            </div>

            {/* Tax Preview */}
            {withdrawalAmount && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 font-semibold`}>Tax Breakdown (5%)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Amount</p>
                    <p className="text-lg font-bold">₹ {formatCurrency(withdrawalAmount)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Tax (5%)</p>
                    <p className="text-lg font-bold text-yellow-500">-₹ {formatCurrency((parseFloat(withdrawalAmount) * 0.05).toFixed(2))}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>You'll receive</p>
                    <p className="text-lg font-bold text-green-500">₹ {formatCurrency((parseFloat(withdrawalAmount) * 0.95).toFixed(2))}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setShowWithdrawalModal(false);
                  setWithdrawalAmount('');
                  setWithdrawalPassword('');
                  setWithdrawalError('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} font-semibold hover:bg-gray-700/50 transition-colors`}
              >
                Cancel
              </button>
              <button
                disabled={withdrawalLoading}
                onClick={handleRequestWithdrawal}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {withdrawalLoading ? 'Requesting...' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateWallet;
