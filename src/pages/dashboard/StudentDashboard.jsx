import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../api/axios';
import FeeHistoryModal from '../../components/FeeHistoryModal';
import FeeSubmitModal from '../../components/FeeSubmitModal';
import DashboardOverview from '../../components/student/DashboardOverview';
import MyCoursesSection from '../../components/student/MyCoursesSection';
import AssignmentsSection from '../../components/student/AssignmentsSection';
import AttendanceSection from '../../components/student/AttendanceSection';
import ProgressSection from '../../components/student/ProgressSection';
import DemoSection from '../../components/student/DemoSection';
import CertificatesSection from '../../components/student/CertificatesSection';
import PaymentSection from '../../components/student/PaymentSection';
import SettingsSection from '../../components/student/SettingsSection';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeeHistoryModal, setShowFeeHistoryModal] = useState(false);
  const [selectedFeeHistories, setSelectedFeeHistories] = useState([]);
  const [submitCourse, setSubmitCourse] = useState(null);
  const [showFeeSubmitModal, setShowFeeSubmitModal] = useState(false);

  // Determine active tab from URL path
  const getActiveTabFromPath = (pathname) => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment || 'overview';
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses/student-dashboard/');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme === 'dark' ? '#1a1f2e' : '#f0f4f9'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid',
          borderTop: '4px solid #1565c0',
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

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: theme === 'dark' ? '#1a1f2e' : '#f0f4f9'
      }}>
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          maxWidth: '400px',
          textAlign: 'center',
          backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
          color: '#c62828'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'courses':
        return <MyCoursesSection />;
      case 'assignments':
        return <AssignmentsSection />;
      case 'attendance':
        return <AttendanceSection />;
      case 'progress':
        return <ProgressSection />;
      case 'demo':
        return <DemoSection />;
      case 'certificates':
        return <CertificatesSection />;
      case 'payments':
        return <PaymentSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <>
      <Helmet>
        <title>MSK Institute — Student Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="View your enrolled courses, progress, results, and certificate details from the MSK Institute Student Dashboard." />
        <link rel="canonical" href="https://msk.shikohabad.in/student-dashboard" />
        <meta property="og:title" content="Student Dashboard – MSK Institute" />
        <meta property="og:description" content="Access your personal dashboard to manage learning at MSK Institute." />
        <meta property="og:url" content="https://msk.shikohabad.in/student-dashboard" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="content">
        {renderContent()}
      </div>

      {/* Modals */}
      <FeeHistoryModal
        open={showFeeHistoryModal}
        onClose={() => setShowFeeHistoryModal(false)}
        feeHistories={selectedFeeHistories}
        theme={theme}
      />

      <FeeSubmitModal
        open={showFeeSubmitModal}
        onClose={() => { setShowFeeSubmitModal(false); setSubmitCourse(null); }}
        course={submitCourse || {}}
        onSubmitted={() => { window.location.reload(); }}
        theme={theme}
      />
    </>
  );
};

export default StudentDashboard;
