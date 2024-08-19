"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import stylePage from "../../Styles/HomePage.module.css";
import style from "../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Invia i cookie con la richiesta
      });
  
      if (!response.ok) {
        const responseText = await response.text();
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Errore durante il login');
        } catch (jsonError) {
          throw new Error('Errore durante il login: ' + responseText);
        }
      }
  
      const data = await response.json();
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      console.error("Errore durante il login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stylePage.homePageContainer}>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label htmlFor="username" className={style.formLabel}>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="password" className={style.formLabel}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={style.formInput}
          />
        </div>
        {error && <div className={style.errorMessage}>{error}</div>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Submitting...' : 'Accedi'}
        </button>
        <div>
          <Link href="/signup" className={style.errorMessage}>Non hai un account? Registrati!</Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
