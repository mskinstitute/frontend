/**
 * Format a date string or Date object into a human-readable format in local timezone
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options for date and time formatting
  const defaultOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-IN', { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Format a time duration between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted duration
 */
export const formatDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const duration = end.getTime() - start.getTime();
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.round((duration % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h ${minutes}m`;
};

/**
 * Get relative time string (e.g., "starts in 2 hours" or "ended 5 minutes ago")
 * @param {string|Date} date - Date to compare
 * @param {boolean} isFuture - Whether the event is in the future
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date, isFuture = true) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = Math.round((dateObj.getTime() - now.getTime()) / 1000);
  
  const absDiff = Math.abs(diff);
  if (absDiff < 60) return isFuture ? 'Starting soon' : 'Just ended';
  if (absDiff < 3600) {
    const minutes = Math.floor(absDiff / 60);
    return rtf.format(isFuture ? minutes : -minutes, 'minute');
  }
  if (absDiff < 86400) {
    const hours = Math.floor(absDiff / 3600);
    return rtf.format(isFuture ? hours : -hours, 'hour');
  }
  const days = Math.floor(absDiff / 86400);
  return rtf.format(isFuture ? days : -days, 'day');
};

/**
 * Convert 24-hour time format to 12-hour format with AM/PM
 * Handles both "HH:MM:SS" and "HH:MM" formats
 * @param {string} time24 - Time in 24-hour format (e.g., "14:30" or "14:30:00")
 * @returns {string} Time in 12-hour format with AM/PM (e.g., "2:30 PM")
 */
export const convertTo12HourFormat = (time24) => {
  if (!time24) return '';
  
  try {
    // Split the time string
    const parts = time24.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    // Validate input
    if (isNaN(hours) || hours < 0 || hours > 23) return time24;
    
    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    if (hours === 0) {
      hours = 12; // Midnight
    } else if (hours > 12) {
      hours = hours - 12;
    }
    
    // Return formatted time
    return `${hours}:${minutes} ${period}`;
  } catch (error) {
    console.error('Error converting time format:', error);
    return time24;
  }
};