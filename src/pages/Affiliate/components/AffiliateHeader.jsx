import React, { useContext } from 'react';
import { Menu, Sun, Moon, Bell, User } from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

const AffiliateHeader = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const shadowColor = isDark ? 'shadow-gray-900/20' : 'shadow-gray-200/20';

  return (
    <header className={`${bgColor} border-b sticky top-0 z-30 transition-colors duration-300 shadow-md ${shadowColor}`}>
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Left: Menu Button + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            MSK Affiliate Dashboard
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className={`relative p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-blue-600'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-gray-600">
            <div className="hidden sm:block text-right">
              <p className="font-semibold text-sm">{user?.username || 'User'}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Affiliate</p>
            </div>
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AffiliateHeader;
