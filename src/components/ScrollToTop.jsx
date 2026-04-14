import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small timeout to allow page layout to stabilize if needed
    const t = setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
