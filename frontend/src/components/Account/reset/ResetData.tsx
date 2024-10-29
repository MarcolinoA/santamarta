"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import InputField from "../../shared/InputFieldProps";
import FormFooter from "../../shared/FormFooter";
import HeaderBtn from "../../shared/btns/HeaderBtn";
import stylesHeader from "../../../Styles/HomePage/Header.module.css";
import stylesForm from "../../../Styles/Form.module.css";

interface FormData {
  otp: string;
  newValue: string;
  confirmValue: string;
}

interface ResetPageProps {
  type: "password" | "username";
}

const ResetData: React.FC<ResetPageProps> = ({ type }) => {
  const options = [
    { label: "Home", href: "/", dataid: "home-btn" },
    { label: "Accedi", href: "/account/pages/signin", dataid: "signin-btn" },
    {
      label: "Registrati",
      href: "/account/pages/signup",
      dataid: "signup-btn",
    },
  ];

  const [formData, setFormData] = useState<FormData>({
    otp: "",
    newValue: "",
    confirmValue: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Stato per la visibilità della password
  const [email, setEmail] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    setEmail(emailParam || "");
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Controllo se i nuovi valori coincidono
    if (formData.newValue !== formData.confirmValue) {
      setError(
        `${type === "password" ? "Le password" : "Gli username"} non coincidono.`
      );
      setLoading(false);
      return;
    }

    try {
      // Invio della richiesta di reimpostazione
      const response = await fetch(
        `/api/otp/reset-${type}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: formData.otp,
            [`new${type.charAt(0).toUpperCase() + type.slice(1)}`]:
              formData.newValue,
          }),
          credentials: "include", // Include i cookie se necessario
        }
      );

      // Controllo della risposta
      if (!response.ok) {
        const errorData = await response.json(); // Tentativo di recuperare il messaggio di errore dal server
        throw new Error(
          errorData.message ||
            `Errore durante la reimpostazione ${type === "password" ? "della password" : "dello username"}.`
        );
      }

      // Messaggio di successo per l'utente
      setMessage(
        `${type.charAt(0).toUpperCase() + type.slice(1)} reimpostato con successo! Ora puoi effettuare il login.`
      );

      // Navigazione dopo un breve ritardo
      setTimeout(() => router.push("/account/pages/signin"), 3000);
    } catch (error: any) {
      // Gestione degli errori
      console.error("Errore durante la reimpostazione:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={stylesHeader.headerContainer}>
      <Image src={logo} alt="Logo" width={150} />
      <h2 data-id="rv-title" className={stylesHeader.title}>
        Reimposta {type === "password" ? "la tua password" : "il tuo username"}
      </h2>
      <p data-id="rv-desc" className={stylesHeader.description}>
        Inserisci il codice OTP ricevuto via email e
        {type === "password"
          ? " la tua nuova password"
          : " il tuo nuovo username"}
        .
      </p>
      <form data-id="rv-form" onSubmit={handleSubmit} className={stylesForm.form}>
        <InputField
          id="otp"
          dataid="otp"
          name="otp"
          type="text"
          value={formData.otp}
          onChange={handleChange}
          label="Codice OTP"
          required
        />

        <InputField
          id="newValue"
          dataid="newValue"
          name="newValue"
          type={type === "password" ? "password" : "text"}
          value={formData.newValue}
          onChange={handleChange}
          label={`Nuovo ${type === "password" ? "Password" : "Username"}`}
          required
          showPasswordToggle={type === "password"}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <InputField
          id="confirmValue"
          dataid="confirmValue"
          name="confirmValue"
          type={type === "password" ? "password" : "text"}
          value={formData.confirmValue}
          onChange={handleChange}
          label={`Conferma Nuovo ${type === "password" ? "Password" : "Username"}`}
          required
          showPasswordToggle={type === "password"}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <FormFooter
          message={message}
          loading={loading}
          btnDataId="rv-btn"
          btnLoadingText="Invio..."
          btnText={`Reimposta ${type === "password" ? "Password" : "Username"}`}
          hrefLink="/"
          linkText="Torna alla Home"
          hrefLink2=""
          linkText2=""
          hrefLink3=""
          linkText3=""
        />
      </form>
      <HeaderBtn isLoggedIn={false} username="" options={options} />
    </div>
  );
};

export default ResetData;
