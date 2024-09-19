"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import style from "../../../Styles/HomePage/HomePage.module.css";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import { useRouter } from "next/navigation";
import { imageServices } from "../../../services/apiImagesServices";
import Link from "next/link";
import { stringify } from 'flatted';

interface FormData {
	title: string;
	link: string;
}

function AddHomePageImage() {
	const [formData, setFormData] = useState<FormData>({
		title: "",
		link: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};


	const onBtnClick = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
	
		try {
			const serializedData = stringify(formData);  // Usa flatted per serializzare
			const data = await imageServices.addImage(serializedData);
			if (!data) {
				throw new Error("Nessuna risposta dall'API");
			}
			router.push("/");
		} catch (error) {
			console.error("Errore nell'invio dei dati:", error);
			setError("Errore durante l'inserimento dell'immagine.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={style.homePageContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 className={style.title}>Aggiungi una nuova immagine al database</h2>
			<form onSubmit={onBtnClick} className={style.form}>
				<div className={style.formGroup}>
					<label htmlFor="title" className={style.formLabel}>
						Title
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
					<label htmlFor="link" className={style.formLabel}>
						Link
					</label>
					<input
						type="text"
						id="link"
						name="link"
						value={formData.link}
						onChange={handleChange}
						required
						className={style.formInput}
					/>
				</div>
				{error && <div className={style.errorMessage}>{error}</div>}
				<button type="submit" className={style.formButton} disabled={loading}>
					{loading ? "Inserimento..." : "Conferma"}
				</button>
				<div className={style.errorLinks}>
					<Link
						href="https://eu-north-1.console.aws.amazon.com/s3/upload/scuola-santamarta?bucketType=general&region=eu-north-1#"
						className={style.errorMessage}
					>
						Prima di inserire una nuova immagine nel database assicurati di
						averla aggiunta nel Bucket di Santamarta
					</Link>
				</div>
			</form>
		</div>
	);
}

export default AddHomePageImage;
