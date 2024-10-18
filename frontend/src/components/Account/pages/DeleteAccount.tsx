"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "../../../hooks/useAuthentications";
import AccessDenied from "../../shared/AccessDenied";
import FormPageLayout from "../../shared/FormPageLayout";

const DeleteAccount: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated, username } = useAuthentication();
	const router = useRouter();

	const handleDeleteAccount = async () => {
		// Controllo dell'autenticazione e del nome utente
		if (!isAuthenticated || !username) {
			setError("Devi essere autenticato per eliminare l'account.");
			return;
		}
	
		setLoading(true);
		setError(null); // Resetta l'errore prima di procedere
	
		try {
			const response = await fetch(
				`https://santamarta-backend.onrender.com/users/deleteAccount`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include", // Includi i cookie
				}
			);
	
			// Verifica se la risposta è ok
			if (!response.ok) {
				const data = await response.json(); // Prova a estrarre i dati dal server
				throw new Error(data.message || "Errore durante la cancellazione dell'account.");
			}
	
			// Reindirizza dopo la cancellazione
			router.push(`/`);
		} catch (error: any) {
			setError(error.message); // Imposta il messaggio di errore
			console.error("Errore durante la cancellazione dell'account:", error);
		} finally {
			setLoading(false); // Ferma il caricamento
		}
	};
	
	if (isAuthenticated === false) {
		return <AccessDenied />;
	}

	return (
		<FormPageLayout
			title="Elimina il tuo account"
			error={error}
			loading={loading}
			onSubmit={handleDeleteAccount}
			buttonText="Elimina l'account"
			loadingText="Eliminazione in corso..."
			isAuthenticated={false}
			username=""
			options={[{ label: "Home", href: "/", dataid: "home-btn" }]}
			buttonDataId="delete-btn"
			formDataId="deleteAccForm"
			errorDataId="acc-delete-err-msg"
		/>
	);
};

export default DeleteAccount;
