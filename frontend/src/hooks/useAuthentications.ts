import { useState, useEffect } from 'react';
import { getCookie, deleteCookie } from '../utils/cookieUtils';

export function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = async () => {
    const authToken = getCookie('authToken');
    const storedUsername = getCookie('username');
    
    if (authToken && storedUsername) {
      try {
        // Verifica la validità del token con il server
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          setIsAuthenticated(true);
          setUsername(storedUsername);
        } else {
          // Se il token non è valido, effettua il logout
          logout();
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 60000); // Verifica ogni minuto
    return () => clearInterval(interval);
  }, []);

  const login = (token: string, user: string) => {
    document.cookie = `authToken=${token}; path=/; max-age=86400; samesite=lax`;
    document.cookie = `username=${user}; path=/; max-age=86400; samesite=lax`;
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    deleteCookie('authToken');
    deleteCookie('username');
    setIsAuthenticated(false);
    setUsername(null);
  };

  return { isAuthenticated, username, login, logout, checkAuth };
}