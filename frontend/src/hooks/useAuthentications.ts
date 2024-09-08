import { useState, useEffect } from 'react';
import { getCookie } from '../utils/cookieUtils';

export function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = getCookie('authToken');
      setIsAuthenticated(!!authToken);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return isAuthenticated;
}