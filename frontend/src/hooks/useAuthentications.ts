import { useState, useEffect, useCallback } from "react";
import { getCookie, deleteCookie } from "../utils/cookieUtils";

export function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userPriority, setUserPriority] = useState<boolean>(false);

  const checkAuth = useCallback(async () => {
    // Recupero i cookie
    const authToken = getCookie("authToken");
    const storedUsername = getCookie("username");

    // Verifica se i cookie di autenticazione sono presenti
    if (authToken && storedUsername) {
      try {
        const response = await fetch(
          //ATTENZIONE CAMBIARE CON API IN PRODUZIONE
          `http://localhost:5555/users/verify-token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json", // Impostazione del tipo di contenuto
            },
            credentials: "include", // Include i cookie
          }
        );

        // Controllo della risposta
        if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setUsername(storedUsername);
          setUserPriority(userData.priority || false);
        } else {
          console.warn("Token non valido o scaduto, effettuando logout.");
          logout();
        }
      } catch (error) {
        console.error("Errore durante la verifica del token:", error);
        logout();
      }
    } else {
      // Se non ci sono cookie di autenticazione, l'utente non è autenticato
      setIsAuthenticated(false);
      setUsername(null);
      setUserPriority(false);
    }
  }, []); // Empty dependency array ensures checkAuth is memoized

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 60000); // Verifica ogni minuto
    return () => clearInterval(interval);
  }, [checkAuth]); // Now checkAuth is a stable dependency

  const login = (token: string, user: string) => {
    document.cookie = `authToken=${token}; path=/; max-age=86400; samesite=lax`;
    document.cookie = `username=${user}; path=/; max-age=86400; samesite=lax`;
    setIsAuthenticated(true);
    setUsername(user);
    setUserPriority(false);
  };

  const logout = () => {
    deleteCookie("authToken");
    deleteCookie("username");
    setIsAuthenticated(false);
    setUsername(null);
    setUserPriority(false);
  };

  return { isAuthenticated, username, login, logout, userPriority, checkAuth };
}
