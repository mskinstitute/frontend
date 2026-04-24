import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const ClassCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(targetDate).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center bg-gray-900/60 rounded-lg px-3 py-2 min-w-[60px]">
      <span className="text-xl sm:text-2xl font-bold text-emerald-400">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Date & Time Display */}
      <div className="flex items-center gap-2 text-gray-300">
        <Calendar className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-medium">Next Demo Class:</span>
        <span className="text-sm text-white">{formattedDate} at {formattedTime}</span>
      </div>

      {/* Countdown */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-emerald-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">Starts in</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <TimeBlock value={timeLeft.days} label="days" />
        <span className="text-xl font-bold text-gray-500">:</span>
        <TimeBlock value={timeLeft.hours} label="hours" />
        <span className="text-xl font-bold text-gray-500">:</span>
        <TimeBlock value={timeLeft.minutes} label="min" />
        <span className="text-xl font-bold text-gray-500">:</span>
        <TimeBlock value={timeLeft.seconds} label="sec" />
      </div>
    </div>
  );
};

export default ClassCountdown;

