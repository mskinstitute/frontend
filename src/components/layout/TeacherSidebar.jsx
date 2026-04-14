import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Grid, BookOpen, Calendar, Users, BarChart3, Plus } from 'lucide-react';

const TeacherSidebar = ({ activeTab, setActiveTab, onClose }) => {
  const { theme } = useContext(ThemeContext);

  const items = [
    { key: 'overview', label: 'Overview', icon: Grid },
    { key: 'courses', label: 'My Courses', icon: BookOpen },
    { key: 'schedule', label: 'Schedule', icon: Calendar },
    { key: 'students', label: 'Students', icon: Users },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const bgColor = theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900';
  const activeBg = 'bg-blue-600 text-white shadow-lg shadow-blue-600/20';
  const itemBg = theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700';

  return (
    <div className={`h-full rounded-3xl border ${bgColor} shadow-sm p-5`}> 
      <div className="mb-6">
        <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Teacher Menu</p>
        <h2 className={`mt-3 text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manage your class</h2>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              type="button"
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                active ? activeBg : itemBg
              }`}>
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={`mt-8 rounded-3xl p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>Need more tools?</p>
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-blue-700'}`}>
              Use quick actions to create courses and review students.
            </p>
          </div>
          <Plus className={theme === 'dark' ? 'w-6 h-6 text-blue-300' : 'w-6 h-6 text-blue-700'} />
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;
