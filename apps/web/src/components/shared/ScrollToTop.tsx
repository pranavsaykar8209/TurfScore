import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll immediately
    window.scrollTo(0, 0);
    
    // Also scroll after a tiny delay to ensure React has painted the new DOM
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
