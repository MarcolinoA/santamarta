"use client";
import React from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "../../shared/FormPageLayout";

const VerificationSuccess: React.FC = () => {
	const router = useRouter();

	const handleRedirect = () => {
		router.push("/account/pages/signin");
	};

	return (
		<FormPageLayout
			title="Verifica completata"
			error={null}
			loading={false} 
			onSubmit={handleRedirect}
			buttonText="Accedi all'account"
			loadingText="" 
			isAuthenticated={false} 
			username="" 
			options={[]}
			buttonDataId="verify-success-btn"
			formDataId="verify-success-form"
			errorDataId="verify-success-err"
		/>
	);
};

export default VerificationSuccess;