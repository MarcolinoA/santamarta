"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import stylePage from "../../Styles/HomePage.module.css";
import style from "../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

interface FormData {
  name: string;
  surname: string;
  username: string;
  password: string;
  email: string;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string, options: { sitekey: string, callback: (token: string) => void }) => void;
    };
  }
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    username: '',
    password: '',
    email: ''
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== confirmPassword) {
        setError('Le password non corrispondono');
        setLoading(false);
        return;
    }

    if (formData.email !== confirmEmail) {
        setError('Le email non corrispondono');
        setLoading(false);
        return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA');
      setLoading(false);
      return;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Errore nella creazione dell'utente");
        }

        router.push(`/signin`);
    } catch (error: any) {
        setError(error.message);
        console.error("Errore nella creazione dell'utente", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.render('recaptcha-container', {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            callback: (token: string) => {
              setCaptchaToken(token);
            }
          });
        });
      } else {
        console.error("reCAPTCHA non è stato caricato correttamente.");
      }
    };

    loadRecaptcha();
  }, []);

  return (
    <div className={stylePage.homePageContainer}>
      <Script
        src="https://www.google.com/recaptcha/enterprise.js?render=explicit"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("reCAPTCHA script loaded");
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
              window.grecaptcha.render('recaptcha-container', {
                sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
                callback: (token: string) => {
                  setCaptchaToken(token);
                }
              });
            });
          } else {
            console.error("reCAPTCHA non è stato caricato correttamente.");
          }
        }}
      />
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label htmlFor="name" className={style.formLabel}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="surname" className={style.formLabel}>Surname</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className={style.formInput}
          />
        </div>
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
        <div className={style.formGroup}>
          <label htmlFor="confirmPassword" className={style.formLabel}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className={style.formInput}
          />
        </div>
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
        <div className={style.formGroup}>
          <label htmlFor="confirmEmail" className={style.formLabel}>Confirm Email</label>
          <input
            type="email"
            id="confirmEmail"
            name="confirmEmail"
            value={confirmEmail}
            onChange={handleConfirmEmailChange}
            required
            className={style.formInput}
          />
        </div>
        <div className={style.captchaContainer}>
          <label className={style.captchaLabel}>Please verify that you're not a robot:</label>
          <div id="recaptcha-container"></div> {/* Container per il reCAPTCHA */}
        </div>
        {error && <div className={style.captchaError}>{error}</div>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Submitting...' : 'Registrati'}
        </button>
        <div><Link href="/signin" className={style.errorMessage}>Hai già un account? Accedi!</Link></div>
      </form>
    </div>
  );
};

export default SignUp;
