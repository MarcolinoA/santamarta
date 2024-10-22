"use client";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import style from "../../Styles/HomePage/HeaderBtn.module.css";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useAuthentication } from "../../hooks/useAuthentications";

interface HeaderOption {
	label: string;
	href: string;
	dataid: string;
}

interface HeaderProps {
	isLoggedIn: boolean;
	username: string;
	options: HeaderOption[];
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, options }) => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const { isAuthenticated, username, checkAuth } = useAuthentication();

	// Funzione per mostrare/nascondere il menu
	const toggleDropdown = () => {
		setIsDropdownVisible(!isDropdownVisible);
	};

	// Funzione che nasconde il dropdown se perde il focus
	const handleBlur = () => {
		// Usa setTimeout per ritardare la chiusura del dropdown
		setTimeout(() => {
			setIsDropdownVisible(false);
		}, 150);
	};

	const handleClick = () => {
		// Impedisce la chiusura immediata del dropdown quando si clicca sui pulsanti
		setIsDropdownVisible(true);
	};

	return (
		<div className={style.headerContainer}>
			<div
				className={style.userInfo}
				tabIndex={0}
				onBlur={handleBlur}
				data-id="header-btn"
			>
				<FaUserCircle
					className={style.userIcon}
					size={30}
					onClick={toggleDropdown}
				/>
				{isDropdownVisible && (
					<div className={style.dropdownMenu}>
						<div className={style.dropdownArrow}></div>
						<div className={style.dropdownContent} data-id="dropdown-content">
							{isAuthenticated ? (
								<div>{`Ciao, ${username}`}</div>
							) : (
								<Image src={logo} alt="Logo" width={120} data-id="header-logo" className={style.dropdownLogo}/>
							)}
							{options.map((option, index) => (
								<button
									key={index}
									data-id={option.dataid}
									onClick={handleClick}
									className={style.dropdownButton}
								>
									<Link className={style.dropdownLinks} href={option.href}>
										{option.label}
									</Link>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Header;
