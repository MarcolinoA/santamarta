import React from "react";
import HomePage from "../components/HomePage/HomePage";
import styles from "../Styles/HomePage/HomePage.module.css";
import Script from "next/script";
import CardTable from "../components/Sections/Cards/CardTable";
import CardTableTwo from "../components/Sections/Cards/CardTableTwo";
import Footer from "../components/shared/Footer";

// Esporta i metadata
export const metadata = {
	title: "Home Page",
	description: "Generated by create next app",
	icons: {
		icon: "/favicon.ico",
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

const Home = () => {
	return (
		<div>
			{/* Sposta <Script /> fuori da <Head> */}
			<Script
				src="https://www.google.com/recaptcha/enterprise.js?render=explicit"
				strategy="beforeInteractive"
			/>

			<main className={styles.main}>
				<HomePage />
			</main>

			<CardTable cardTitle="Laboratori" />

			<CardTableTwo cardTitle="Servizi" />

			<footer>
				<Footer />
			</footer>
		</div>
	);
};

export default Home;
