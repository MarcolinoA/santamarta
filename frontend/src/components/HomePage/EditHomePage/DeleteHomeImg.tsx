"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../shared/Header';
import Image, { StaticImageData } from 'next/image';
import logo from "../../../../public/logo.png"
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import { imageServices } from '../../../services/apiImagesServices';
import ImageList from './ImageList';
import { useRouter } from 'next/navigation';

interface ExtendedImage extends Image {
	active: boolean; // Aggiungi la proprietà qui
}


interface Image {
	_id: string;
	title: string;
	image: string | StaticImageData;
	desc: string;
	status: string;
}

function DeleteHomeImg() {
	const [imagesArr, setImagesArr] = useState<ExtendedImage[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const options = [
		{ label: "Home", href: "/", dataid: "home-btn" },
		{ label: "Modifica l'immagine", href: "/home/homePageEdit", dataid: "img-home-edit-btn" },
	];

	useEffect(() => {
		const fetchImages = async () => {
			try {
					setLoading(true);
					const data = await imageServices.getAllImages();
					setImagesArr(data.data.map((image: any) => ({ ...image, _id: image._id.toString(), active: image.active || false })));
			} catch (error) {
					console.error("Error fetching images:", error);
			} finally {
					setLoading(false);
			}
	};

		fetchImages();
	}, []);

	const handleSubmit = async (id: string) => {
		setLoading(true);
		setError(null);

		try {
			await imageServices.deleteImage(id);
		} catch (error) {
			setError("Errore durante il salvataggio."); 
			console.error("Error deleting image:", error);
		} finally {
			setLoading(false); 
			router.push("/home/homePageEdit"); 
		}
	};

	return (
		<div data-id="delete-img-container" className={stylePage.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 data-id="delete-img-title" className={stylePage.title}>Elimina un&apos;immagine dal database</h2>
			<ImageList images={imagesArr} onDelete={handleSubmit} loading={loading} error={error} />
			<Header isLoggedIn={false} username="" options={options} />
		</div>
	);
}

export default DeleteHomeImg;
