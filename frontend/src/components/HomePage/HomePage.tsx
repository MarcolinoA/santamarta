"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation"; // Importa useSearchParams
import styles from "../../Styles/HomePage/HomePage.module.css";
import Navbar from "./Navbar";
import PriorityButton from "../shared/PriorityButton";
import { FaPen } from "react-icons/fa";
import { imageServices } from "../../services/apiImagesServices";
import Header from "../shared/Header";
import dynamic from "next/dynamic";

const FALLBACK_IMAGE =
	"https://scuola-santamarta.s3.eu-north-1.amazonaws.com/logo.png";

const HomePage = () => {
	const [imageSrc, setImageSrc] = useState<string>(FALLBACK_IMAGE);
	const [loading, setLoading] = useState<boolean>(true);

	const options = [
		{
			label: "Registrati",
			href: "/account/pages/signup",
			dataid: "signup-btn",
		},
		{ label: "Accedi", href: "/account/pages/signin", dataid: "signin-btn" },
		{ label: "Esci", href: "/account/pages/logout", dataid: "logout-btn" },
		{
			label: "Elimina",
			href: "/account/pages/deleteAccount",
			dataid: "delete-account-btn",
		},
	];

	const option = [
		{
			href: "/home/homePageEdit",
			icon: <FaPen size={30} />,
			style: {
				position: "absolute" as const,
			},
		},
	];

	useEffect(() => {
		const fetchActiveImage = async () => {
			setLoading(true);
			try {
				const image = await imageServices.getActiveImage();
				// Se l'immagine non è disponibile, imposta l'immagine di fallback
				setImageSrc(image.image ? image.image : FALLBACK_IMAGE);
			} catch (error) {
				// In caso di errore, imposta l'immagine di fallback
				console.error("Error fetching active image:", error);
				setImageSrc(FALLBACK_IMAGE);
			} finally {
				setLoading(false);
			}
		};

		fetchActiveImage();
	}, []);

	const searchParams = useSearchParams();
	let username = "";

	if (searchParams) {
		username = searchParams.get("username") || "";
	}

	return (
		<div className={styles.homePageContainer}>
			<Navbar />
			{loading ? (
				<div data-id="loading-spinner" className={styles.loader}></div>
			) : (
				<Image
					src={imageSrc}
					alt="test"
					layout="fill"
					objectFit="cover"
					quality={100}
					priority={true}
					data-id="home-page-img"
				/>	
			)}
			<Header
				isLoggedIn={true}
				username={(username as string) || ""}
				options={options}
			/>
			<PriorityButton option={option} />
		</div>
	);
};

export default HomePage;
