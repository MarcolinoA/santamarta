"use client";
import React, { useState, FormEvent } from 'react';
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from "../../../../public/logo.png"
import Header from '../../shared/Header';

const LogoutC: React.FC = () => {
	const options = [
    { label: 'Home', href: '/' },
    { label: 'Accedi', href: '/account/pages/signin' },
    { label: 'Registrati', href: '/account/pages/signup' },
  ];
	
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

	const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
	
		try {
			console.log("Attempting to logout...");
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
				method: 'POST',
				credentials: 'include', // Include i cookie nella richiesta
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Errore durante il logout');
			}
    // Rimuovi il token dal localStorage
    localStorage.removeItem('authToken');

    // Rimuovi i cookie manualmente
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Forza un aggiornamento dello stato di autenticazione
    window.dispatchEvent(new Event('storage'));

    // Reindirizza alla home page
    window.location.href = '/';
		} catch (error: any) {
			setError(error.message);
			console.error("Errore durante il logout", error);
		} finally {
			setLoading(false);
		}
	};
	
  return (
    <div className={stylePage.homePageContainer}>
      <Image src={logo} alt="Logo" width={150} />
      <form onSubmit={handleLogout} className={style.form}>
        <h2 className={style.formTitle}>Logout</h2>
        {error && <div className={style.errorMessage}>{error}</div>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </form>
			<Header isLoggedIn={false} username='' options={options}/>
    </div>
  );
};

export default LogoutC;
