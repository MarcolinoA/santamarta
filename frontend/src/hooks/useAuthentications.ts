import { useState, useEffect } from 'react';
import { getCookie, logAllCookies } from '../utils/cookieUtils';

export function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = getCookie('authToken') || localStorage.getItem('authToken');
      const storedUsername = getCookie('username');
      
      console.log('Checking auth:', { authToken, storedUsername });
      logAllCookies();

      if (authToken) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
      } else {
        setIsAuthenticated(false);
        setUsername(null);
        localStorage.removeItem('authToken');
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  return { isAuthenticated, username };
}