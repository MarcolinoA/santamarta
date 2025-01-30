"use client"
import React, { useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image';
import logo from "../../../../public/logo.png"
import { imageServices } from '../../../services/apiImagesServices';
import { useRouter } from 'next/navigation';
import DeleteImgList from './DeleteImgList';
import stylesHeader from "../../../Styles/HomePage/Header.module.css";
import stylesForm from "../../../Styles/Form.module.css"

interface ExtendedImage extends Image {
	active: boolean;
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
		<div data-id="delete-img-container" className={`${stylesHeader.headerContainer} ${stylesHeader.deleteHomeImg}`}>
		<div className={stylesForm.loginHeader}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 data-id="delete-img-title" className={stylesForm.title}>Elimina un&apos;immagine dal database</h2>
			</div>
			<DeleteImgList images={imagesArr} onDelete={handleSubmit} loading={loading} error={error} />
			</div>
	);
}

export default DeleteHomeImg;
