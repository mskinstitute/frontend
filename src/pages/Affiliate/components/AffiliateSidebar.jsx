import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, DollarSign, Gift, Settings, User,
  Home, LogOut, ChevronRight, X, Wallet
} from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

const AffiliateSidebar = ({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const menuItems = [
    { label: 'Dashboard', icon: Home, path: '/affiliate-dashboard' },
    { label: 'Earnings', icon: DollarSign, path: '/affiliate-dashboard/earnings' },
    { label: 'Wallet', icon: Wallet, path: '/affiliate-dashboard/wallet' },
    { label: 'Referrals', icon: Users, path: '/affiliate-dashboard/referrals' },
    { label: 'Coupons', icon: Gift, path: '/affiliate-dashboard/coupons' },
    { label: 'Profile', icon: User, path: '/affiliate-dashboard/profile' },
    { label: 'Settings', icon: Settings, path: '/affiliate-dashboard/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const activeBg = isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  const handleNavClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {/* Mobile Overlay - click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static left-0 top-0 h-screen w-64
          transition-transform duration-300 ease-in-out lg:transition-none
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${bgColor} border-r ${borderColor} overflow-y-auto
          flex flex-col
        `}
      >
        {/* Header with Logo */}
        <div className={`p-6 border-b ${borderColor}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Affiliate
            </h2>
            {/* Close Button for Mobile */}
            <button
              onClick={onClose}
              className={`lg:hidden p-2 rounded-lg ${hoverBg} transition-colors`}
            >
              <X size={24} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer
                  ${active ? activeBg : hoverBg}
                `}
              >
                <Icon size={20} />
                <span className="flex-1 font-medium">{item.label}</span>
                {active && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Logout - Fixed at bottom, visible */}
        <div className={`border-t ${borderColor} ${bgColor} p-4 mt-auto`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer font-medium shadow-md`}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AffiliateSidebar;
