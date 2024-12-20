"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import InputField from "../../shared/InputFieldProps";
import { validateForm } from "../../../utils/validation";
import FormFooter from "../../shared/FormFooter";
import HeaderBtn from "../../shared/btns/HeaderBtn";
import logo from "../../../../public/logo.png";
import Image from "next/image";
import stylesHeader from "../../../Styles/HomePage/Header.module.css";
import stylesForm from "../../../Styles/Form.module.css";

interface FormData {
	name: string;
	surname: string;
	username: string;
	password: string;
	email: string;
}

interface FormErrors {
	[key: string]: string;
}

const SignUp: React.FC = () => {
	const options = [
		{ label: "Home", href: "/", dataid: "home-btn" },
		{ label: "Accedi", href: "/account/pages/signin", dataid: "signin-btn" },
	];

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
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);

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

		// Validazione dei dati del modulo
		const validationErrors = validateForm(
			formData,
			confirmPassword,
			confirmEmail,
			true
		);
		if (Object.keys(validationErrors).length > 0) {
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`/api/users/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
				credentials: "include", // Importante per inviare e ricevere cookie
			});

			// Gestione della risposta
			if (!response.ok) {
				console.error("Status Code:", response.status);
				const responseText = await response.text();
				console.error("Risposta del server:", responseText);

				// Gestione degli errori del server
				try {
					const errorData = JSON.parse(responseText);
					throw new Error(
						errorData.message || "Errore nella creazione dell'utente"
					);
				} catch (jsonError) {
					throw new Error(
						"Errore nella creazione dell'utente: " + responseText
					);
				}
			}

			// Elaborazione della risposta positiva
			const data = await response.json();
			setMessage("Verifica la tua email per completare la registrazione.");

			// Navigazione a pagina di verifica
			router.push(`/account/other/accountVerification`);
		} catch (error: any) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={stylesHeader.headerContainer}>
			<div className={stylesHeader.registerHeader}>
				<Image className={stylesForm.logo} src={logo} alt="Logo" width={150} />
				<h2 data-id="title" className={stylesHeader.title}>
					Compila i campi per registrarti
				</h2>
			</div>
			<form onSubmit={handleSubmit} className={stylesForm.form}>
				<div className={stylesForm.formGroup}>
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

export default SignUp;