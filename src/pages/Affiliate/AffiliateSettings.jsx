import React, { useContext, useState, useEffect } from 'react';
import { Settings, Bell, Lock, Eye, Trash2, LogOut } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { getWalletInfo, requestWalletPasswordOTP, verifyWalletOTP, resetWalletPassword } from '../../api/affiliateApi';

const AffiliateSettings = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    monthlyReport: true,
    twoFactorAuth: false,
    showEmail: true,
    dataCollection: true,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const SettingToggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700 transition-colors">
      <div>
        <p className="font-semibold">{label}</p>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Notification Settings */}
      <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
        <div className="p-8 border-b border-gray-700 dark:border-gray-600 flex items-center gap-3">
          <Bell size={24} className="text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage how you receive updates</p>
          </div>
        </div>
        <div className="divide-y divide-gray-700 dark:divide-gray-600">
          <SettingToggle
            label="Email Notifications"
            description="Receive important updates via email"
            value={settings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
          />
          <SettingToggle
            label="Push Notifications"
            description="Get instant alerts on your device"
            value={settings.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
          />
          <SettingToggle
            label="Weekly Reports"
            description="Get weekly summary of your earnings"
            value={settings.weeklyReport}
            onChange={() => handleToggle('weeklyReport')}
          />
          <SettingToggle
            label="Monthly Reports"
            description="Receive detailed monthly reports"
            value={settings.monthlyReport}
            onChange={() => handleToggle('monthlyReport')}
          />
        </div>
      </div>

      {/* Privacy & Security */}
      <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
        <div className="p-8 border-b border-gray-700 dark:border-gray-600 flex items-center gap-3">
          <Lock size={24} className="text-green-500" />
          <div>
            <h2 className="text-2xl font-bold">Privacy & Security</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Control your privacy settings</p>
          </div>
        </div>
        <div className="divide-y divide-gray-700 dark:divide-gray-600">
          <SettingToggle
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            value={settings.twoFactorAuth}
            onChange={() => handleToggle('twoFactorAuth')}
          />
          <SettingToggle
            label="Show Email in Public Profile"
            description="Let others see your email address"
            value={settings.showEmail}
            onChange={() => handleToggle('showEmail')}
          />
          <div className="p-4 rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700 transition-colors">
            <button className="w-full text-left">
              <p className="font-semibold">Change Password</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Update your password regularly</p>
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Password Management */}
      <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
        <div className="p-8 border-b border-gray-700 dark:border-gray-600 flex items-center gap-3">
          <Lock size={24} className="text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold">Wallet Password</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your wallet password, reveal or reset using email OTP</p>
          </div>
        </div>
        <div className="p-6">
          <WalletSection />
        </div>
      </div>

      {/* Data & Privacy */}
      <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
        <div className="p-8 border-b border-gray-700 dark:border-gray-600 flex items-center gap-3">
          <Eye size={24} className="text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold">Data & Privacy</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your data preferences</p>
          </div>
        </div>
        <div className="divide-y divide-gray-700 dark:divide-gray-600">
          <SettingToggle
            label="Data Collection"
            description="Allow us to collect usage data to improve services"
            value={settings.dataCollection}
            onChange={() => handleToggle('dataCollection')}
          />
          <div className="p-4">
            <button className="text-blue-500 hover:text-blue-600 font-semibold">
              Download Your Data
            </button>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Download all your personal data in JSON format
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${bgColor} rounded-xl border border-red-500/50 overflow-hidden`}>
        <div className="p-8 border-b border-red-500/30 flex items-center gap-3">
          <Trash2 size={24} className="text-red-500" />
          <div>
            <h2 className="text-2xl font-bold text-red-500">Danger Zone</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Irreversible actions</p>
          </div>
        </div>
        <div className="divide-y divide-red-500/30 p-8 space-y-4">
          <button className="w-full px-4 py-3 rounded-lg border border-red-500/50 text-red-500 font-semibold hover:bg-red-500/10 transition-colors text-left">
            <div className="flex items-center gap-2">
              <LogOut size={20} />
              <div>
                <p>Sign Out of All Devices</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>End all active sessions</p>
              </div>
            </div>
          </button>
          <button className="w-full px-4 py-3 rounded-lg border border-red-500/50 text-red-500 font-semibold hover:bg-red-500/10 transition-colors text-left">
            <div className="flex items-center gap-2">
              <Trash2 size={20} />
              <div>
                <p>Delete Account</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Permanently delete your account and data</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={() => toast.success('Settings saved!')}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

const WalletSection = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [hasPassword, setHasPassword] = useState(false);
  const [maskedPassword, setMaskedPassword] = useState('************');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [verificationToken, setVerificationToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const info = await getWalletInfo();
        setHasPassword(Boolean(info.has_password));
      } catch (err) {
        console.error('Failed to load wallet info', err);
      }
    })();
  }, []);

  // Cooldown timer for OTP button
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => {
        setOtpCooldown(otpCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);
      await requestWalletPasswordOTP();
      setOtpSent(true);
      setIsOtpVerified(false);
      setOtpCooldown(60); // 60 second cooldown
      toast.success('OTP sent to your email (if configured)');
    } catch (err) {
      console.error('requestWalletPasswordOTP failed', err);
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const code = (otpCode || '').toString().trim();
      if (!code) {
        toast.error('Enter the OTP');
        return;
      }

      const res = await verifyWalletOTP(code);
      if (res && res.ok) {
      // Backend now returns a short-lived verification token. Store it and
      // allow the user to proceed to reset the wallet password.
      setVerificationToken(res.verification_token);
      setIsOtpVerified(true);
      toast.success('OTP verified — you may now reset your wallet password');
      } else {
        // If backend returns an error message, show it
        const msg = res?.error || 'Verification failed';
        setIsOtpVerified(false);
        toast.error(msg);
      }
    } catch (err) {
      console.error('verifyWalletOTP failed', err);
      setIsOtpVerified(false);
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (newPassword) => {
    try {
      if (!isOtpVerified) {
        toast.error('Please verify OTP before resetting password');
        return;
      }

      if (!newPassword || newPassword.length < 4) {
        toast.error('Password must be at least 4 characters');
        return;
      }

      setIsLoading(true);
      const token = verificationToken;
      const res = await resetWalletPassword(token, newPassword);
      if (res && res.ok) {
        toast.success(res.message || 'Password reset');
        setVerificationToken(null);
        setOtpCode('');
        setOtpSent(false);
        setIsOtpVerified(false);
        setHasPassword(true);
      } else {
        toast.error(res?.error || 'Reset failed');
      }
    } catch (err) {
      console.error('resetWalletPassword failed', err);
      toast.error(err.response?.data?.error || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Wallet Password</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current status: {hasPassword ? 'Set' : 'Not set'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRequestOtp} 
            disabled={isLoading || otpCooldown > 0}
            className={`px-4 py-2 rounded text-white font-semibold transition-all ${
              isLoading || otpCooldown > 0
                ? 'bg-yellow-400 cursor-not-allowed opacity-70'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {isLoading ? 'Sending...' : otpCooldown > 0 ? `Wait ${otpCooldown}s` : 'Send OTP'}
          </button>
        </div>
      </div>

      {otpSent && (
        <div className="space-y-2">
          {/* When OTP is verified we hide the OTP input and show the password reset input */}
          {!isOtpVerified ? (
            <>
              <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Enter OTP" className="px-3 py-2 rounded border w-48" />
              <div className="flex gap-2">
                <button onClick={handleVerifyOtp} disabled={isLoading} className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-green-400 cursor-not-allowed opacity-70' : 'bg-green-500 hover:bg-green-600'}`}>
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  onClick={() => { setOtpSent(false); setOtpCode(''); }}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-gray-300 cursor-not-allowed opacity-70' : 'bg-gray-500 hover:bg-gray-600'}`}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-green-600">OTP verified — enter a new wallet password below.</p>
              <div className="flex items-center gap-2">
                <input value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} placeholder="New wallet password" type="password" className="px-3 py-2 rounded border w-64" />
                <button
                  onClick={() => handleResetPassword(newPasswordInput)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded text-white font-semibold ${!isOtpVerified || isLoading ? 'bg-blue-300 cursor-not-allowed opacity-70' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {isLoading ? 'Processing...' : 'Reset Password'}
                </button>
                <button
                  onClick={() => { setIsOtpVerified(false); setVerificationToken(null); setNewPasswordInput(''); setOtpCode(''); }}
                  disabled={isLoading}
                  className="px-3 py-2 rounded text-sm bg-gray-200"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {revealedPassword && (
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Your wallet password:</p>
          <p className="font-mono text-lg">{revealedPassword}</p>
        </div>
      )}
    </div>
  );
};

export default AffiliateSettings;
