"use client";
import React, { useEffect, useState } from "react";
import { imageServices } from "../../../services/apiImagesServices";
import Image, { StaticImageData } from "next/image";
import Card from "../../Sections/Cards/Card";
import { useRouter } from "next/navigation";
import DeleteBtn from "../../shared/btns/DeleteBtn";
import AddBtn from "../../shared/btns/AddBtn";
import logo from "../../../../public/logo.png";
import styleHeader from "../../../Styles/HomePage/ImageList.module.css";
import stylesCard from "../../../Styles/Card.module.css";

interface Image {
	_id: number;
	title: string;
	image: string | StaticImageData;
	desc: string;
}

function HomeImgList() {
	const [images, setImages] = useState<Image[]>([]);
	const [activeImageId, setActiveImageId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const optionPlus = [
		{
			href: "/home/homePageAddImg",
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
			<div className={styleHeader.imageListContainer}>
				<div className={styleHeader.headerContainer}>
					<Image src={logo} alt="Logo" width={150} className={styleHeader.logo} />
					<h2 data-id="" className={styleHeader.title}>
						Fai click su una delle Card per impostarla come immagine della
						schermata home
					</h2>
				</div>
				<div className={styleHeader.imagesSection}>
					{images.map((card: Image) => (
						<div
							key={card._id}
							className={stylesCard.cardWrapper}
							onClick={() => handleCardClick(card._id)}
							data-id="card-wrapper"
						>
							<Card
								cardName={card.title}
								img={card.image}
								alt={card.title || "image"}
								desc={card.desc}
							/>
						</div>
					))}
					<AddBtn option={optionPlus} />
					<DeleteBtn option={optionDelete} />
				</div>
			</div>
		</>
	);
}

export default HomeImgList;
