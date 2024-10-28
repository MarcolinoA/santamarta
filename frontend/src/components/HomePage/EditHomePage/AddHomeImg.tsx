"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import logo from "../../../../public/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { imageServices } from "../../../services/apiImagesServices";
import InputField from "../../shared/InputFieldProps";
import FormFooter from "../../shared/FormFooter";
import HeaderBtn from "../../shared/btns/HeaderBtn";
import stylesHeader from "../../../Styles/HomePage/Header.module.css";
import stylesForm from "../../../Styles/Form.module.css";

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
	const router = useRouter();

	const options = [
		{ label: "Home", href: "/", dataid: "home-btn" },
		{
			label: "Modifica l'immagine",
			href: "/home/homePageEdit",
			dataid: "img-home-edit-btn",
		},
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
			if (response) {
				router.push("/home/homePageEdit");
			}
		} catch (error) {
			setError("Errore durante il salvataggio.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`${stylesHeader.headerContainer} ${stylesHeader.addImgDB}`}>
			<div className={stylesForm.loginHeader}>
				<Image src={logo} alt="Logo" width={150} />
				<h2 className={stylesHeader.title}>
					Aggiungi un&apos;immagine al database
				</h2>
			</div>
			<form onSubmit={handleSubmit} className={stylesForm.formLogin}>
				<div className={stylesForm.formGroup}>
					<InputField
						id="title"
						dataid="title-input"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						label="Titolo"
						required
					/>
					<InputField
						id="image"
						dataid="image-input"
						name="image"
						type="text"
						value={formData.image}
						onChange={handleChange}
						label="Link"
						required
					/>
				</div>
				<FormFooter
					message={error}
					loading={loading}
					btnDataId="submit-btn"
					btnLoadingText="Aggiungendo..."
					btnText="Aggiungi"
					hrefLink="https://eu-north-1.console.aws.amazon.com/s3/upload/scuola-santamarta?bucketType=general&region=eu-north-1#"
					linkText="Prima di aggiungere l'immagine al database ricorda di inserirla nel Bucket e renderla visibile"
					hrefLink2=""
					linkText2=""
					hrefLink3=""
					linkText3=""
				/>
			</form>
			<HeaderBtn isLoggedIn={false} username="" options={options} />
		</div>
	);
}

export default AddHomeImg;
