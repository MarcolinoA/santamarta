import React from "react";
import ForgotData from "../../../../components/Account/reset/ForgotData";

// Esporta il metadata
export const metadata = {
	title: "Recover Password",
	description: "Generated by create next app",
	icons: {
		icon: "/favicon.ico", // Puoi aggiungere un'icona se necessario
	},
	links: [
		{
			rel: "preconnect",
			href: "https://fonts.googleapis.com",
		},
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap",
		},
	],
};

const ForgotPassword = () => {
	return (
		<div>
			<main>
				<ForgotData
					alertMessage="la tua password."
					pushLink="resetPassword"
					title="Hai dimenticato la tua password?"
					description="la password."
					type="password"
				/>
			</main>
		</div>
	);
};

export default ForgotPassword;
