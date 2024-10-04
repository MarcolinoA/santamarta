import React from "react";
import SignUpPage from "../../../../components/Account/pages/SignUp";

// Esporta il metadata
export const metadata = {
	title: "Signup",
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

const Signup = () => {
	return (
		<div>
			<main>
				<SignUpPage />
			</main>
		</div>
	);
};

export default Signup;
