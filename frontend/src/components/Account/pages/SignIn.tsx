"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import logo from "../../../../public/logo.png"
import Image from 'next/image';
import Header from '../../shared/Header';
import Cookies from 'js-cookie';

interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const options = [
    { label: 'Home', href: '/' },
    { label: 'Registrati', href: '/account/pages/signup' },
    { label: 'Esci', href: '/account/pages/logout' },
  ];

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
  
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Troppi tentativi di accesso. Riprova più tardi.');
        }
        
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage || 'Errore durante il login');
      }
  
      const data = await response.json();
      console.log('Login successful:', data);

      // Salva il token nel localStorage
      localStorage.setItem('authToken', data.token);

      // Aggiungi un ritardo per dare tempo ai cookie di essere impostati
      await new Promise(resolve => setTimeout(resolve, 1000));

      // verifica dei cookies
      const allCookies = Cookies.get();
      console.log('All cookies after login:', allCookies);
  
      const authToken = allCookies.authToken || localStorage.getItem('authToken');
      if (!authToken) {
        console.error('AuthToken non trovato nei cookie o nel localStorage');
        throw new Error('Il cookie di autenticazione non è stato impostato correttamente');
      }
  
      console.log('AuthToken found:', authToken);
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
      <Image src={logo} alt="Logo" width={150} />
      <h2 className={stylePage.title}>Effettua l'accesso</h2>
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
            autoComplete="new-password"
          />
        </div>
        {error && <div className={style.errorMessage}>{error}</div>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Submitting...' : 'Accedi'}
        </button>
        <div className={style.errorLinks}>
          <Link href="/account/password/recoverPassword" className={style.errorMessage}>Hai dimenticato la password? Recuperala!</Link>
          <Link href="/account/username/recoverUsername" className={style.errorMessage}>Hai dimenticato lo username? Recuperalo!</Link>
          <Link href="/account/pages/signup" className={style.errorMessage}>Non hai un account? Registrati!</Link>
        </div>
      </form>
      <Header isLoggedIn={false} username='' options={options}/>
    </div>
  );
};

export default SignIn;
