import React, { Suspense } from "react";
import HomePage from "../components/HomePage/HomePage";
import Footer from "../components/shared/Footer";
import styles from "../Styles/HomePage/Header.module.css";
import Navbar from "../components/HomePage/Navbar";
import Servizi from "../components/Sections/Servizi";
import Laboratori from "../components/Sections/Laboratori";
import Informazioni from "../components/Sections/Informazioni";
import OffertaFormativa from "../components/Sections/OffertaFormativa";

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
			<Laboratori cardTitle="Laboratori" />
			<Informazioni cardTitle="Informazioni" />
			<Servizi cardTitle="Servizi" />
			<OffertaFormativa cardTitle="OffertaFormativa" />
			<footer>
				<Footer />
			</footer>
		</div>
	);
};

export default Home;
