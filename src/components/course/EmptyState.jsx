import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Search, Book, ArrowRight } from 'lucide-react';

const EmptyState = ({ mode = 'search', searchTerm = '' }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const content = {
    search: {
      icon: Search,
      title: 'No Results Found',
      description: searchTerm 
        ? `No courses match "${searchTerm}"`
        : 'No courses match your search criteria',
      tips: [
        'Check your spelling',
        'Try using more general terms',
        'Remove filters to show more results'
      ]
    },
    live: {
      icon: Book,
      title: 'No Live Courses Available',
      description: 'There are no live courses scheduled at the moment',
      tips: [
        'Check back soon for new live courses',
        'Browse our regular courses',
        'Sign up for notifications'
      ]
    }
  }[mode];

  return (
    <div className={`max-w-2xl mx-auto p-8 my-8 rounded-2xl border ${
      isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white/50 border-gray-200'
    }`}>
      <div className="text-center mb-8">
        <div className={`mx-auto w-16 h-16 mb-6 rounded-xl flex items-center justify-center ${
          isDark ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          {React.createElement(content.icon, {
            className: `w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`
          })}
        </div>
        
        <h3 className={`text-2xl font-semibold mb-3 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {content.title}
        </h3>
        
        <p className={`text-lg ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {content.description}
        </p>
      </div>

      {/* Tips Section */}
      <div className={`rounded-xl p-6 mb-6 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}>
        <h4 className={`font-medium mb-4 flex items-center gap-2 ${
          isDark ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <span>Suggestions</span>
        </h4>
        <ul className={`space-y-3 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {content.tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <ArrowRight className="w-5 h-5 mr-2 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {mode === 'live' && (
          <a 
            href="/courses"
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Book className="w-4 h-4 mr-2" />
            Browse All Courses
          </a>
        )}
        <button 
          onClick={() => window.location.reload()}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default EmptyState;