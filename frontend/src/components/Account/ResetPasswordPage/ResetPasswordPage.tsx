"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logo from "../../../../public/logo.png"

interface FormData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ otp: '', newPassword: '', confirmPassword: '' });
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

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Le password non coincidono.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/otp/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante la reimpostazione della password');
      }

      setMessage('Password reimpostata con successo! Ora puoi effettuare il login.');
      setTimeout(() => router.push('/account/signin'), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stylePage.homePageContainer}>
      <Image src={logo} alt="Logo" width={150} />
      <h2 className={stylePage.title}>Reimposta la tua password</h2>
      <p className={stylePage.description}>Inserisci il codice OTP ricevuto via email e la tua nuova password.</p>
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
          <label htmlFor="newPassword" className={style.formLabel}>Nuova Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className={style.formInput}
            autoComplete="new-password"
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="confirmPassword" className={style.formLabel}>Conferma Nuova Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={style.formInput}
            autoComplete="new-password"
          />
        </div>
        {message && <p className={style.message}>{message}</p>}
        {error && <p className={style.errorMessage}>{error}</p>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Invio...' : 'Reimposta Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;