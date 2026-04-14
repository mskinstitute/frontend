import React, { useState, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AffiliateSidebar from './components/AffiliateSidebar';
import AffiliateHeader from './components/AffiliateHeader';

const AffiliateDashboardLayout = () => {
  const { theme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300 flex flex-col`}>
      {/* Header */}
      <AffiliateHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Sidebar - Desktop Always Visible */}
        <div className="hidden lg:block">
          <AffiliateSidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Sidebar - Mobile Controlled by State */}
        <div className="lg:hidden">
          <AffiliateSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboardLayout;
