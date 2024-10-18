import { useState, useEffect, useCallback } from "react";
import { getCookie, deleteCookie } from "../utils/cookieUtils";

export function useAuthentication() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [username, setUsername] = useState<string | null>(null);
	const [userPriority, setUserPriority] = useState<boolean>(false);

	const checkAuth = useCallback(async () => {
		const authToken = getCookie("authToken");
		const storedUsername = getCookie("username");

		if (authToken && storedUsername) {
			try {
				const response = await fetch(
					`https://santamarta-backend.onrender.com/users/verify-token`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
						credentials: "include",
					}
				);

				if (response.ok) {
					const userData = await response.json();
					setIsAuthenticated(true);
					setUsername(storedUsername);
					setUserPriority(userData.priority || false);
				} else {
					logout();
				}
			} catch (error) {
				console.error("Error verifying token:", error);
				logout();
			}
		} else {
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