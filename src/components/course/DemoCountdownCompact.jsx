import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const DemoCountdownCompact = ({ targetDate, theme = 'dark' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setHasStarted(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      setHasStarted(false);
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const formattedTime = new Date(targetDate).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const isDark = theme === 'dark';

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span className={`text-sm font-bold tabular-nums ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );

  if (hasStarted) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
        <Clock className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <span className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
          Demo class is live now!
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg px-3 py-2 space-y-2 ${isDark ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
      {/* Date display */}
      <div className="flex items-center gap-2">
        <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Next Demo: {formattedDate} at {formattedTime}
        </span>
      </div>

      {/* Countdown */}
      <div className="flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <div className="flex items-center gap-2">
          <TimeUnit value={timeLeft.days} label="d" />
          <span className={`text-xs font-bold ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>:</span>
          <TimeUnit value={timeLeft.hours} label="h" />
          <span className={`text-xs font-bold ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>:</span>
          <TimeUnit value={timeLeft.minutes} label="m" />
          <span className={`text-xs font-bold ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>:</span>
          <TimeUnit value={timeLeft.seconds} label="s" />
        </div>
      </div>
    </div>
  );
};

export default DemoCountdownCompact;

