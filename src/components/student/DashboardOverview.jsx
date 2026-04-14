import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const DashboardOverview = () => {
  const { theme } = useContext(ThemeContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses/student-dashboard/');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, subtitle, icon, stripeColor }) => (
    <div className="stat-card" style={{ '--stripe-color': stripeColor }}>
      <div className="stat-stripe" style={{ backgroundColor: stripeColor }}></div>
      <div className="stat-label">{title}</div>
      <div className="stat-val">{value}</div>
      {subtitle && <div className="stat-sub">{subtitle}</div>}
      <div className="stat-icon">{icon}</div>
    </div>
  );

  const CourseCard = ({ course, showProgress = true }) => (
    <div className="course-card">
      <div className="course-thumb" style={{
        background: course.completed
          ? 'linear-gradient(135deg, #BF360C, #E64A19)'
          : `linear-gradient(135deg, ${course.color1 || '#1565C0'}, ${course.color2 || '#1E88E5'})`
      }}>
        {course.completed && <span className="completed-tag">✓ Done</span>}
        {course.emoji}
      </div>
      <div className="course-body">
        <div className="course-name">{course.title}</div>
        <div className="course-meta">{course.instructor} · {course.lessons} lessons{course.duration && ` · ${course.duration}`}</div>
        {showProgress && (
          <>
            <div className="pbar">
              <div className="pfill" style={{
                width: `${course.progress}%`,
                backgroundColor: course.completed ? '#E64A19' : (course.color1 || '#1565C0')
              }}></div>
            </div>
            <div className="prow">
              <span>{course.progress === 100 ? 'Completed!' : `${course.progress}% complete`}</span>
              <span>{course.completedLessons}/{course.lessons}</span>
            </div>
          </>
        )}
        <button className={`card-btn ${course.completed ? 'green' : ''}`}>
          {course.completed ? 'View Certificate' : 'Continue Learning'}
        </button>
      </div>
    </div>
  );

  // Mock data based on HTML design
  const mockData = {
    overview: {
      enrolledCourses: 4,
      completedCourses: 2,
      pendingTasks: 3,
      attendance: '86%',
      upcomingDemos: 2
    },
    courses: [
      {
        id: 1,
        title: 'Full Stack Web Development',
        instructor: 'Sumit Kumar',
        lessons: 25,
        duration: '6 months',
        progress: 72,
        completedLessons: 18,
        emoji: '⚙️',
        color1: '#1565C0',
        color2: '#1E88E5'
      },
      {
        id: 2,
        title: 'Python for Beginners',
        instructor: 'Rahul Singh',
        lessons: 20,
        duration: '3 months',
        progress: 45,
        completedLessons: 9,
        emoji: '🐍',
        color1: '#00695C',
        color2: '#00ACC1'
      },
      {
        id: 3,
        title: 'UI/UX Design Fundamentals',
        instructor: 'Priya Sharma',
        lessons: 20,
        duration: '3 months',
        progress: 30,
        completedLessons: 6,
        emoji: '🎨',
        color1: '#4A148C',
        color2: '#7B1FA2'
      }
    ]
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: `3px solid #e2e8f0`,
          borderTop: '3px solid #1565c0',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Dashboard Overview</div>
        <div className="page-sub">Here's what's happening with your learning today.</div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="ENROLLED COURSES"
          value={mockData.overview.enrolledCourses}
          subtitle="Active this semester"
          icon="📚"
          stripeColor="#1565C0"
        />
        <StatCard
          title="COMPLETED"
          value={mockData.overview.completedCourses}
          subtitle="With certificates"
          icon="🎓"
          stripeColor="#00ACC1"
        />
        <StatCard
          title="PENDING TASKS"
          value={mockData.overview.pendingTasks}
          subtitle="Due this week"
          icon="📝"
          stripeColor="#E65100"
        />
        <StatCard
          title="ATTENDANCE"
          value={mockData.overview.attendance}
          subtitle="April 2026"
          icon="📊"
          stripeColor="#2E7D32"
        />
        <StatCard
          title="UPCOMING DEMOS"
          value={mockData.overview.upcomingDemos}
          subtitle="Next 7 days"
          icon="🎥"
          stripeColor="#C62828"
        />
      </div>

      <div className="alert-strip">
        <span className="alert-ico">🔔</span>
        <span className="alert-text">
          <strong>Reminder:</strong> Your "Full Stack Web Dev" demo class is tomorrow at 11:00 AM (Online - Zoom)
        </span>
        <span className="alert-link">
          View Demo →
        </span>
      </div>

      <div className="sec-head">
        <span className="sec-title">Continue Learning</span>
        <button className="sec-link">
          View all courses →
        </button>
      </div>

      <div className="courses-grid">
        {mockData.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
};

export default DashboardOverview;