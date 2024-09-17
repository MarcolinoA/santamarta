"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import Header from "../../shared/Header";

interface FormData {
	email: string;
}

interface ForgotDataProps {
	alertMessage?: string;
	pushLink?: string;
	title?: string;
	description?: string;
	type?: string;
}

const ForgotData: React.FC<ForgotDataProps> = ({
	alertMessage = "la tua password",
	pushLink = "resetPassword",
	title = "Recupera Password",
	description = "la tua password",
	type = "type",
}) => {
	const options = [
		{ label: "Home", href: "/" },
		{ label: "Accedi", href: "/account/pages/signin" },
		{ label: "Registrati", href: "/account/pages/signup" },
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
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/otp/forgot-data`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...formData, type }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message ||
						`Errore ${response.status}: ${response.statusText}`
				);
			}

			setMessage(
				`Controlla la tua email per reimpostare ${type === "password" ? "la tua password" : "il tuo username"}`
			);
			setTimeout(() => {
				router.push(
					`/account/${type}/${pushLink}?email=${encodeURIComponent(formData.email)}`
				); //resetPassword
			}, 3000);
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={stylePage.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 className={stylePage.title}>{title}</h2>
			<p className={stylePage.description}>
				Inserisci l'email con cui ti sei registrato per ricevere un link per
				reimpostare {description}
			</p>
			<form onSubmit={handleSubmit} className={style.form}>
				<div className={style.formGroup}>
					<label htmlFor="email" className={style.formLabel}>
						Email
					</label>
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
				{message && <p className={style.message}>{message}</p>}
				{error && <p className={style.errorMessage}>{error}</p>}
				<button type="submit" className={style.formButton} disabled={loading}>
					{loading ? "Invio..." : "Invia"}
				</button>
			</form>
			<Header isLoggedIn={false} username="" options={options} />
		</div>
	);
};

export default ForgotData;
