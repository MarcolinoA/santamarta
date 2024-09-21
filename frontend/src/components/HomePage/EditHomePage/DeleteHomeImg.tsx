"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import Header from '../../shared/Header';
import Image, { StaticImageData } from 'next/image';
import logo from "../../../../public/logo.png"
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import { imageServices } from '../../../services/apiImagesServices';
import ImageList from './ImageList';
import { useRouter } from 'next/navigation';

interface Image {
	_id: string;
	title: string;
	image: string | StaticImageData;
	desc: string;
	status: string;
}

function DeleteHomeImg() {
	const [imagesArr, setImagesArr] = useState<Image[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const options = [
		{ label: "Home", href: "/" },
		{ label: "Modifica l'immagine", href: "/home/homePageEdit" },
	];

	useEffect(() => {
		const fetchImages = async () => {
			try {
				setLoading(true);
				const data = await imageServices.getAllImages();
				setImagesArr(data.data.map((image: any) => ({ ...image, _id: image._id.toString() })));
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
		<div className={stylePage.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 className={stylePage.title}>Elimina un'immagine al database</h2>
			<ImageList images={imagesArr} onDelete={handleSubmit} loading={loading} error={error} />
			<Header isLoggedIn={false} username="" options={options} />
		</div>
	);
}

export default DeleteHomeImg