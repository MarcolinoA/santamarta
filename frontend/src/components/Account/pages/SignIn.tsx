"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from "next/navigation";
import logo from "../../../../public/logo.png";
import Image from "next/image";
import Header from "../../shared/Header";
import Cookies from "js-cookie";
import { useAuthentication } from "../../../hooks/useAuthentications";
import InputField from "../../shared/InputFieldProps";
import FormFooter from "../../shared/FormFooter";
import { validateForm } from "../../../utils/validation";

interface FormData {
	username: string;
	password: string;
}

interface Errors {
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
	const [errors, setErrors] = useState<Errors>({});
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

		const validationErrors = validateForm(formData, undefined, undefined, false);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors as Errors);
			setLoading(false);
			return;
	}
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
					credentials: "include",
				}
			);

			if (!response.ok) {
				if (response.status === 429) {
					throw new Error("Troppi tentativi di accesso. Riprova più tardi.");
				}

				let errorMessage;
				try {
					const errorData = await response.json();
					errorMessage = errorData.message;
				} catch {
					errorMessage = await response.text();
				}
				throw new Error(errorMessage || "Errore durante il login");
			}

			const data = await response.json();
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const allCookies = Cookies.get();

			const authToken =
				allCookies.authToken || localStorage.getItem("authToken");
			if (!authToken) {            
				throw new Error(
					"Il cookie di autenticazione non è stato impostato correttamente"
				);
			}

			if (data.username) {
				login(authToken, data.username);
				router.push("/");
			} else {
				throw new Error("Token not received from server");
			}
		} catch (error: any) {
			setErrors({ form: error.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={stylePage.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 data-id="title" className={stylePage.title}>Effettua l'accesso</h2>
			<form onSubmit={handleSubmit} className={style.form} data-id="signInForm">
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
			<Header isLoggedIn={false} username="" options={options} />
		</div>
	);
};

export default SignIn;
