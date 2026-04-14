// src/App.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { routes } from './routes';
import affiliateApi from './api/affiliateApi';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const App = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle initial referral URL on first mount (catch ?ref= from landing)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref') || params.get('sponsor') || params.get('affiliate');
    
    if (!ref) return; // no referral, skip
    
    console.log('[App Initial Load] Detected referral ref:', ref, 'at path:', location.pathname);

    try {
      // Persist ref (new ref overrides old from previous visit)
      const existing = localStorage.getItem('affiliate_ref');
      if (existing !== ref) {
        localStorage.setItem('affiliate_ref', ref);
        localStorage.setItem('affiliate_first_seen', Date.now().toString());
        console.log('[App Initial Load] Stored new affiliate_ref:', ref);
      }

      // Generate or retrieve visitor_id
      let visitorId = localStorage.getItem('affiliate_visitor_id');
      if (!visitorId) {
        visitorId = (crypto && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem('affiliate_visitor_id', visitorId);
        console.log('[App Initial Load] Generated visitor_id:', visitorId);
      }

      // Track visit (once per ref per device)
      const trackedRaw = localStorage.getItem('affiliate_tracked_refs');
      const tracked = trackedRaw ? JSON.parse(trackedRaw) : [];
      
      if (!tracked.includes(ref)) {
        console.log('[App Initial Load] Calling trackVisit for ref:', ref);
        affiliateApi.trackVisit({ ref, visitor_id: visitorId, path: location.pathname });
        tracked.push(ref);
        localStorage.setItem('affiliate_tracked_refs', JSON.stringify(tracked));
      } else {
        console.log('[App Initial Load] Ref already tracked:', ref);
      }

      // Redirect to register if not already there (improve conversions)
      if (location.pathname !== '/register') {
        console.log('[App Initial Load] Redirecting to /register?ref=' + ref);
        navigate(`/register?ref=${encodeURIComponent(ref)}`, { replace: true });
      }
    } catch (err) {
      console.error('[App Initial Load] Error:', err);
    }
  }, []); // Empty deps: run only once on mount

  // Public paths
  const publicRegex = [
    /^\/login$/,
    /^\/register$/,
    /^\/about$/,
    /^\/contact$/,
    /^\/terms$/,
    /^\/privacy-policy$/,
    /^\/refund-policy$/,
    /^\/notes$/,
    /^\/projects(\/.*)?$/,
    /^\/courses(\/.*)?$/,
    /^\/live-courses(\/.*)?$/,
    /^\/forgot-password$/,
    /^\/reset-password(\/.*)?$/,
    /^\/verify-certificate$/,
    /^\/affiliate-program$/,
  ];

  const isPublic = publicRegex.some((regex) => regex.test(location.pathname));

  // Check if current route is the affiliate dashboard (it provides its own header/footer)
  const isAffiliateDashboard = /^\/affiliate-dashboard(\/.*)?$/.test(location.pathname);


  // Auth-based redirection (after referral handling has a chance to run)
  useEffect(() => {
    if (loading) return;

    // If the URL contains a referral param, allow the page to load (we want to process it)
    const params = new URLSearchParams(location.search);
    const hasRef = !!(params.get('ref') || params.get('sponsor') || params.get('affiliate'));

    if (!isAuthenticated && !isPublic && !hasRef) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, location.pathname, location.search, navigate, user, isPublic]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header - hidden on affiliate dashboard because the affiliate layout includes a header */}
      {!isAffiliateDashboard && <Header />}

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          {routes.map(({ path, element, children }) => (
            <Route key={path} path={path} element={element}>
              {children && children.map(({ path: childPath, element: childElement }) => (
                <Route key={childPath} path={childPath} element={childElement} />
              ))}
            </Route>
          ))}
        </Routes>
      </div>

      {/* Footer - hidden on affiliate dashboard */}
      {!isAffiliateDashboard && <Footer />}

      {/* Notifications */}
      <Toaster
        position={isMobile ? 'top-center' : 'bottom-right'}
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { fontSize: '0.9rem' },
        }}
      />
    </div>
  );
};

export default App;
