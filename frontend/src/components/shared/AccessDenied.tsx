import Image from 'next/image';
import React from 'react'
import style from "../../Styles/Login.module.css";
import stylePage from "../../Styles/HomePage/Header.module.css";
import logo from "../../../public/logo.png";
import HeaderBtn from './btns/HeaderBtn';

const options = [
	{ label: "Home", href: "/", dataid: "home-btn" },
	{ label: "Accedi", href: "/account/pages/signin", dataid: "signin-btn" },
	{
		label: "Registrati",
		href: "/account/pages/signup",
		dataid: "signup-btn",
	},
];

function AccessDenied() {
	return (
		<div className={stylePage.headerContainer}>
			<Image src={logo} alt="Logo" width={150} />
			<h2 data-id="access-denied" className={style.formTitle}>Accesso Negato</h2>
			<p data-id="session-expired">Sessione scaduta. Effettua nuovamente il login.</p>
			<HeaderBtn isLoggedIn={false} username="" options={options} />
		</div>
	);
}

export default AccessDenied