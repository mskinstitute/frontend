import React, { useContext, useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ThemeContext } from '../../context/ThemeContext';
import { getAffiliateProfile, updateAffiliateProfile } from '../../api/affiliateApi';

const AffiliateProfile = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [affiliateData, setAffiliateData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    upiId: '',
    upiMobile: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      console.log('[AffiliateProfile.fetchProfileData] Fetching profile...');
      const data = await getAffiliateProfile();
      console.log('[AffiliateProfile.fetchProfileData] Profile received:', {
        user: data.user,
        upi_id: data.upi_id,
        upi_mobile: data.upi_mobile
      });
      
      setAffiliateData(data);
      setFormData({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        upiId: data.upi_id || '',
        upiMobile: data.upi_mobile || '',
      });
      console.log('[AffiliateProfile.fetchProfileData] Form data updated');
    } catch (error) {
      console.error('[AffiliateProfile.fetchProfileData] Error fetching profile:', error);
      toast.error('Failed to load profile data');
      setFormData({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        upiId: '',
        upiMobile: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('[AffiliateProfile.handleSave] START');
      console.log('[AffiliateProfile.handleSave] Saving UPI fields:', { 
        upiId: formData.upiId, 
        upiMobile: formData.upiMobile 
      });
      
      const updateData = {
        upi_id: formData.upiId,
        upi_mobile: formData.upiMobile
      };
      
      console.log('[AffiliateProfile.handleSave] Update payload:', updateData);
      await updateAffiliateProfile(updateData);
      
      console.log('[AffiliateProfile.handleSave] Update successful');
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data to verify save
      console.log('[AffiliateProfile.handleSave] Refreshing profile data...');
      fetchProfileData();
    } catch (error) {
      console.error('[AffiliateProfile.handleSave] Error:', error);
      console.error('[AffiliateProfile.handleSave] Response:', error.response?.data);
      console.error('[AffiliateProfile.handleSave] Status:', error.response?.status);
      toast.error(error.response?.data?.error || 'Failed to update profile');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Manage your profile information and payment details
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save size={20} />
              Save Changes
            </>
          ) : (
            <>
              <Edit size={20} />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Affiliate Info Banner */}
      {affiliateData && (
        <div className={`${bgColor} rounded-xl border ${borderColor} p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10`}>
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Your Affiliate Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Referral Link</p>
                  <p className="font-mono text-sm">{affiliateData.referral_link || 'N/A'}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Commission Rate</p>
                  <p className="font-semibold">{affiliateData.commission_rate || 15}%</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                  <p className="font-semibold">{affiliateData.is_active ? '✅ Active' : '❌ Inactive'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture & Basic Info */}
      <div className={`${bgColor} rounded-xl border ${borderColor} p-8`}>
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
              <User size={48} className="text-gray-500" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 px-3 py-1 rounded-lg bg-blue-500 text-white text-sm font-semibold">
                Change
              </button>
            )}
          </div>

          {/* Personal Info */}
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold">{formData.firstName || 'User'} {formData.lastName || ''}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Affiliate Member</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'} opacity-50`}
                />
              ) : (
                <div className={`px-4 py-2 rounded-lg border ${borderColor} flex items-center gap-2`}>
                  <Mail size={18} className="text-gray-500" />
                  <span>{formData.email || 'N/A'}</span>
                </div>
              )}
            </div>

            <div>
              <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              ) : (
                <div className={`px-4 py-2 rounded-lg border ${borderColor} flex items-center gap-2`}>
                  <Phone size={18} className="text-gray-500" />
                  <span>{formData.phone || '+91 XXXXXXXXXX'}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              ) : (
                <div className={`px-4 py-2 rounded-lg border ${borderColor} flex items-center gap-2`}>
                  <MapPin size={18} className="text-gray-500" />
                  <span>{formData.address || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bank & Payment Information */}
      <div className={`${bgColor} rounded-xl border ${borderColor} p-8`}>
          <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                UPI ID
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  placeholder="e.g., yourname@upi"
                />
              ) : (
                <div className={`px-4 py-2 rounded-lg border ${borderColor}`}>
                  {formData.upiId || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                UPI Mobile Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.upiMobile}
                  onChange={(e) => setFormData({ ...formData, upiMobile: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  placeholder="e.g., +91 98765xxxxx"
                />
              ) : (
                <div className={`px-4 py-2 rounded-lg border ${borderColor}`}>
                  {formData.upiMobile || 'Not provided'}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-100'}`}>
              <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                Your UPI information is encrypted and secure. Update these details to ensure smooth withdrawals.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => {
              setIsEditing(false);
              fetchProfileData();
            }}
            className={`px-6 py-3 rounded-lg border ${borderColor} font-semibold hover:bg-gray-700/50 transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AffiliateProfile;
