'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { 
  Video, Calendar, Clock, User, CheckCircle2, 
  ExternalLink, Sparkles, BookOpen, AlertCircle, Play,
  Bell, BellRing, ArrowRight, ShieldCheck, HelpCircle,
  ChevronDown, GraduationCap, Laptop, MapPin, Share2
} from 'lucide-react';
import { LiveClass, LiveBatch } from '@/types';
import DemoBookingForm from './DemoBookingForm';
import WebShareButton from '@/components/WebShareButton';
import { parseISTTimeToEpoch } from '@/context/LiveStatusContext';

interface LiveScheduleClientProps {
  initialClasses: LiveClass[];
  initialBatches: LiveBatch[];
}

export default function LiveScheduleClient({ initialClasses, initialBatches }: LiveScheduleClientProps) {
  const [time, setTime] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBatchTitle, setSelectedBatchTitle] = useState('');
  const [reminders, setReminders] = useState<string[]>([]);
  const [notifiedList, setNotifiedList] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Sync hash for deep linking and brief visual highlight
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setHighlightedId(hash);
          const timer = setTimeout(() => {
            setHighlightedId(null);
          }, 4000);
          return () => clearTimeout(timer);
        }
      };

      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const getClassShareData = (c: LiveClass, isLive: boolean) => {
    const title = `🔴 Live Class: ${c.batchTitle || c.courseTitle || 'Live Computer Class'} | MSK Institute`;
    const chapterOrTopic = c.chapter || (c.topics && c.topics.length > 0 ? c.topics.slice(0, 3).join(', ') : '');
    const topicsStr = chapterOrTopic ? ` Chapter: ${chapterOrTopic}.` : '';
    const text = isLive
      ? `🔴 LIVE NOW: ${c.batchTitle || c.courseTitle} on ${c.platform || 'Online Live'} by ${c.instructor}!${topicsStr} Join live:`
      : `📅 Live Class: ${c.batchTitle || c.courseTitle} (${c.startTime}${c.endTime ? ' - ' + c.endTime : ''}) by ${c.instructor}!${topicsStr} Set reminder & join live:`;
    const url = `/live#class-${c.id}`;
    return { title, text, url };
  };

  const getBatchShareData = (b: LiveBatch, startDateStr: string) => {
    const title = `🎓 Live Batch: ${b.title} | MSK Institute Admissions`;
    const text = `Enroll in ${b.title} (${b.courseTitle || 'Live Coding Track'}) starting ${startDateStr} with ${b.instructor}! Fee: ${b.price}. Only ${b.leftSeats} seats left! Details:`;
    const url = `/live-batches/${b.id}`;
    return { title, text, url };
  };

  const liveFaqs = [
    {
      q: "What live computer classes are held at MSK Institute Shikohabad?",
      a: "MSK Institute conducts daily real-time live classes covering Python Programming, Full-Stack MERN Development (React, Node.js, Express, MongoDB), Responsive Frontend Engineering (HTML5, Tailwind CSS, JavaScript), and NIELIT CCC preparation. Every lecture features practical coding demonstrations and instant doubt resolution."
    },
    {
      q: "How can students join a live online class?",
      a: "Students can join active sessions directly through this Live Schedule page. Sessions marked 'LIVE NOW' feature a direct 'Join Now' button linking to Google Meet, YouTube Live, or Zoom. Upcoming sessions show exact start times, topics covered, and countdown clocks."
    },
    {
      q: "Who conducts the live programming sessions at MSK Institute?",
      a: "All live classes and programming cohorts are led by Er. Sumit Kumar, Senior Software Engineer and Lead Instructor with over 8 years of industry experience in web architecture, software development, and technical mentoring in Shikohabad."
    },
    {
      q: "How do browser reminder notifications work?",
      a: "Clicking 'Set Reminder' on any class in the 7-day schedule registers a browser-level alert. You will automatically receive a desktop or mobile push notification when the mentor begins the live classroom stream."
    },
    {
      q: "Can students attend classes offline at the Shikohabad centre?",
      a: "Yes! MSK Institute operates a hybrid education model. Students in and around Shikohabad (Firozabad, UP) can attend live lectures in person at our fully-equipped computer laboratory near Station Road with 1-on-1 mentor guidance."
    },
    {
      q: "How do I enroll in new upcoming live batches?",
      a: "Review the 'Upcoming Live Batches' section above, select your desired batch, and click 'View Details' to submit your registration. You can also visit our Shikohabad centre or call our coordinator directly at +91 83930 42166."
    }
  ];

  // Keep current time updated for live status checks and countdown calculations
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mount storage synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('msk_live_reminders');
      if (stored) {
        try {
          setReminders(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
      const storedNotified = localStorage.getItem('msk_live_notified');
      if (storedNotified) {
        try {
          setNotifiedList(JSON.parse(storedNotified));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleReminder = async (classId: string, classTitle: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast.error('Notifications permission denied. Reminders require access.');
          return;
        }
      } else if (Notification.permission === 'denied') {
        alert('Browser notification permissions are blocked for this site. Enable them in settings to get start alerts.');
        return;
      }
    }

    let updated: string[];
    if (reminders.includes(classId)) {
      updated = reminders.filter(id => id !== classId);
      toast.success('Live reminder removed.');
    } else {
      updated = [...reminders, classId];
      toast.success(`Reminder set! We will notify you when "${classTitle}" goes live.`);
    }

    setReminders(updated);
    localStorage.setItem('msk_live_reminders', JSON.stringify(updated));
  };

  // Helper to parse class date & time
  const parseClassDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return new Date();
    const epoch = parseISTTimeToEpoch(dateStr, timeStr);
    if (epoch) return new Date(epoch);
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const modifier = match[4]?.toUpperCase();
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        d.setHours(hours, minutes, 0, 0);
        return d;
      }
      return new Date();
    } catch {
      return new Date();
    }
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getDaysDifference = (targetDate: Date, baseDate: Date) => {
    const t = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
    const b = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()).getTime();
    return Math.round((t - b) / (1000 * 60 * 60 * 24));
  };

  // Notification scheduler interval
  useEffect(() => {
    if (reminders.length === 0) return;

    initialClasses.forEach(c => {
      if (reminders.includes(c.id) && !notifiedList.includes(c.id)) {
        const startTime = parseClassDateTime(c.date, c.startTime);
        const endTime = c.endTime 
          ? parseClassDateTime(c.date, c.endTime) 
          : new Date(startTime.getTime() + (c.durationMinutes || 60) * 60000);
        
        // If current time is within starting window
        if (time >= startTime && time < endTime) {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('Live Class Started! 🔴', {
                body: `${c.batchTitle || c.courseTitle} by ${c.instructor} is now starting. Click here to join.`,
                icon: '/logo.jpg',
                tag: c.id
              });
            } catch (err) {
              console.error('Failed to trigger notification:', err);
            }
          }
          
          toast.success(`🔴 Live Class is now ACTIVE!`, { duration: 10000 });
          
          const newNotified = [...notifiedList, c.id];
          setNotifiedList(newNotified);
          localStorage.setItem('msk_live_notified', JSON.stringify(newNotified));
        }
      }
    });
  }, [time, reminders, notifiedList, initialClasses]);

  // Class status solver
  const getClassStatus = (c: LiveClass) => {
    const startTime = parseClassDateTime(c.date, c.startTime);
    const endTime = c.endTime 
      ? parseClassDateTime(c.date, c.endTime) 
      : new Date(startTime.getTime() + (c.durationMinutes || 60) * 60000);
    
    if (time >= startTime && time <= endTime) {
      return { type: 'live', label: 'LIVE NOW', color: 'bg-red-500 text-white animate-pulse' };
    } else if (time < startTime) {
      const diffMs = startTime.getTime() - time.getTime();
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      
      let countdownStr = '';
      if (diffHrs > 0) {
        countdownStr = `Starts in ${diffHrs}h ${diffMins}m`;
      } else if (diffMins > 0) {
        countdownStr = `Starts in ${diffMins}m ${diffSecs}s`;
      } else {
        countdownStr = `Starts in ${diffSecs}s`;
      }

      return { type: 'upcoming', label: countdownStr, color: 'bg-[#B83A00]/10 text-[#B83A00]' };
    } else {
      return { type: 'completed', label: 'COMPLETED', color: 'bg-gray-100 text-gray-500' };
    }
  };

  // Helper for platform visuals
  const getPlatformVisual = (platform?: string) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('youtube')) {
      return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        icon: <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 flex-shrink-0" />
      };
    }
    if (p.includes('meet')) {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <Video className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      };
    }
    if (p.includes('zoom')) {
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <Video className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
      };
    }
    return {
      badge: 'bg-secondary/10 text-secondary border-secondary/20',
      icon: <Sparkles className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
    };
  };

  // Filter today's classes
  const todayClasses = initialClasses.filter(c => {
    const classDate = parseClassDateTime(c.date, c.startTime);
    if (!isSameDay(classDate, time) && c.offsetDays !== 0) return false;
    const hideTime = c.endTime 
      ? new Date(parseClassDateTime(c.date, c.endTime).getTime() + 3600000) 
      : new Date(classDate.getTime() + (c.durationMinutes || 60) * 60000 + 3600000);
    return time < hideTime;
  });
  
  // Filter upcoming 7 days classes
  const upcomingClasses = initialClasses
    .filter(c => {
      const classDate = parseClassDateTime(c.date, c.startTime);
      const daysDiff = getDaysDifference(classDate, time);
      if (daysDiff > 0 && daysDiff <= 7) return true;
      if (c.offsetDays && c.offsetDays > 0 && c.offsetDays <= 7) return true;
      return false;
    })
    .sort((a, b) => {
      const dateA = parseClassDateTime(a.date, a.startTime).getTime();
      const dateB = parseClassDateTime(b.date, b.startTime).getTime();
      return dateA - dateB;
    });

  const openBooking = (batchTitle: string) => {
    setSelectedBatchTitle(batchTitle);
    setShowBookingModal(true);
  };

  return (
    <div className="space-y-16">
      {/* 1. Today's Live Sessions Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div>
              <h2 className="text-2xl font-bold text-primary">Today's Live Classes</h2>
              <p className="text-xs text-text-muted">Real-time schedule of active and upcoming live sessions for today</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {todayClasses.length > 0 && (
              <span className="text-xs font-bold px-3 py-1 bg-surface border border-border-subtle rounded-full text-text-muted w-fit">
                {todayClasses.length} session{todayClasses.length === 1 ? '' : 's'} scheduled
              </span>
            )}
            <WebShareButton
              variant="compact"
              title="MSK Institute Live Classroom & Batches Schedule"
              text="Check out today's live coding classes and upcoming batches timetable at MSK Institute Shikohabad:"
              url="/live"
              label="Share Schedule"
              className="bg-surface hover:bg-surface/80"
            />
          </div>
        </div>

        {todayClasses.length > 0 ? (
          <>
            {/* Desktop / Laptop / Large Screen Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface/80 border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="py-3.5 px-6">Chapter / Topic</th>
                      <th className="py-3.5 px-6">Batch / Course</th>
                      <th className="py-3.5 px-6">Schedule & Status</th>
                      <th className="py-3.5 px-6">Mentor</th>
                      <th className="py-3.5 px-6">Platform</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {todayClasses.map((c) => {
                      const status = getClassStatus(c);
                      const isLive = status.type === 'live';
                      const isCompleted = status.type === 'completed';
                      const platformVisual = getPlatformVisual(c.platform);
                      const shareData = getClassShareData(c, isLive);
                      const isTargeted = highlightedId === `class-${c.id}`;

                      return (
                        <tr 
                          id={`class-${c.id}`}
                          key={c.id} 
                          className={`scroll-mt-24 transition-all ${
                            isTargeted 
                              ? 'bg-[#B83A00]/10 ring-2 ring-inset ring-[#B83A00]' 
                              : isLive 
                                ? 'bg-red-50/20 hover:bg-red-50/40' 
                                : 'hover:bg-surface/50'
                          }`}
                        >
                          {/* 1. Topics Covered (Show ONLY topics, no title & description) */}
                          <td className="py-4 px-6 align-top min-w-[260px]">
                            {c.topics && c.topics.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {c.topics.map((t, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted bg-surface border border-border-subtle px-2 py-0.5 rounded"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-[#B83A00] flex-shrink-0" />
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-text-muted italic">Topics will be announced</span>
                            )}
                          </td>

                          {/* 2. Batch / Course */}
                          <td className="py-4 px-6 align-top min-w-[180px]">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-black text-[#B83A00] tracking-wider px-2 py-0.5 bg-[#B83A00]/10 rounded inline-block">
                                {c.courseTitle}
                              </span>
                              {c.batchTitle && (
                                <p className="text-xs font-bold text-primary">
                                  {c.batchTitle}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* 3. Schedule & Status (Includes Countdown) */}
                          <td className="py-4 px-6 align-top min-w-[180px]">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                                <span>{c.startTime}{c.endTime ? ` - ${c.endTime}` : ''}</span>
                              </div>
                              <div className="text-[11px] text-text-muted">
                                Duration: {c.durationMinutes} mins
                              </div>
                              <div>
                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${status.color}`}>
                                  {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-0.5" />}
                                  {status.label}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 4. Mentor */}
                          <td className="py-4 px-6 align-top min-w-[150px]">
                            <div className="flex items-center gap-2.5">
                              {c.instructorPicture ? (
                                <img
                                  src={c.instructorPicture}
                                  alt={c.instructor || 'Mentor'}
                                  width={36}
                                  height={36}
                                  loading="lazy"
                                  className="w-9 h-9 rounded-full object-cover border-2 border-secondary/50 shadow-xs flex-shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {(c.instructor && c.instructor[0]) || 'S'}
                                </div>
                              )}
                              <div>
                                <div className="text-xs font-bold text-primary">{c.instructor}</div>
                                <div className="text-[10px] text-text-muted">Lead Mentor</div>
                              </div>
                            </div>
                          </td>

                          {/* 5. Platform */}
                          <td className="py-4 px-6 align-top min-w-[140px]">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${platformVisual.badge}`}>
                              {platformVisual.icon}
                              {c.platform || 'Online Live'}
                            </span>
                          </td>

                          {/* 6. Action */}
                          <td className="py-4 px-6 align-top text-right min-w-[170px]">
                            <div className="flex items-center justify-end gap-2">
                              <WebShareButton
                                variant="icon"
                                title={shareData.title}
                                text={shareData.text}
                                url={shareData.url}
                                label="Share Class"
                              />
                              {isLive ? (
                                <a 
                                  href={c.joinUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-lg shadow-sm transition-colors animate-pulse"
                                >
                                  <span>Join Now</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : isCompleted ? (
                                <button 
                                  disabled
                                  className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed"
                                >
                                  Completed
                                </button>
                              ) : (
                                <button 
                                  onClick={() => toggleReminder(c.id, c.batchTitle || c.courseTitle || 'Live Class')}
                                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer ${
                                    reminders.includes(c.id)
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                      : 'bg-primary hover:bg-primary/95 text-white'
                                  }`}
                                >
                                  {reminders.includes(c.id) ? (
                                    <>
                                      <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Reminder Set ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Bell className="w-3.5 h-3.5" />
                                      <span>Set Reminder</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Smartphone Card View */}
            <div className="block md:hidden space-y-4">
              {todayClasses.map((c) => {
                const status = getClassStatus(c);
                const isLive = status.type === 'live';
                const isCompleted = status.type === 'completed';
                const platformVisual = getPlatformVisual(c.platform);
                const shareData = getClassShareData(c, isLive);
                const isTargeted = highlightedId === `class-${c.id}`;

                return (
                  <div 
                    id={`class-${c.id}`}
                    key={c.id} 
                    className={`scroll-mt-24 bg-white rounded-2xl border p-4 sm:p-5 shadow-sm space-y-4 transition-all ${
                      isTargeted
                        ? 'border-[#B83A00] ring-2 ring-[#B83A00]'
                        : isLive 
                          ? 'border-red-400 ring-2 ring-red-500/10' 
                          : 'border-border-subtle'
                    }`}
                  >
                    {/* Header: Course badge & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-black text-[#B83A00] tracking-wider px-2 py-0.5 bg-[#B83A00]/10 rounded truncate">
                        {c.courseTitle}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md shrink-0 ${status.color}`}>
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-0.5" />}
                        {status.label}
                      </span>
                    </div>

                    {/* Batch title */}
                    {c.batchTitle && (
                      <p className="text-xs font-bold text-primary">
                        {c.batchTitle}
                      </p>
                    )}

                    {/* Chapter / Topic */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                        Chapter / Topic:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.topics && c.topics.map((t, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted bg-surface border border-border-subtle px-2 py-0.5 rounded"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#B83A00] flex-shrink-0" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Schedule & Timing with Platform Badge */}
                    <div className="bg-surface/80 rounded-xl p-3 border border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-primary">
                          <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span>{c.startTime}{c.endTime ? ` - ${c.endTime}` : ''}</span>
                        </div>
                        <div className="text-[11px] text-text-muted">
                          Duration: {c.durationMinutes} mins
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded border shrink-0 ${platformVisual.badge}`}>
                        {platformVisual.icon}
                        {c.platform || 'Online Live'}
                      </span>
                    </div>

                    {/* Mentor & Action */}
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between pt-3 border-t border-border-subtle gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {c.instructorPicture ? (
                          <img
                            src={c.instructorPicture}
                            alt={c.instructor || 'Mentor'}
                            width={32}
                            height={32}
                            loading="lazy"
                            className="w-8 h-8 rounded-full object-cover border border-secondary/50 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {(c.instructor && c.instructor[0]) || 'S'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-primary truncate">{c.instructor}</div>
                          <div className="text-[10px] text-text-muted">Lead Mentor</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full xs:w-auto shrink-0">
                        <WebShareButton
                          variant="compact"
                          title={shareData.title}
                          text={shareData.text}
                          url={shareData.url}
                          label="Share"
                          className="flex-1 xs:flex-initial justify-center py-2"
                        />
                        {isLive ? (
                          <a 
                            href={c.joinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 xs:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-lg shadow-sm transition-colors animate-pulse text-center"
                          >
                            <span>Join Now</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : isCompleted ? (
                          <button 
                            disabled
                            className="flex-1 xs:flex-initial px-3 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed text-center"
                          >
                            Completed
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleReminder(c.id, c.batchTitle || c.courseTitle || 'Live Class')}
                            className={`flex-1 xs:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer text-center ${
                              reminders.includes(c.id)
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                : 'bg-primary hover:bg-primary/95 text-white'
                            }`}
                          >
                            {reminders.includes(c.id) ? (
                              <>
                                <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Reminder Set</span>
                              </>
                            ) : (
                              <>
                                <Bell className="w-3.5 h-3.5" />
                                <span>Set Reminder</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-surface rounded-2xl border border-border-subtle p-8 text-center max-w-xl mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-secondary mx-auto" />
            <h3 className="text-base font-bold text-primary">No live classes scheduled for today</h3>
            <p className="text-xs text-text-muted">
              Check our 7-day upcoming class timetable below to see what sessions are coming up next.
            </p>
          </div>
        )}
      </section>

      {/* 2. Upcoming Live Classes (Next 7 Days) Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Upcoming Classes in Next 7 Days</h2>
              <p className="text-xs text-text-muted">Weekly schedule of upcoming live lectures across all learning tracks</p>
            </div>
          </div>
        </div>

        {upcomingClasses.length > 0 ? (
          <>
            {/* Desktop / Laptop / Large Screen Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface/80 border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="py-3.5 px-6">Date & Schedule</th>
                      <th className="py-3.5 px-6">Chapter / Topic</th>
                      <th className="py-3.5 px-6">Course & Batch</th>
                      <th className="py-3.5 px-6">Mentor</th>
                      <th className="py-3.5 px-6">Platform</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {upcomingClasses.map((c) => {
                      const classDate = parseClassDateTime(c.date, c.startTime);
                      const daysDiff = getDaysDifference(classDate, time);
                      const dayLabel = daysDiff === 1 || c.offsetDays === 1
                        ? 'Tomorrow' 
                        : classDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
                      const platformVisual = getPlatformVisual(c.platform);
                      const shareData = getClassShareData(c, false);
                      const isTargeted = highlightedId === `class-${c.id}`;

                      return (
                        <tr 
                          id={`class-${c.id}`}
                          key={c.id} 
                          className={`scroll-mt-24 transition-all ${
                            isTargeted 
                              ? 'bg-[#B83A00]/10 ring-2 ring-inset ring-[#B83A00]' 
                              : 'hover:bg-surface/50'
                          }`}
                        >
                          {/* 1. Date & Schedule */}
                          <td className="py-4 px-6 align-top min-w-[160px]">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-[#B83A00] bg-[#B83A00]/10 px-2 py-0.5 rounded uppercase inline-block">
                                {dayLabel}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                                <span>{c.startTime}{c.endTime ? ` - ${c.endTime}` : ''}</span>
                              </div>
                              <div className="text-[11px] text-text-muted">
                                {c.durationMinutes} mins
                              </div>
                            </div>
                          </td>

                          {/* 2. Topics Covered (Show ONLY topics, no title & description) */}
                          <td className="py-4 px-6 align-top min-w-[260px]">
                            {c.topics && c.topics.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {c.topics.map((t, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted bg-surface border border-border-subtle px-2 py-0.5 rounded"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-[#B83A00] flex-shrink-0" />
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-text-muted italic">Topics will be announced</span>
                            )}
                          </td>

                          {/* 3. Course & Batch */}
                          <td className="py-4 px-6 align-top min-w-[180px]">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-text-muted bg-gray-100 px-2 py-0.5 rounded inline-block">
                                {c.courseTitle}
                              </span>
                              {c.batchTitle && (
                                <p className="text-xs font-semibold text-primary">
                                  {c.batchTitle}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* 4. Mentor */}
                          <td className="py-4 px-6 align-top min-w-[150px]">
                            <div className="flex items-center gap-2.5">
                              {c.instructorPicture ? (
                                <img
                                  src={c.instructorPicture}
                                  alt={c.instructor || 'Mentor'}
                                  width={36}
                                  height={36}
                                  loading="lazy"
                                  className="w-9 h-9 rounded-full object-cover border-2 border-secondary/50 shadow-xs flex-shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {(c.instructor && c.instructor[0]) || 'S'}
                                </div>
                              )}
                              <div>
                                <div className="text-xs font-bold text-primary">{c.instructor}</div>
                                <div className="text-[10px] text-text-muted">Lead Mentor</div>
                              </div>
                            </div>
                          </td>

                          {/* 5. Platform */}
                          <td className="py-4 px-6 align-top min-w-[140px]">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${platformVisual.badge}`}>
                              {platformVisual.icon}
                              {c.platform || 'Online Live'}
                            </span>
                          </td>

                          {/* 6. Action */}
                          <td className="py-4 px-6 align-top text-right min-w-[170px]">
                            <div className="flex items-center justify-end gap-2">
                              <WebShareButton
                                variant="icon"
                                title={shareData.title}
                                text={shareData.text}
                                url={shareData.url}
                                label="Share Class"
                              />
                              <button 
                                onClick={() => toggleReminder(c.id, c.batchTitle || c.courseTitle || 'Live Class')}
                                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer ${
                                  reminders.includes(c.id)
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-primary hover:bg-primary/95 text-white'
                                }`}
                              >
                                {reminders.includes(c.id) ? (
                                  <>
                                    <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Reminder Set ✓</span>
                                  </>
                                ) : (
                                  <>
                                    <Bell className="w-3.5 h-3.5" />
                                    <span>Set Reminder</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Smartphone Card View */}
            <div className="block md:hidden space-y-4">
              {upcomingClasses.map((c) => {
                const classDate = parseClassDateTime(c.date, c.startTime);
                const daysDiff = getDaysDifference(classDate, time);
                const dayLabel = daysDiff === 1 || c.offsetDays === 1
                  ? 'Tomorrow' 
                  : classDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
                const platformVisual = getPlatformVisual(c.platform);
                const shareData = getClassShareData(c, false);
                const isTargeted = highlightedId === `class-${c.id}`;

                return (
                  <div 
                    id={`class-${c.id}`}
                    key={c.id} 
                    className={`scroll-mt-24 bg-white rounded-2xl border p-4 sm:p-5 shadow-sm space-y-4 transition-all ${
                      isTargeted ? 'border-[#B83A00] ring-2 ring-[#B83A00]' : 'border-border-subtle'
                    }`}
                  >
                    {/* Header: Date badge & Course */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#B83A00] bg-[#B83A00]/10 px-2 py-0.5 rounded uppercase">
                        {dayLabel} • {c.startTime}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-text-muted bg-gray-100 px-2 py-0.5 rounded">
                        {c.courseTitle}
                      </span>
                    </div>

                    {c.batchTitle && (
                      <p className="text-xs font-bold text-primary">
                        {c.batchTitle}
                      </p>
                    )}

                    {/* Chapter / Topic */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                        Chapter / Topic:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.topics && c.topics.map((t, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted bg-surface border border-border-subtle px-2 py-0.5 rounded"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#B83A00] flex-shrink-0" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mentor & Platform Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border-subtle items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        {c.instructorPicture ? (
                          <img
                            src={c.instructorPicture}
                            alt={c.instructor || 'Mentor'}
                            width={28}
                            height={28}
                            loading="lazy"
                            className="w-7 h-7 rounded-full object-cover border border-secondary/50 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {(c.instructor && c.instructor[0]) || 'S'}
                          </div>
                        )}
                        <span className="font-semibold text-primary text-xs truncate">{c.instructor}</span>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${platformVisual.badge}`}>
                          {platformVisual.icon}
                          {c.platform || 'Online Live'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: 2-column balanced grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <WebShareButton
                        variant="button"
                        title={shareData.title}
                        text={shareData.text}
                        url={shareData.url}
                        label="Share"
                        className="w-full py-2.5"
                      />
                      <button 
                        onClick={() => toggleReminder(c.id, c.batchTitle || c.courseTitle || 'Live Class')}
                        className={`w-full py-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer ${
                          reminders.includes(c.id)
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-primary hover:bg-primary/95 text-white'
                        }`}
                      >
                        {reminders.includes(c.id) ? (
                          <>
                            <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Reminder Set ✓</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5" />
                            <span>Set Reminder</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center p-8 bg-surface border border-border-subtle rounded-2xl max-w-xl mx-auto">
            <p className="text-sm text-text-muted font-medium">No other classes scheduled over the next week.</p>
          </div>
        )}
      </section>

      {/* 3. Upcoming Live Batches Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Upcoming Live Batches</h2>
              <p className="text-xs text-text-muted">New cohort admissions with interactive live lectures, practical labs & mentorship</p>
            </div>
          </div>
        </div>

        {/* Desktop / Laptop Table View */}
        <div className="hidden md:block bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface/80 border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="py-3.5 px-6">Batch Name & Course</th>
                  <th className="py-3.5 px-6">Start Date & Duration</th>
                  <th className="py-3.5 px-6">Weekly Schedule</th>
                  <th className="py-3.5 px-6">Lead Mentor</th>
                  <th className="py-3.5 px-6">Fee & Seats</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {initialBatches.map((b) => {
                  const startDateStr = b.startDate ? (() => {
                    try {
                      const d = new Date(b.startDate);
                      if (!isNaN(d.getTime())) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                    } catch {}
                    return b.startDate;
                  })() : 'Upcoming Batch';
                  
                  const remainingSeats = b.leftSeats ?? 5;
                  const total = b.totalSeats || 20;
                  const batchShareData = getBatchShareData(b, startDateStr);
                  const isTargeted = highlightedId === `batch-${b.id}`;

                  return (
                    <tr 
                      id={`batch-${b.id}`}
                      key={b.id} 
                      className={`scroll-mt-24 transition-all ${
                        isTargeted 
                          ? 'bg-[#B83A00]/10 ring-2 ring-inset ring-[#B83A00]' 
                          : 'hover:bg-surface/50'
                      }`}
                    >
                      {/* 1. Batch Name & Course */}
                      <td className="py-4 px-6 align-top min-w-[280px]">
                        <div className="space-y-1.5">
                          <Link 
                            href={`/live-batches/${b.id}`}
                            className="font-bold text-primary text-base hover:text-secondary transition-colors inline-block"
                          >
                            {b.title}
                          </Link>
                          <div>
                            <span className="text-[10px] font-bold text-text-muted bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                              {b.courseTitle}
                            </span>
                          </div>
                          {b.description && (
                            <p className="text-xs text-text-muted line-clamp-2 max-w-md leading-relaxed">
                              {b.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 2. Start Date & Duration */}
                      <td className="py-4 px-6 align-top min-w-[170px]">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-[#B83A00] bg-[#B83A00]/10 px-2 py-0.5 rounded uppercase inline-block">
                            Starting {startDateStr}
                          </span>
                          <div className="text-xs font-semibold text-primary">
                            Duration: {b.duration || '3 Months'}
                          </div>
                        </div>
                      </td>

                      {/* 3. Weekly Schedule */}
                      <td className="py-4 px-6 align-top min-w-[190px]">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-primary">
                            {b.schedule}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-green-700 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>100% Practical Labs</span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Lead Mentor */}
                      <td className="py-4 px-6 align-top min-w-[160px]">
                        <div className="flex items-center gap-2.5">
                          {b.instructorPicture ? (
                            <img
                              src={b.instructorPicture}
                              alt={b.instructor || 'Mentor'}
                              width={40}
                              height={40}
                              loading="lazy"
                              className="w-10 h-10 rounded-full object-cover border-2 border-secondary/50 shadow-xs flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {(b.instructor && b.instructor[0]) || 'S'}
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-bold text-primary">{b.instructor}</div>
                            <div className="text-[10px] text-text-muted">Lead Mentor</div>
                          </div>
                        </div>
                      </td>

                      {/* 5. Fee & Seats */}
                      <td className="py-4 px-6 align-top min-w-[160px]">
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-secondary">{b.price}</span>
                            {b.originalPrice && (
                              <span className="text-[11px] text-text-muted line-through">
                                {b.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-red-500 font-bold flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Only {remainingSeats} of {total} Left
                          </div>
                        </div>
                      </td>

                      {/* 6. Action */}
                      <td className="py-4 px-6 align-top text-right min-w-[180px]">
                        <div className="flex items-center justify-end gap-2">
                          <WebShareButton
                            variant="icon"
                            title={batchShareData.title}
                            text={batchShareData.text}
                            url={batchShareData.url}
                            label="Share Batch"
                          />
                          <Link 
                            href={`/live-batches/${b.id}`}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile / Smartphone Card View */}
        <div className="block md:hidden space-y-4">
          {initialBatches.map((b) => {
            const startDateStr = b.startDate ? (() => {
              try {
                const d = new Date(b.startDate);
                if (!isNaN(d.getTime())) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
              } catch {}
              return b.startDate;
            })() : 'Upcoming Batch';
            
            const remainingSeats = b.leftSeats ?? 5;
            const total = b.totalSeats || 20;
            const batchShareData = getBatchShareData(b, startDateStr);
            const isTargeted = highlightedId === `batch-${b.id}`;

            return (
              <div 
                id={`batch-${b.id}`}
                key={b.id} 
                className={`scroll-mt-24 bg-white rounded-2xl border p-4 sm:p-5 shadow-sm space-y-4 transition-all ${
                  isTargeted ? 'border-[#B83A00] ring-2 ring-[#B83A00]' : 'border-border-subtle'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#B83A00] bg-[#B83A00]/10 px-2 py-0.5 rounded uppercase">
                      Starting {startDateStr}
                    </span>
                    <Link 
                      href={`/live-batches/${b.id}`}
                      className="block font-bold text-primary text-base hover:text-secondary truncate"
                    >
                      {b.title}
                    </Link>
                    <p className="text-xs text-text-muted">{b.courseTitle}</p>
                  </div>
                  <span className="text-sm font-black text-secondary bg-secondary/5 px-2.5 py-1 rounded border border-secondary/10 flex-shrink-0">
                    {b.price}
                  </span>
                </div>

                {b.description && (
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {b.description}
                  </p>
                )}

                <div className="flex items-center gap-2.5 pt-3 border-t border-border-subtle text-xs">
                  {b.instructorPicture ? (
                    <img
                      src={b.instructorPicture}
                      alt={b.instructor}
                      width={36}
                      height={36}
                      loading="lazy"
                      className="w-9 h-9 rounded-full object-cover border border-secondary/50 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {b.instructor[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-primary truncate">{b.instructor}</div>
                    <div className="text-[11px] text-text-muted truncate">{b.schedule}</div>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row xs:items-center justify-between pt-3 border-t border-border-subtle gap-3">
                  <span className="text-xs text-red-500 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Only {remainingSeats} of {total} Left
                  </span>
                  <div className="grid grid-cols-2 xs:flex xs:items-center gap-2 w-full xs:w-auto shrink-0">
                    <WebShareButton
                      variant="compact"
                      title={batchShareData.title}
                      text={batchShareData.text}
                      url={batchShareData.url}
                      label="Share"
                      className="w-full xs:w-auto justify-center py-2"
                    />
                    <Link 
                      href={`/live-batches/${b.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-lg shadow-sm transition-colors text-center"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Live Classroom Knowledge Base & Key Facts (AI Agentic SEO & Student Guide) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">MSK Live Learning Ecosystem</h2>
            <p className="text-xs text-text-muted">Real-time practical training architecture led by industry mentors in Shikohabad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Lead Mentorship</span>
            </div>
            <h3 className="font-bold text-sm text-primary">Er. Sumit Kumar</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Senior Software Engineer with 8+ years experience guiding students through production coding practices.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <Laptop className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Multi-Platform Access</span>
            </div>
            <h3 className="font-bold text-sm text-primary">Meet, YouTube & Zoom</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              High-definition video streaming with interactive screen share, real-time audio Q&A, and chat assistance.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Hands-On Labs</span>
            </div>
            <h3 className="font-bold text-sm text-primary">100% Practical Focus</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Live syntax coding, terminal walkthroughs, full-stack debug sessions, and project building in every class.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-secondary">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Shikohabad Centre</span>
            </div>
            <h3 className="font-bold text-sm text-primary">Hybrid Lab Facility</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Attend online from home or join physical offline practical labs at Station Road, Shikohabad (Firozabad, UP).
            </p>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions (AI Answer Engine & Student FAQ) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Live Classroom FAQs</h2>
            <p className="text-xs text-text-muted">Frequently asked questions about attending, schedule updates, and live batch admissions</p>
          </div>
        </div>

        <div className="space-y-3">
          {liveFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-primary hover:text-secondary transition-colors cursor-pointer gap-3 sm:gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-black flex-shrink-0">
                      Q
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-secondary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs text-text-muted leading-relaxed border-t border-border-subtle/50 live-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Help & Support */}
      <section className="bg-primary text-white rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-md">
        <div className="max-w-2xl space-y-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Need assistance joining a Live Class?</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            If you are registered for a live batch and haven't received your classroom codes, or if you face connection issues, reach out to our coordinator immediately.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <a 
              href="tel:+918393042166" 
              className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-lg shadow transition-colors text-center"
            >
              Call Coordinator: +91 83930 42166
            </a>
            <a 
              href="mailto:mskshikohabad@gmail.com" 
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-lg transition-colors text-center"
            >
              Email Technical Support
            </a>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <Video className="w-full h-full object-contain" />
        </div>
      </section>

      {/* 7. Booking Modal (Popup) */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xl space-y-6 max-w-md w-full relative">
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-text-muted hover:text-primary hover:bg-surface cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <DemoBookingForm courseTitle={selectedBatchTitle} isEmbedded={true} />
          </div>
        </div>
      )}
    </div>
  );
}
