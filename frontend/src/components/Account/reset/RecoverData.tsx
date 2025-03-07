"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import InputField from "../../shared/InputFieldProps";
import FormFooter from "../../shared/FormFooter";
import stylesHeader from "../../../Styles/HomePage/Header.module.css";
import stylesForm from "../../../Styles/Form.module.css";
import Navbar from "../../shared/Navbar";

interface FormData {
  email: string;
}

interface RecoverDataProps {
  alertMessage?: string;
  pushLink?: string;
  title?: string;
  description?: string;
  type?: string;
}

const RecoverData: React.FC<RecoverDataProps> = ({
  alertMessage = "la tua password",
  pushLink = "resetPassword",
  title = "Recupera Password",
  description = "la tua password",
  type = "type",
}) => {
  const options = [
    { label: "Home", href: "/", dataid: "home-btn" },
    { label: "Accedi", href: "/account/pages/signin", dataid: "signin-btn" },
    {
      label: "Registrati",
      href: "/account/pages/signup",
      dataid: "signup-btn",
    },
  ];

  const [formData, setFormData] = useState<FormData>({ email: "" });
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
      // Invio della richiesta al server
      const response = await fetch(`/api/otp/forgot-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type }),
        credentials: "include", // Include cookies se necessario
      });

      // Controllo della risposta
      if (!response.ok) {
        // Gestione dell'errore con messaggio dal server
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Errore ${response.status}: ${response.statusText}`
        );
      }

      // Messaggio di successo per l'utente
      setMessage(
        `Controlla la tua email per reimpostare ${type === "password" ? "la tua password" : "il tuo username"}`
      );

      // Navigazione dopo un breve ritardo
      setTimeout(() => {
        router.push(
          `/account/${type}/${pushLink}?email=${encodeURIComponent(formData.email)}`
        ); // resetPassword
      }, 3000);
    } catch (error: any) {
      // Gestione dell'errore generale
      console.error("Errore durante l'invio dell'email di recupero:", error);
      setError("Invio dell'email di recupero non riuscito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={stylesHeader.headerContainer}>
        <Image src={logo} alt="Logo" width={150} className={stylesForm.logo}/>
        <h2 data-id="rd-title" className={stylesForm.accessDeniedTitle}>
          {title}
        </h2>
        <p data-id="rd-desc" className={stylesForm.accessDeniedDesc}>
          Inserisci l&#39;email con cui ti sei registrato per ricevere un link
          per reimpostare {description}
        </p>
        <form
          data-id="rd-form"
          onSubmit={handleSubmit}
          className={stylesForm.formLogin}
        >
          <div className={stylesForm.formContainer}>
            <InputField
              id="email"
              dataid="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              label="Email"
              required
            />
          </div>
          <FormFooter
            message={message}
            loading={loading}
            btnDataId="rd-btn"
            btnLoadingText="Invio..."
            btnText="Invia"
            hrefLink="/"
            linkText="Torna alla home"
            hrefLink2=""
            linkText2=""
            hrefLink3=""
            linkText3=""
          />
        </form>
      </div>
    </>
  );
};

export default RecoverData;
