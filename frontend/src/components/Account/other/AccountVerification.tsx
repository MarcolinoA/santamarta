"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logo from "../../../../public/logo.png"
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import Image from 'next/image';

const AccountVerification: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/get-email`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setEmail(data.email);
        } else {
          setMessage('Errore: email non trovata. Per favore, registrati di nuovo.');
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'email:', error);
        setMessage('Si è verificato un errore. Per favore, riprova più tardi.');
      }
    };

    fetchEmail();
  }, []);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Errore: email non trovata. Per favore, registrati di nuovo.');
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      if (response.ok) {
        setMessage('Email di verifica reinviata con successo. Controlla la tua casella di posta.');
      } else {
        setMessage('Si è verificato un errore. Per favore, riprova più tardi.');
      }
    } catch (error) {
      console.error('Errore durante il reinvio dell\'email di verifica:', error);
      setMessage('Si è verificato un errore. Per favore, riprova più tardi.');
    }
  };

  return (
    <div className={stylePage.homePageContainer}>
      <form className={style.form}>
        <Image src={logo} alt="Logo" width={150} />
        <h2 className={style.formTitle}>Controlla il tuo indirizzo di posta elettronica</h2>
        <p className={style.desc}>Abbiamo inviato un'email di conferma all'account che hai usato per iscriverti, segui le istruzioni indicate nell'email!</p>
        <div 
          className={style.errorMessage} 
          onClick={handleResendVerification}
          style={{ cursor: 'pointer' }}
        >
          Non hai ricevuto l'email? Richiedine una nuova premendo QUI e controlla la tua casella di posta!
        </div>
        {message && <p className={style.message}>{message}</p>}
      </form>
    </div>
  );
};

export default AccountVerification;