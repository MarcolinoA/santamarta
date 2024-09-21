"use client";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import style from "../../Styles/Header.module.css";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useAuthentication } from "../../hooks/useAuthentications";

interface HeaderOption {
	label: string;
	href: string;
}

interface HeaderProps {
	isLoggedIn: boolean;
	username: string;
	options: HeaderOption[];
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, options }) => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const { isAuthenticated, username, checkAuth } = useAuthentication();

	useEffect(() => {
		checkAuth();
	}, []);

	if (isAuthenticated === null) {
		return null;
	}

	const handleIconClick = () => {
		setIsDropdownVisible((prev) => !prev);
	};

	return (
		<div className={style.headerContainer}>
			<div className={style.userInfo} onClick={handleIconClick}>
				<FaUserCircle className={style.userIcon} size={30} />
				{isDropdownVisible && (
					<div className={style.dropdownMenu}>
						<div className={style.dropdownArrow}></div>
						<div className={style.dropdownContent}>
							{isAuthenticated ? (
								<div>{`Ciao, ${username}`}</div>
							) : (
								<Image src={logo} alt="Logo" width={120} />
							)}
							{options.map((option, index) => (
								<button key={index}>
									<Link className={style.links} href={option.href}>
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
