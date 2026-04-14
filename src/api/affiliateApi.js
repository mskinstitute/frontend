/**
 * Affiliate API Service
 * Handles all API calls for affiliate dashboard operations
 */

import axios from './axios';

const API_BASE = '/affiliate';

// ==================== PROFILE ENDPOINTS ====================

/**
 * Get current user's affiliate profile
 */
export const getAffiliateProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE}/profile/`);
    // Handle both single object and array responses
    return Array.isArray(response.data) ? response.data[0] : response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get affiliate dashboard statistics
 */
export const getAffiliateStats = async (affiliateId) => {
  try {
    const response = await axios.get(`${API_BASE}/profile/${affiliateId}/stats/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== COUPON ENDPOINTS ====================

/**
 * Get all coupons for current affiliate
 */
export const getCoupons = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/coupons/`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single coupon by ID
 */
export const getCouponById = async (couponId) => {
  try {
    const response = await axios.get(`${API_BASE}/coupons/${couponId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new coupon
 */
export const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(`${API_BASE}/coupons/`, couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing coupon
 */
export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await axios.patch(`${API_BASE}/coupons/${couponId}/`, couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a coupon
 */
export const deleteCoupon = async (couponId) => {
  try {
    const response = await axios.delete(`${API_BASE}/coupons/${couponId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== TRANSACTION ENDPOINTS ====================

/**
 * Get all transactions for current affiliate
 */
export const getTransactions = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/transactions/`, { params });
    // Handle both paginated and non-paginated responses
    return response.data.results || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get transactions filtered by type (commission, withdrawal, etc.)
 */
export const getTransactionsByType = async (transactionType, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/transactions/`, {
      params: { transaction_type: transactionType, ...params }
    });
    return response.data.results || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request a withdrawal
 */
export const requestWithdrawal = async (withdrawalData) => {
  try {
    const response = await axios.post(`${API_BASE}/profile/request_withdrawal/`, withdrawalData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get list of withdrawal requests for current affiliate
 */
export const getWithdrawalRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE}/profile/withdrawal_requests/`);
    return response.data;
  } catch (error) {
    console.error('getWithdrawalRequests failed', error?.response?.data || error);
    return [];
  }
};

// ==================== REFERRAL ENDPOINTS ====================

/**
 * Get referral link and stats
 * The referral_link is part of the profile
 */
export const getReferralLink = async () => {
  try {
    const profile = await getAffiliateProfile();
    return {
      link: profile.referral_link,
      fullUrl: `${window.location.origin}?ref=${profile.referral_link}`
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get referrals data from profile
 */
export const getReferrals = async () => {
  try {
    const response = await axios.get(`${API_BASE}/profile/`);
    const profile = Array.isArray(response.data) ? response.data[0] : response.data;
    return {
      totalReferred: profile.total_referred_users || 0,
      successfulReferrals: profile.total_successful_referrals || 0,
      referralLink: profile.referral_link
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get list of referral records (referred users)
 */
export const getReferralList = async () => {
  try {
    const profile = await getAffiliateProfile();
    const id = profile.id;
    const response = await axios.get(`${API_BASE}/profile/${id}/referrals/`);
    return response.data;
  } catch (error) {
    console.error('getReferralList failed', error?.response?.data || error);
    return [];
  }
};

/**
 * Track a visit for a referral link. Pass visitor_id to dedupe repeats from same device.
 * Returns { ok: true, visitor_id }
 */
export const trackVisit = async ({ ref, visitor_id, path } = {}) => {
  try {
    console.log('[affiliateApi.trackVisit] Starting with:', { ref, visitor_id, path });
    const payload = { ref, visitor_id, path };
    const response = await axios.post(`${API_BASE}/profile/track_visit/`, payload);
    console.log('[affiliateApi.trackVisit] Success:', response.data);
    return response.data;
  } catch (error) {
    // swallow errors - tracking is best-effort
    console.error('[affiliateApi.trackVisit] Full error object:', error);
    console.error('[affiliateApi.trackVisit] Error response:', error?.response?.data);
    console.error('[affiliateApi.trackVisit] Error status:', error?.response?.status);
    console.error('trackVisit failed', error?.response?.data || error);
    return { ok: false };
  }
};

/**
 * Claim a referral for the authenticated user. Requires auth.
 */
export const claimReferral = async (ref) => {
  try {
    const response = await axios.post(`${API_BASE}/profile/claim_referral/`, { ref });
    return response.data;
  } catch (error) {
    console.error('claimReferral failed', error?.response?.data || error);
    throw error;
  }
};

// ==================== AFFILIATE MANAGEMENT ====================

/**
 * Get all affiliates (admin only)
 */
export const getAllAffiliates = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/profile/`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update affiliate profile (personal details)
 */
export const updateAffiliateProfile = async (profileData) => {
  try {
    const profile = await getAffiliateProfile();
    const response = await axios.patch(`${API_BASE}/profile/${profile.id}/`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user by username (for sending money to friends)
 */
export const getUserByUsername = async (username) => {
  try {
    const response = await axios.post(`${API_BASE}/profile/get_user_by_username/`, { username });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Transfer from account balance to wallet
 */
export const transferToWallet = async (amount) => {
  try {
    const response = await axios.post(`${API_BASE}/profile/transfer_to_wallet/`, { amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Send wallet money to friend by username
 */
export const sendToFriend = async (recipientUsername, amount, walletPassword, message = '') => {
  try {
    const response = await axios.post(`${API_BASE}/profile/send_to_friend/`, {
      recipient_username: recipientUsername,
      amount,
      wallet_password: walletPassword,
      message
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get wallet info (balance, account balance, has password)
 */
export const getWalletInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE}/profile/wallet_info/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Set or update wallet password
 */
export const setWalletPassword = async (newPassword) => {
  console.log('[setWalletPassword] START - new_password length:', newPassword?.length);
  
  try {
    const payload = { new_password: newPassword };
    const url = `${API_BASE}/profile/set_wallet_password/`;
    
    console.log('[setWalletPassword] URL:', url);
    console.log('[setWalletPassword] Payload:', JSON.stringify(payload));
    console.log('[setWalletPassword] Axios instance baseURL:', axios.defaults.baseURL);
    console.log('[setWalletPassword] Auth header:', axios.defaults.headers.common?.Authorization?.substring(0, 20) + '...');
    
    const response = await axios.post(url, payload);
    
    console.log('[setWalletPassword] SUCCESS! Status:', response.status);
    console.log('[setWalletPassword] Response:', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    console.error('[setWalletPassword] ERROR!');
    console.error('[setWalletPassword] Error status:', error.response?.status);
    console.error('[setWalletPassword] Error data:', JSON.stringify(error.response?.data));
    console.error('[setWalletPassword] Error message:', error.message);
    throw error;
  }
};

/**
 * Verify wallet password
 */
export const verifyWalletPassword = async (password) => {
  try {
    const response = await axios.post(`${API_BASE}/profile/verify_wallet_password/`, { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request a one-time OTP to be sent to the affiliate's email to reveal/reset wallet password
 */
export const requestWalletPasswordOTP = async () => {
  try {
    const response = await axios.post(`${API_BASE}/profile/request_wallet_password_otp/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify OTP and retrieve current wallet password (only if OTP valid)
 */
export const verifyWalletOTP = async (code) => {
  try {
    const response = await axios.post(`${API_BASE}/profile/verify_wallet_otp/`, { code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset wallet password using OTP verification
 */
export const resetWalletPassword = async (verificationToken, newPassword) => {
  try {
    // Prefer verification_token (returned by verifyWalletOTP). Backwards-compatible
    // callers that pass the raw code should pass it as the first argument but
    // the frontend flow uses the token.
    const payload = { new_password: newPassword };
    if (verificationToken) payload.verification_token = verificationToken;

    const response = await axios.post(`${API_BASE}/profile/reset_wallet_password/`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate shareable URLs for different platforms
 */
export const generateShareUrls = (referralLink) => {
  const fullUrl = `${window.location.origin}?ref=${referralLink}`;
  const message = `Check out this amazing course! ${fullUrl}`;

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(fullUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(message)}`,
    email: `mailto:?subject=Check out this course&body=${encodeURIComponent(message)}`
  };
};

/**
 * Copy text to clipboard with feedback
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
};

export default {
  getAffiliateProfile,
  getAffiliateStats,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getTransactions,
  getTransactionsByType,
  requestWithdrawal,
  getWithdrawalRequests,
  getReferralLink,
  getReferrals,
  getReferralList,
  trackVisit,
  claimReferral,
  getAllAffiliates,
  updateAffiliateProfile,
  getUserByUsername,
  transferToWallet,
  sendToFriend,
  getWalletInfo,
  setWalletPassword,
  verifyWalletPassword,
  requestWalletPasswordOTP,
  verifyWalletOTP,
  resetWalletPassword,
  generateShareUrls,
  copyToClipboard,
  formatCurrency,
  formatDate
};
