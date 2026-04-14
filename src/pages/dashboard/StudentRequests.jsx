import { useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../api/axios';
import FeeHistoryModal from '../../components/FeeHistoryModal';
import FeeSubmitModal from '../../components/FeeSubmitModal';
import toast from 'react-hot-toast';

const StudentRequests = () => {
  const { theme } = useContext(ThemeContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeeHistoryModal, setShowFeeHistoryModal] = useState(false);
  const [selectedFeeHistories, setSelectedFeeHistories] = useState([]);
  const [submitCourse, setSubmitCourse] = useState(null);
  const [showFeeSubmitModal, setShowFeeSubmitModal] = useState(false);

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
          border: `4px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'}`,
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
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Error Loading Requests</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Requests — MSK Institute</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="View and manage your requests at MSK Institute." />
      </Helmet>

      <div className="content">
        <div className="page-hdr">
          <div className="page-title">My Requests</div>
          <div className="page-sub">View and manage your submitted requests.</div>
        </div>

        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: theme === 'dark' ? '#374151' : '#f8fafc',
          borderRadius: '12px',
          border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme === 'dark' ? '#f3f4f6' : '#1a1f2e',
            marginBottom: '8px'
          }}>
            No Requests Found
          </h3>
          <p style={{
            color: theme === 'dark' ? '#9ca3af' : '#64748b',
            fontSize: '14px'
          }}>
            You haven't submitted any requests yet. Requests for fee submissions, course changes, or other services will appear here.
          </p>
        </div>
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

export default StudentRequests;