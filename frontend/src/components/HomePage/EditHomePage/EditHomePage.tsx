"use client";
import React, { useEffect, useState } from "react";
import style from "../../../Styles/Card.module.css";
import { imageServices } from "../../../services/apiImagesServices";
import { StaticImageData } from "next/image";
import Card from "../../Sections/Cards/Card";
import PriorityButton from "../../shared/PriorityButton";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DeleteBtn from "./DeleteBtn";

interface Image {
	_id: number;
	title: string;
	image: string | StaticImageData;
	desc: string;
}

function EditHomePage() {
	const [images, setImages] = useState<Image[]>([]);
	const [activeImageId, setActiveImageId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const optionPlus = [
		{
			href: "/home/homePageAddImg",
			icon: <FaPlus size={30} />,
			style: {
				position: "fixed" as const,
				bottom: "20px",
			left: "20px",
			},
		},
	];

	const optionDelete = [
		{
			href: "/home/homePageDeleteImg",
			icon: <FaTrash size={30} />,
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

	const handleCardClick = async (id: number) => {
		setActiveImageId(id);

		await imageServices.updateImage(String(id), { active: true });

		// Aggiorna lo stato locale
		setImages((prevImages) =>
			prevImages.map((image) =>
				image._id === id
					? { ...image, active: true }
					: { ...image, active: false }
			)
		);

		router.push("/");
	};

	return (
		<>
			<div className={style.editHomePageWrapper}>
				<h2 data-id="edit-home-img-title" className={style.editHomePageTitle}>
					Fai click su una delle Card per impostarla come immagine della
					schermata home
				</h2>
				<div className={style.imagesCardSection}>
					{images.map((card: Image) => (
						<div
							key={card._id}
							className={style.cardWrapper}
							onClick={() => handleCardClick(card._id)}
							data-id="card-wrapper"
						>
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
					<PriorityButton option={optionPlus} />
					<DeleteBtn option={optionDelete} />
				</div>
			</div>
		</>
	);
}

export default EditHomePage;
