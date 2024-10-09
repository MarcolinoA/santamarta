"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import Header from "../../shared/Header";
import InputField from "../../shared/InputFieldProps";
import FormFooter from "../../shared/FormFooter";

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
		{ label: "Registrati", href: "/account/pages/signup",dataid: "signup-btn"},
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
			<h2 data-id="rd-title" className={stylePage.title}>{title}</h2>
			<p data-id="rd-desc" className={stylePage.description}>
				Inserisci l'email con cui ti sei registrato per ricevere un link per
				reimpostare {description}
			</p>
			<form data-id="rd-form" onSubmit={handleSubmit} className={style.form}>
				<div className={style.formGroup}>
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
					errors={{ error: error || "" }}
					loading={loading}
					btnDataId="fd-title"
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
			<Header isLoggedIn={false} username="" options={options} />
		</div>
	);
};

export default RecoverData;

/**
2. Test di Invio del Modulo
Verifica che il modulo si comporti correttamente quando viene inviato, sia in caso di successo che di errore.
Cosa testare:

Simula l'invio con un'email valida e verifica che il messaggio di successo venga visualizzato.
Simula l'invio con un'email non valida o che causa un errore e verifica che il messaggio di errore venga mostrato.

. Test di Stato del Caricamento
Verifica che il pulsante di invio mostri il corretto stato di caricamento quando la richiesta è in corso.


4. Test di Validazione del Campo Email
Verifica che il campo email non accetti input non validi.


5. Test di Navigazione
Verifica che il Header funzioni correttamente e che gli utenti possano navigare verso le altre pagine.

6. Test di Messaggi di Stato
Verifica che i messaggi di stato (successo e errore) vengano visualizzati solo quando appropriato.

 */