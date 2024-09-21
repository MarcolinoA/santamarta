"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "../../../hooks/useAuthentications";
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import Header from "../../shared/Header";

const LogoutC: React.FC = () => {
	const options = [
		{ label: "Home", href: "/" },
		{ label: "Accedi", href: "/account/pages/signin" },
		{ label: "Registrati", href: "/account/pages/signup" },
	];

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const { isAuthenticated, username, logout } = useAuthentication();

	const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/logout`,
				{
					method: "POST",
					credentials: "include",
				}
			);

			if (response.ok) {
				logout();
				router.push("/");
			} else {
				console.error("Logout failed");
				setError("Logout failed. Please try again.");
			}
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	if (typeof window === "undefined") {
		return null; // Return null during server-side rendering
	}

	if (!isAuthenticated) {
		return null; // or a loading spinner
	}

	return (
		<div className={stylePage.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<form onSubmit={handleLogout} className={style.form}>
				<h2 className={style.formTitle}>Logout</h2>
				{error && <div className={style.errorMessage}>{error}</div>}
				<button type="submit" className={style.formButton} disabled={loading}>
					{loading ? "Logging out..." : "Logout"}
				</button>
			</form>
			<Header
				isLoggedIn={isAuthenticated}
				username={username || ""}
				options={options}
			/>
		</div>
	);
};

export default LogoutC;
