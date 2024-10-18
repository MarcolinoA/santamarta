"use client";
import { useState, useEffect } from "react";
import logo from "../../../../public/logo.png";
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import Image from "next/image";
import Link from "next/link";

const AccountVerification: React.FC = () => {
	const [message, setMessage] = useState<string>("");
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const fetchEmail = async () => {
			try {
				const response = await fetch(
					`/api/users/get-email`,
					{
						credentials: "include",
					}
				);
				if (response.ok) {
					const data = await response.json();
					setEmail(data.email);
				} else {
					setMessage(
						"Errore: email non trovata. Per favore, registrati di nuovo."
					);
				}
			} catch (error) {
				console.error("Errore nel recupero dell'email:", error);
				setMessage("Si è verificato un errore. Per favore, riprova più tardi.");
			}
		};

		fetchEmail();
	}, []);

	const handleResendVerification = async () => {
		if (!email) {
			setMessage("Errore: email non trovata. Registrati di nuovo");
			return;
		}
		try {
			const response = await fetch(
				`/api/users/resend-verification`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
					credentials: "include",
				}
			);
			if (response.ok) {
				setMessage(
					"Email di verifica reinviata con successo. Controlla la tua casella di posta."
				);
			} else {
				setMessage("Si è verificato un errore. Per favore, riprova più tardi.");
			}
		} catch (error) {
			console.error("Errore durante il reinvio dell'email di verifica:", error);
			setMessage("Si è verificato un errore. Per favore, riprova più tardi.");
		}
	};

	return (
		<div className={stylePage.homePageContainer}>
			<form className={style.form} data-id="av-form">
				<Image src={logo} alt="Logo" width={150} />
				<h2 className={style.formTitle} data-id="av-title">
					Controlla il tuo indirizzo di posta elettronica
				</h2>
				<p className={style.desc} data-id="av-desc">
					Abbiamo inviato un&#39;email di conferma all&#39;account che hai usato per
					iscriverti, segui le istruzioni indicate nell&#39;email! <br /> Se non
					vedi l&#39;email controlla nello spam!
				</p>
				<div
					data-id="av-resend"
					className={style.errorMessage}
					onClick={handleResendVerification}
					style={{ cursor: "pointer" }}
				>
					Non hai ricevuto l&#39;email? Richiedine una nuova premendo QUI e
					controlla la tua casella di posta!
				</div>
				<Link
					data-id="av-link"
					className={style.errorMessage}
					style={{ cursor: "pointer" }}
					href="/"
				>
					Torna alla Home!
				</Link>
				{message && <p data-id="av-msg" className={style.message}>{message}</p>}
			</form>
		</div>
	);
};

export default AccountVerification;