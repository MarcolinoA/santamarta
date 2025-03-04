"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import InputField from "../../shared/InputFieldProps";
import { validateForm } from "../../../utils/validation";
import FormFooter from "../../shared/FormFooter";
import logo from "../../../../public/logo.png";
import Image from "next/image";
import stylesHeader from "../../../Styles/HomePage/Header.module.css";
import stylesForm from "../../../Styles/Form.module.css";
import Navbar from "../../shared/Navbar";
import AccessDenied from "../../shared/AccessDenied";
import { useAuthentication } from "../../../hooks/useAuthentications";

interface FormData {
  name: string;
  surname: string;
  username: string;
  password: string;
  email: string;
}

const SignUp: React.FC = () => {
  const { isAuthenticated } = useAuthentication();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    username: "",
    password: "",
    email: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmEmail(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const validationErrors = validateForm(formData, confirmPassword, confirmEmail, true);
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      setMessage(firstError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const responseText = await response.text();
        setMessage(responseText);
        throw new Error(responseText);
      }

      setMessage("Verifica la tua email per completare la registrazione.");
      router.push(`/account/other/accountVerification`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={stylesHeader.headerContainer}>
        <div className={stylesHeader.registerHeader}>
          <Image className={stylesForm.logo} src={logo} alt="Logo" width={150} />
          <h2 data-id="title" className={stylesHeader.title}>
            Compila i campi per registrarti
          </h2>
        </div>
        <form onSubmit={handleSubmit} className={stylesForm.form}>
          <div className={stylesForm.formContainer}>
            <InputField
              id="name"
              dataid="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              label="Name"
              required
            />
            <InputField
              id="surname"
              dataid="surname"
              name="surname"
              type="text"
              value={formData.surname}
              onChange={handleChange}
              label="Surname"
              required
            />
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
            <InputField
              id="confirmPassword"
              dataid="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              label="Confirm Password"
              required
              showPasswordToggle
              showPassword={showConfirmPassword}
              togglePasswordVisibility={toggleConfirmPasswordVisibility}
            />
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
            <InputField
              id="confirmEmail"
              dataid="confirmEmail"
              name="confirmEmail"
              type="email"
              value={confirmEmail}
              onChange={handleConfirmEmailChange}
              label="Confirm Email"
              required
            />
          </div>
          <FormFooter
            message={message}
            loading={loading}
            btnDataId="submit-btn"
            btnLoadingText="Registrazione in corso..."
            btnText="Registrati"
            hrefLink="/account/pages/signin"
            linkText="Hai già un account? Accedi!"
          />
        </form>
      </div>
    </>
  );
};

export default SignUp;
