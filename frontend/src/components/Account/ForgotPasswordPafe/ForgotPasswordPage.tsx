"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from "../../../../public/logo.png"

interface FormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/otp/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Errore nell\'invio della richiesta');
      }
  
      const data = await response.json();
      setMessage('Controlla la tua email per reimpostare la password.');
      setTimeout(() => {
        router.push(`/account/resetPassword?email=${encodeURIComponent(formData.email)}`);
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stylePage.homePageContainer}>
      <Image src={logo} alt="Logo" width={150} />
      <h2 className={stylePage.title}>Hai dimenticato la tua password?</h2>
      <p className={stylePage.description}>Inserisci l'email con cui ti sei registrato per ricevere un link per reimpostare la password.</p>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label htmlFor="email" className={style.formLabel}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={style.formInput}
          />
        </div>
        {message && <p className={style.message}>{message}</p>}
        {error && <p className={style.errorMessage}>{error}</p>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Invio...' : 'Invia'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
