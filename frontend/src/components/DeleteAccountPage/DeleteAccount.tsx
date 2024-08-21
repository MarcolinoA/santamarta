"use client";
import React, { useState } from 'react';
import stylePage from "../../Styles/HomePage.module.css";
import style from "../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';

const DeleteAccount: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/deleteAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante la cancellazione dell\'account');
      }

      router.push(`/`); 
    } catch (error: any) {
      setError(error.message);
      console.error("Errore durante la cancellazione dell'account", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stylePage.homePageContainer}>
      {error && <div className={style.errorMessage}>{error}</div>}
      <button 
        className={style.formButton} 
        onClick={handleDeleteAccount} 
        disabled={loading}
      >
        {loading ? 'Deleting Account...' : 'Delete Account'}
      </button>
    </div>
  );
};

export default DeleteAccount;
