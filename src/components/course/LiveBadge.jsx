import React from 'react';
import { Radio } from 'lucide-react';

const LiveBadge = ({ status = 'upcoming', theme = 'dark' }) => {
  const colors = {
    live: theme === 'dark' 
      ? 'bg-red-900/50 text-red-300 border-red-700 animate-pulse'
      : 'bg-red-100 text-red-700 border-red-200',
    upcoming: theme === 'dark'
      ? 'bg-blue-900/50 text-blue-300 border-blue-700'
      : 'bg-blue-100 text-blue-700 border-blue-200',
    completed: theme === 'dark'
      ? 'bg-green-900/50 text-green-300 border-green-700'
      : 'bg-green-100 text-green-700 border-green-200'
  };

  return (
    <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${colors[status]}`}>
      <Radio className={`w-4 h-4 ${status === 'live' ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-medium capitalize">{status}</span>
    </div>
  );
};

export default LiveBadge;