"use client";
import React, { useState, FormEvent } from 'react';
import stylePage from "../../Styles/HomePage.module.css";
import style from "../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';

const Logout: React.FC = () => {
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
	
			console.log("Logout successful.");
			router.push('/'); // Reindirizza alla home page o alla pagina desiderata
		} catch (error: any) {
			setError(error.message);
			console.error("Errore durante il logout", error);
		} finally {
			setLoading(false);
		}
	};
	
  return (
    <div className={stylePage.homePageContainer}>
      <form onSubmit={handleLogout} className={style.form}>
        <h2 className={style.formTitle}>Logout</h2>
        {error && <div className={style.errorMessage}>{error}</div>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </form>
    </div>
  );
};

export default Logout;
