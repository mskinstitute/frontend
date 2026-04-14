import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Home, Users, BookOpen, ChartBar, Settings, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ onClose }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const menuItems = [
    { label: 'Dashboard', icon: Home, to: '/admin-dashboard' },
    { label: 'Users', icon: Users, to: '/admin/users' },
    { label: 'Courses', icon: BookOpen, to: '/admin/courses' },
    { label: 'Reports', icon: ChartBar, to: '/reports' },
    { label: 'Security', icon: ShieldCheck, to: '/admin/security' },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <div className={`h-full rounded-3xl border p-5 shadow-sm ${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
      <div className="mb-6">
        <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Admin Navigation</p>
        <h2 className={`mt-3 text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h2>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
                isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={`mt-8 rounded-3xl p-4 ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-blue-900'}`}>Fast access</p>
        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-blue-700'}`}>
          Quick links to the most important admin areas.
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
