import React from 'react';
import { Clock } from 'lucide-react';
import { formatDateTime, formatDuration, getRelativeTime } from '../../utils/dateUtils';

const LiveTimeInfo = ({ startTime, endTime, theme = 'dark', showDuration = true }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col gap-1 mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4" />
        <div className="text-sm">
          {formatDateTime(startTime, { 
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })}
        </div>
      </div>
      {showDuration && startTime && endTime && (
        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Duration: {formatDuration(startTime, endTime)}
        </div>
      )}
      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {getRelativeTime(startTime, true)}
      </div>
    </div>
  );
};

export default LiveTimeInfo;