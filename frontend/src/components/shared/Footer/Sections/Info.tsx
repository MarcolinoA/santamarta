"use client";
import Image from "next/image";
import logo from "../../../../../public/logo.png";
import style from "../../../../Styles/Footer.module.css";

const Info = () => {
	return (
		<div className={style.firstSection}>
			<div className={style.logo}>
				<Image src={logo} alt="Logo" width={150} />
			</div>
			<div className={style.companyInfo}>
				<h4 className={style.companyName}>Scuola dell'Infanzia Santa Marta</h4>
				<p className={style.companyDesc}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, odio
					libero voluptas officiis voluptates maxime natus rem temporibus ut at
					magnam velit nisi pariatur non nesciunt facere eligendi? Quam,
					consequatur.
				</p>
			</div>
		</div>
	);
};

export default Info;
