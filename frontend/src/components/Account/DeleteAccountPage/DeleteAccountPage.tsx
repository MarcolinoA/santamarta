"use client";
import React, { useState } from 'react';
import logo from "../../../../public/logo.png"
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DeleteAccountPage: React.FC = () => {
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
      <Image src={logo} alt="Logo" width={150} />
      <h2 className={style.formTitle}>Elimina il tuo account</h2>
      {error && <div className={style.errorMessage}>{error}</div>}
      <form className={style.form} onSubmit={(e) => e.preventDefault()}>
        <button
          type="button"
          className={style.formButton}
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "Eliminazione in corso" : "Elimina l'account"}
        </button>
      </form>
    </div>
  );
};

export default DeleteAccountPage;
