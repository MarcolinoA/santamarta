"use client";
import React, { useEffect, useState } from "react";
import logo from "../../../../public/logo.png";
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../shared/Header";
import { useAuthentication } from "../../../hooks/useAuthentications";

const DeleteAccount: React.FC = () => {
	const options = [
		{ label: "Home", href: "/" },
		{ label: "Accedi", href: "/account/pages/signin" },
		{ label: "Registrati", href: "/account/pages/signup" },
	];

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated, username } = useAuthentication();
	const router = useRouter();

	const handleDeleteAccount = async () => {
		if (!isAuthenticated || !username) {
			setError("Devi essere autenticato per eliminare l'account");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/deleteAccount`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.message || "Errore durante la cancellazione dell'account"
				);
			}

			router.push(`/`);
		} catch (error: any) {
			setError(error.message);
			console.error("Errore durante la cancellazione dell'account", error);
		} finally {
			setLoading(false);
		}
	};

	if (isAuthenticated === false) {
		return (
			<div className={stylePage.homePageContainer}>
				<Image src={logo} alt="Logo" width={150} />
				<h2 className={style.formTitle}>Accesso Negato</h2>
				<p>Sessione scaduta. Effettua nuovamente il login.</p>
				<Header isLoggedIn={false} username="" options={options} />
			</div>
		);
	}

	return (
		<div className={stylePage.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 className={style.formTitle}>Elimina il tuo account</h2>
			{error && <div className={style.errorMessage}>{error}</div>}
			<form className={style.form} onSubmit={(e) => e.preventDefault()}>
				<button
					type="button"
					className={style.formButton}
					onClick={handleDeleteAccount}
					disabled={loading}
				>
					{loading ? "Eliminazione in corso" : "Elimina l'account"}
				</button>
			</form>
			<Header isLoggedIn={false} username="" options={options} />
		</div>
	);
};

export default DeleteAccount;
