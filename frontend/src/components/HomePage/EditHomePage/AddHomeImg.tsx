"use client"
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import stylePage from "../../../Styles/HomePage/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import logo from "../../../../public/logo.png";
import Image from 'next/image';
import Header from '../../shared/Header';
import { useRouter } from 'next/navigation';
import { imageServices } from "../../../services/apiImagesServices";

interface FormData {
	title: string;
	image: string;
}

function AddHomeImg() {
	const [formData, setFormData] = useState<FormData>({
		title: "",
		image: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter()

	const options = [
		{ label: "Home", href: "/" },
		{ label: "Modifica l'immagine", href: "/home/homePageEdit" },
	];

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await imageServices.addImage(formData);
		} catch (error) {
			setError("Errore durante il salvataggio."); 
			console.error("Error fetching images:", error);
		} finally {
			setLoading(false); 
			router.push("/home/homePageEdit"); 
		}
	};

	return (
		<div className={stylePage.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 className={stylePage.title}>Aggiungi un'immagine al database</h2>
			<form onSubmit={handleSubmit} className={style.form}>
				<div className={style.formGroup}>
					<label htmlFor="Titolo" className={style.formLabel}>
						Titolo
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						required
						className={style.formInput}
					/>
				</div>
				<div className={style.formGroup}>
					<label htmlFor="Image" className={style.formLabel}>
						Link
					</label>
						<input
							type="text"
							id="image"
							name="image"
							value={formData.image}
							onChange={handleChange}
							required
							className={`${style.formInput}`}
						/>
				</div>
				{error && <div className={style.errorMessage}>{error}</div>}
				<button type="submit" className={style.formButton} disabled={loading}>
					{loading ? "Aggiungendo..." : "Aggiungi"}
				</button>
				<div className={style.errorLinks}>
					<Link
						href="https://eu-north-1.console.aws.amazon.com/s3/upload/scuola-santamarta?bucketType=general&region=eu-north-1#"
						className={style.errorMessage}
						target="_blank"
						rel="noopener noreferrer"
					>
						Prima di aggiungere l'immagine al database ricorda di inserirla nel Bucket e renderla visibile
					</Link>
				</div>
			</form>
			<Header isLoggedIn={false} username="" options={options} />
		</div>
	);
}

export default AddHomeImg