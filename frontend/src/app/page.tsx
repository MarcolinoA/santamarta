import React, { Suspense } from "react";
import HomePage from "../components/HomePage/HomePage";
import CardTable from "../components/Sections/Cards/CardTable";
import CardTableTwo from "../components/Sections/Cards/CardTableTwo";
import Footer from "../components/shared/Footer";
import styles from "../Styles/HomePage/Header.module.css";
import Navbar from "../components/HomePage/Navbar";

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
			<main className={styles.main}>
				<Navbar />
				<Suspense fallback={<div>Loading Home...</div>}>
					<HomePage />
				</Suspense>
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
