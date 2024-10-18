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
		if (!isAuthenticated || !username) {
			setError("Devi essere autenticato per eliminare l'account");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/users/deleteAccount`,
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
