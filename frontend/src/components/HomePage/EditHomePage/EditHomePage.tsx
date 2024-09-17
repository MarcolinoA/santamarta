"use client";
import React, { useEffect, useState } from "react";
import style from "../../../Styles/Card.module.css";
import { imageServices } from "../../../services/apiImagesServices";
import { StaticImageData } from "next/image";
import Card from "../../Sections/Cards/Card";
import PriorityButton from "../../shared/PriorityButton";
import { FaPlus } from "react-icons/fa";

// al click sull'immagine bisogna far si che l'immagine nella schermata home cambi
// bisogna aggiungere bottoni per eliminarla dalla lista
// aggiungere un bottone per aggiungere

interface Image {
	_id: number;
	title: string;
	image: string | StaticImageData;
	desc: string;
}

function EditHomePage() {
	const [images, setImages] = useState<Image[]>([]);
	const [loading, setLoading] = useState(false);

	const option = [
		{ 
			href: "/addHomePageImage", 
			icon: <FaPlus size={30} />, 
			style: {
				position: 'fixed' as const, // Fixed matches the 'Position' type
			}, 
		},
	];

	useEffect(() => {
		const fetchImages = async () => {
			try {
				setLoading(true);
				const data = await imageServices.getAllImages();
				setImages(data.data);
			} catch (error) {
				console.error("Error fetching images:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchImages();
	}, []);

	return (
		<>
			<div className={style.editHomePageWrapper}>
				<h2 className={style.editHomePageTitle}>
					Seleziona l'immagine della schermata home
				</h2>
				<div className={style.imagesCardSection}>
					{images.map((card: Image) => (
						<div key={card._id} className={style.cardWrapper}>
							<Card
								cardName={card.title}
								cardNameWidth="200px"
								cardNameHeight="30px"
								width="250px"
								height="300px"
								img={card.image}
								alt={card.title || "image"}
								desc={card.desc}
							/>
						</div>
					))}
					<PriorityButton option={option}/>
				</div>
			</div>
		</>
	);
}

export default EditHomePage;
