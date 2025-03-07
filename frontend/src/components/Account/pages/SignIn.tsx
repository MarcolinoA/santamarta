"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuthentication } from "../../../hooks/useAuthentications";
import InputField from "../../shared/InputFieldProps";
import FormFooter from "../../shared/FormFooter";
import logo from "../../../../public/logo.png";
import stylesHeader from "../../../Styles/HomePage/Header.module.css";
import stylesForm from "../../../Styles/Form.module.css";
import Navbar from "../../shared/Navbar";
import AccessDenied from "../../shared/AccessDenied";

interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { login, isAuthenticated } = useAuthentication();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return <AccessDenied />;
  }

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
    setMessage(null);

    try {
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorMessage =
          response.status === 429
            ? "Troppi tentativi di accesso. Riprova più tardi."
            : await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const authToken =
        Cookies.get("authToken") || localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error(
          "Il cookie di autenticazione non è stato impostato correttamente"
        );
      }

      if (data.username) {
        login(authToken, data.username);
        router.push("/");
      } else {
        throw new Error("Token non ricevuto dal server");
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={`${stylesHeader.headerContainer}`}>
        <div className={stylesForm.loginHeader}>
          <Image src={logo} alt="Logo" width={150} className={stylesForm.logo} />
          <h2 data-id="title" className={stylesHeader.title}>
            Effettua l&#39;accesso
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className={stylesForm.formLogin}
          data-id="signInForm"
        >
          <div className={stylesForm.formContainer}>
            <InputField
              id="username"
              dataid="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              label="Username"
              required
            />
            <InputField
              id="password"
              dataid="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
              required
              showPasswordToggle
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          </div>
          <FormFooter
            message={message}
            loading={loading}
            btnDataId="submit-btn"
            btnLoadingText="Accesso in corso..."
            btnText="Accedi"
            hrefLink="/"
            linkText="Torna alla Home"
            hrefLink2="/account/password/recoverPassword"
            linkText2="Hai dimenticato la password? Recuperala!"
            hrefLink3="/account/username/recoverUsername"
            linkText3="Hai dimenticato lo username? Recuperalo!"
          />
        </form>
      </div>
    </>
  );
};

export default SignIn;
