"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import stylePage from "../../Styles/HomePage.module.css";
import style from "../../Styles/Login.module.css";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logo from "../../../public/logo.png"
import Header from '../../shared/Header';

interface FormData {
  otp: string;
  newValue: string;
  confirmValue: string;
}

interface ResetPageProps {
  type: 'password' | 'username';
}

const ResetValue: React.FC<ResetPageProps> = ({ type }) => {
  const options = [
    { label: 'Home', href: '/' },
    { label: 'Accedi', href: '/account/pages/signin' },
    { label: 'Registrati', href: '/account/pages/signup' },
  ];

  const [formData, setFormData] = useState<FormData>({ otp: '', newValue: '', confirmValue: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.newValue !== formData.confirmValue) {
      setError(`${type === 'password' ? 'le password' : 'gli username'} non coincidono.`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/otp/reset-${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: formData.otp,
          [`new${type.charAt(0).toUpperCase() + type.slice(1)}`]: formData.newValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Errore durante la reimpostazione ${type === 'password' ? 'della password' : 'dello username'}`);
      }

      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} reimpostato con successo! Ora puoi effettuare il login.`);
      setTimeout(() => router.push('/account/pages/signin'), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stylePage.homePageContainer}>
      <Image src={logo} alt="Logo" width={150} />
      <h2 className={stylePage.title}>Reimposta {type === 'password' ? 'la tua password' : 'il tuo username'}</h2>
      <p className={stylePage.description}>Inserisci il codice OTP ricevuto via email e {type === 'password' ? 'la tua nuova password' : 'il tuo nuovo username'}.</p>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label htmlFor="otp" className={style.formLabel}>Codice OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            required
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
        <label htmlFor="newValue" className={style.formLabel}>Nuovo {type === 'password' ? 'Password' : 'Username'}</label>
          <input
            type={type === 'password' ? 'password' : 'text'}
            id="newValue"
            name="newValue"
            value={formData.newValue}
            onChange={handleChange}
            required
            className={style.formInput}
            autoComplete={type === 'password' ? 'new-password' : 'off'}
          />
        </div>
        <div className={style.formGroup}>
        <label htmlFor="confirmValue" className={style.formLabel}>Conferma Nuovo {type === 'password' ? 'Password' : 'Username'}</label>
          <input
            type={type === 'password' ? 'password' : 'text'}
            id="confirmValue"
            name="confirmValue"
            value={formData.confirmValue}
            onChange={handleChange}
            required
            className={style.formInput}
            autoComplete={type === 'password' ? 'new-password' : 'off'}
          />
        </div>
        {message && <p className={style.message}>{message}</p>}
        {error && <p className={style.errorMessage}>{error}</p>}
        <button type="submit" className={style.formButton} disabled={loading}>
        {loading ? 'Invio...' : `Reimposta ${type === 'password' ? 'Password' : 'Username'}`}
        </button>
      </form>
      <Header isLoggedIn={false} username='' options={options}/>
    </div>
  );
};

export default ResetValue;