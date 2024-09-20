"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation"; // Importa useSearchParams
import styles from "../../Styles/HomePage/HomePage.module.css";
import Navbar from "./Navbar";
import Header from "../shared/Header";
import PriorityButton from "../shared/PriorityButton";
import { FaPen } from "react-icons/fa";
import { imageServices } from "../../services/apiImagesServices";

// per trovare il surce dell'immagine al root una funzione deve scorrere tra
// le immagini di un api e selezionare quella con active true. Solo un'immagine alla volta può
// essere true

const HomePage = () => {
	const [activeImage, setActiveImage] = useState<{ image: string } | null>(null);

	const options = [
		{ label: "Registrati", href: "/account/pages/signup" },
		{ label: "Accedi", href: "/account/pages/signin" },
		{ label: "Esci", href: "/account/pages/logout" },
		{ label: "Elimina", href: "/account/pages/deleteAccount" },
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
				try {
						const image = await imageServices.getActiveImage();
						setActiveImage(image);
				} catch (error) {
						console.error("Error fetching active image:", error);
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
			{activeImage && (
				<Image
					src={activeImage.image}
					alt="test"
					layout="fill"
					objectFit="cover"
					quality={100}
					priority={true}
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
