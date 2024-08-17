"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import stylePage from "../../Styles/HomePage.module.css";
import style from "../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  name: string;
  surname: string;
  username: string;
  password: string;
  email: string;
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

    // Validazione delle password e email
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

      router.push(`/?username=${encodeURIComponent(formData.username)}`);
    } catch (error: any) {
      setError(error.message);
      console.error("Errore nella creazione dell'utente", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stylePage.homePageContainer}>
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
        {error && <div className={style.errorMessage}>{error}</div>}
        <button type="submit" className={style.formButton} disabled={loading}>
          {loading ? 'Submitting...' : 'Registrati'}
        </button>
        <div><Link href="/signin" className={style.errorMessage}>Hai già un account? Accedi!</Link></div>
      </form>
    </div>
  );
};

export default SignUp;