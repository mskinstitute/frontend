import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { ThemeContext } from '../../context/ThemeContext';
import {
  BookOpen, GraduationCap, Award, Medal, Calendar, Clock,
  CheckCircle, AlertCircle, TrendingUp, Users, DollarSign,
  Settings, FileText, BarChart3, Target, Star, ChevronRight,
  PlayCircle, CreditCard, Bell, Menu, X, User, LogOut,
  Grid3X3, CheckSquare, BarChart, Video, Trophy, Receipt
} from 'lucide-react';

const StudentDashboardLayout = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Grid3X3, path: '/student-dashboard', badge: null },
    { id: 'courses', label: 'My Courses', icon: BookOpen, path: '/student-dashboard/courses', badge: '4' },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare, path: '/student-dashboard/assignments', badge: '3' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, path: '/student-dashboard/attendance', badge: null },
    { id: 'progress', label: 'Results & Progress', icon: BarChart, path: '/student-dashboard/progress', badge: null },
    { id: 'demo', label: 'Demo Classes', icon: Video, path: '/student-dashboard/demo', badge: 'NEW' },
    { id: 'certificates', label: 'Certificates', icon: Trophy, path: '/student-dashboard/certificates', badge: null },
    { id: 'payments', label: 'Payments & Fees', icon: Receipt, path: '/student-dashboard/fees', badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/student-dashboard/settings', badge: null },
  ];

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

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="overlay open"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="dash">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🎓</div>
            <div className="logo-texts">
              <div className="logo-name">MSK Institute</div>
              <div className="logo-sub">LEARNING MANAGEMENT</div>
            </div>
          </div>

          <div className="nav-group">MAIN MENU</div>
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={16} />
                {item.label}
                {item.badge && <span className={item.badge === 'NEW' ? 'nav-new' : 'nav-badge'}>{item.badge}</span>}
              </div>
            );
          })}

          <div className="nav-group">FEATURES</div>
          {navItems.slice(5, 7).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={16} />
                {item.label}
                {item.badge && <span className={item.badge === 'NEW' ? 'nav-new' : 'nav-badge'}>{item.badge}</span>}
              </div>
            );
          })}

          <div className="nav-group">ACCOUNT</div>
          {navItems.slice(7).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={16} />
                {item.label}
                {item.badge && <span className={item.badge === 'NEW' ? 'nav-new' : 'nav-badge'}>{item.badge}</span>}
              </div>
            );
          })}
        </aside>

        {/* Main Content */}
        <div className="main">
          {/* Header */}
          <header className="header">
            <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Menu">
              <Menu size={20} />
            </button>
            <div className="hdr-left">
              <div className="welcome">Welcome back, <em>Sumit Kumar</em> 👋</div>
              <div className="hdr-date">{new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div>
            </div>
            <div className="hdr-actions">
              <div className="icon-btn" title="Notifications">
                <Bell size={16} />
                <div className="notif-dot"></div>
              </div>
              <div className="profile-chip">
                <div className="avatar">SK</div>
                <span className="profile-name">Sumit Kumar</span>
              </div>
              <button className="logout-btn" onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}>
                Logout
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .dash {
          display: flex;
          height: 100vh;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #1A1F2E;
          background: #F0F4F9;
        }

        .sidebar {
          width: 250px;
          flex-shrink: 0;
          background: linear-gradient(175deg, #0D47A1 0%, #0A3580 100%);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          transition: transform .28s cubic-bezier(.4,0,.2,1);
          position: relative;
          z-index: 50;
        }

        .sidebar-logo {
          padding: 22px 22px 16px;
          border-bottom: 1px solid rgba(255,255,255,.1);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .logo-texts .logo-name {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .logo-texts .logo-sub {
          font-size: 10px;
          color: rgba(255,255,255,.5);
          margin-top: 1px;
          letter-spacing: .4px;
        }

        .nav-group {
          padding: 18px 0 4px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,.35);
          letter-spacing: 1px;
          padding-left: 22px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 22px;
          cursor: pointer;
          color: rgba(255,255,255,.65);
          font-size: 13px;
          border-left: 3px solid transparent;
          transition: all .18s;
          position: relative;
          user-select: none;
        }

        .nav-item:hover {
          background: rgba(255,255,255,.07);
          color: rgba(255,255,255,.9);
        }

        .nav-item.active {
          background: rgba(255,255,255,.12);
          color: #fff;
          border-left-color: rgba(255,255,255,.9);
          font-weight: 500;
        }

        .nav-item svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          opacity: .8;
        }

        .nav-item.active svg {
          opacity: 1;
        }

        .nav-badge {
          background: #00ACC1;
          color: #fff;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 10px;
          font-weight: 600;
          margin-left: auto;
        }

        .nav-new {
          background: rgba(0,172,193,.25);
          color: #80DEEA;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 8px;
          margin-left: auto;
          font-weight: 600;
          letter-spacing: .3px;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        .header {
          height: 64px;
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 14px;
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,.07);
        }

        .hamburger {
          display: none;
          cursor: pointer;
          padding: 4px;
          border: none;
          background: none;
          flex-shrink: 0;
        }

        .hdr-left {
          flex: 1;
          min-width: 0;
        }

        .welcome {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1A1F2E;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .welcome em {
          color: #1565C0;
          font-style: normal;
        }

        .hdr-date {
          font-size: 11px;
          color: #8C93A5;
          margin-top: 2px;
        }

        .hdr-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #F5F7FA;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: background .15s;
        }

        .icon-btn:hover {
          background: #E8EDF5;
        }

        .notif-dot {
          width: 8px;
          height: 8px;
          background: #E53935;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          position: absolute;
          top: 5px;
          right: 5px;
        }

        .profile-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F5F7FA;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 4px 12px 4px 5px;
          cursor: pointer;
          transition: background .15s;
        }

        .profile-chip:hover {
          background: #E8EDF5;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1565C0, #00ACC1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
        }

        .avatar.lg {
          width: 56px;
          height: 56px;
          font-size: 20px;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 500;
          color: #1A1F2E;
        }

        .logout-btn {
          background: #FFF0F0;
          color: #C62828;
          border: 1px solid #FFCDD2;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all .15s;
        }

        .logout-btn:hover {
          background: #FFEBEE;
        }

        .content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
          scroll-behavior: smooth;
        }

        .overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          z-index: 40;
          backdrop-filter: blur(2px);
        }

        .overlay.open {
          display: block;
        }

        @media(max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 50;
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .hamburger {
            display: flex;
          }

          .profile-name {
            display: none;
          }

          .logout-btn {
            padding: 7px 10px;
            font-size: 11px;
          }
        }

        @media(max-width: 480px) {
          .header {
            padding: 0 14px;
          }

          .welcome {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default StudentDashboardLayout;