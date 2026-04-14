// src/routes.jsx
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import CourseList from './pages/Course/CourseList.jsx';
import LiveCourses from './pages/Course/LiveCourses.jsx';
import LiveCourseDetails from './pages/Course/LiveCourseDetailsNew.jsx';
import LiveCourseEnroll from './pages/Course/LiveCourseEnroll.jsx';
import PhonePeCheckout from './pages/Course/PhonePeCheckout.jsx';
import PaymentCallback from './pages/Course/PaymentCallback.jsx';
import CourseDetail from './pages/Course/CourseDetail.jsx';
import CourseForm from './components/forms/CourseForm.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { Navigate } from 'react-router-dom';
import Profile from './pages/auth/Profile.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import TeacherDashboard from './pages/dashboard/TeacherDashboard.jsx';
import StudentDashboard from './pages/dashboard/StudentDashboard.jsx';
import StudentDashboardLayout from './pages/dashboard/StudentDashboardLayout.jsx';
import StudentCourses from './pages/dashboard/StudentCourses.jsx';
import StudentFees from './pages/dashboard/StudentFees.jsx';
import StudentRequests from './pages/dashboard/StudentRequests.jsx';
import UserManagement from './components/admin/UserManagement.jsx';
import Reports from './components/admin/Reports.jsx';
import CourseManagement from './components/admin/CourseManagement.jsx';
import Notes from './pages/Notes.jsx';
import Projects from './pages/projects/Projects.jsx';
import ProjectDetail from './pages/projects/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import CertificateVerification from './pages/CertificateVerification.jsx';
import AffiliateProgram from './pages/Affiliate/AffiliateProgram.jsx';
import Terms from './pages/Terms.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import RefundPolicy from './pages/RefundPolicy.jsx';

// New Affiliate Dashboard Components
import AffiliateDashboardLayout from './pages/Affiliate/AffiliateDashboardLayout.jsx';
import AffiliateDashboardHome from './pages/Affiliate/AffiliateDashboard.jsx';
import AffiliateReferrals from './pages/Affiliate/AffiliateReferrals.jsx';
import AffiliateEarnings from './pages/Affiliate/AffiliateEarnings.jsx';
import AffiliateCoupons from './pages/Affiliate/AffiliateCoupons.jsx';
import AffiliateProfile from './pages/Affiliate/AffiliateProfile.jsx';
import AffiliateSettings from './pages/Affiliate/AffiliateSettings.jsx';
import AffiliateWallet from './pages/Affiliate/AffiliateWallet.jsx';

// -----------------------------
// Public Routes
// -----------------------------
export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/verify-certificate", element: <CertificateVerification /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/terms", element: <Terms /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/refund-policy", element: <RefundPolicy /> },
  { path: "/notes", element: <Notes /> },
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectDetail /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/courses", element: <CourseList /> },
  { path: "/live-courses", element: <LiveCourses /> },
  { path: "/live-courses/:id", element: <LiveCourseDetails /> },
  { path: "/live-courses/:id/checkout", element: <PhonePeCheckout /> },
  { path: "/live-courses/:id/payment-success", element: <PaymentCallback /> },
  { path: "/courses/:slug", element: <CourseDetail /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:uidb64/:token", element: <ResetPassword />},
  { path: "/affiliate-program", element: <AffiliateProgram /> }
];

// -----------------------------
// Private / Authenticated Routes
// -----------------------------
export const privateRoutes = [
  { path: "/profile", element: <PrivateRoute allowedRoles={["admin", "teacher", "student"]}><Profile /></PrivateRoute> },

  // Admin Routes
  { path: "/admin-dashboard", element: <PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute> },
  { path: "/admin/users", element: <PrivateRoute allowedRoles={["admin"]}><UserManagement /></PrivateRoute> },
  { path: "/admin/courses", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseManagement /></PrivateRoute> },

  // Standardize course management URLs
  { path: "/admin/courses/create", element: <PrivateRoute allowedRoles={["admin","teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/admin/courses/:slug/edit", element: <PrivateRoute allowedRoles={["admin","teacher"]}><CourseForm /></PrivateRoute> },
  
  { path: "/admin/reports", element: <PrivateRoute allowedRoles={["admin"]}><Reports /></PrivateRoute> },

  // Teacher Routes
  { path: "/teacher-dashboard", element: <PrivateRoute allowedRoles={["teacher"]}><TeacherDashboard /></PrivateRoute> },

  // Student Routes
  { 
    path: "/student-dashboard", 
    element: <PrivateRoute allowedRoles={["student"]}><StudentDashboardLayout /></PrivateRoute>,
    children: [
      { path: "", element: <StudentDashboard /> },
      { path: "courses", element: <StudentCourses /> },
      { path: "assignments", element: <StudentDashboard /> },
      { path: "attendance", element: <StudentDashboard /> },
      { path: "progress", element: <StudentDashboard /> },
      { path: "demo", element: <StudentDashboard /> },
      { path: "certificates", element: <StudentDashboard /> },
      { path: "settings", element: <StudentDashboard /> },
      { path: "fees", element: <StudentFees /> },
      { path: "requests", element: <StudentRequests /> }
    ]
  },
  { path: "/live-courses/:id/enroll", element: <PrivateRoute allowedRoles={["student"]}><LiveCourseEnroll /></PrivateRoute> },
  // Redirect legacy /affiliate route to the new nested affiliate dashboard
  { path: "/affiliate", element: <PrivateRoute allowedRoles={["student","teacher","admin"]}><Navigate to="/affiliate-dashboard" replace /></PrivateRoute> },
  
  // Affiliate Dashboard Routes
  { 
    path: "/affiliate-dashboard", 
    element: <PrivateRoute allowedRoles={["student","teacher","admin"]}><AffiliateDashboardLayout /></PrivateRoute>,
    children: [
      { path: "", element: <AffiliateDashboardHome /> },
      { path: "earnings", element: <AffiliateEarnings /> },
      { path: "wallet", element: <AffiliateWallet /> },
      { path: "referrals", element: <AffiliateReferrals /> },
      { path: "coupons", element: <AffiliateCoupons /> },
      { path: "profile", element: <AffiliateProfile /> },
      { path: "settings", element: <AffiliateSettings /> }
    ]
  },

  // Courses management for Teacher/Admin (alternate routes)
  { path: "/courses/add", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/courses/:slug/edit", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
];

// -----------------------------
// Fallback 404 Route
// -----------------------------
export const fallbackRoute = [
  { path: "*", element: <NotFound /> }
];

// -----------------------------
// Combined Routes
// -----------------------------
export const routes = [...publicRoutes, ...privateRoutes, ...fallbackRoute];
