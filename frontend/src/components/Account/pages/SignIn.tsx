"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import stylePage from "../../../Styles/HomePage/Header.module.css";
import style from "../../../Styles/Form.module.css";
import { useRouter } from "next/navigation";
import logo from "../../../../public/logo.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuthentication } from "../../../hooks/useAuthentications";
import InputField from "../../shared/InputFieldProps";
import FormFooter from "../../shared/FormFooter";
import { validateForm } from "../../../utils/validation";
import HeaderBtn from "../../shared/btns/HeaderBtn";

interface FormData {
	username: string;
	password: string;
}

interface SignInErrors {
	[key: string]: string;
}

const SignIn: React.FC = () => {
	const options = [
		{ label: "Home", href: "/", dataid: "home-btn" },
		{
			label: "Registrati",
			href: "/account/pages/signup",
			dataid: "signup-btn",
		},
	];

	const { login } = useAuthentication();

	const [formData, setFormData] = useState<FormData>({
		username: "",
		password: "",
	});
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<SignInErrors>({});
	const [message, setMessage] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const router = useRouter();

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
		setErrors({});
		setMessage(null);

		// Validazione del modulo
		const validationErrors = validateForm(
			formData,
			undefined,
			undefined,
			false
		);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors as SignInErrors);
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				//ATTENZIONE CAMBIARE CON API IN PRODUZIONE
				`http://localhost:5555/users/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
					credentials: "include", // Includi i cookie nella richiesta
				}
			);

			// Gestione della risposta
			if (!response.ok) {
				if (response.status === 429) {
					throw new Error("Troppi tentativi di accesso. Riprova più tardi.");
				}

				let errorMessage;
				try {
					const errorData = await response.json();
					errorMessage = errorData.message;
				} catch (err) {
					errorMessage = await response.text();
				}
				throw new Error(errorMessage || "Errore durante il login");
			}

			const data = await response.json();
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Ritardo per l'esperienza utente

			// Controllo del token di autenticazione
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
			setErrors({ form: error.message });
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className={`${stylePage.headerContainer} ${stylePage.login}`}>
			<div className={style.loginHeader}>
				<Image src={logo} alt="Logo" width={150} />
				<h2 data-id="title" className={stylePage.title}>
					Effettua l&#39;accesso
				</h2>
			</div>
			<form onSubmit={handleSubmit} className={style.formLogin} data-id="signInForm">
				<div className={style.formGroup}>
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
					errors={errors}
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
			<HeaderBtn isLoggedIn={false} username="" options={options} />
		</div>
	);
};

export default SignIn;
