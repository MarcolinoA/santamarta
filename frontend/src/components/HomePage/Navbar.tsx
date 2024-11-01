"use client"
import React, { useState, useEffect, useRef } from "react";
import stylesNavbar from "../../Styles/Navbar.module.css";
import { FiMenu } from "react-icons/fi";

interface MenuItem {
	name: string;
	icon: string;
}

const MobileMenu: React.FC<{
	menuItems: MenuItem[];
	activeIndex: number;
	setActiveIndex: (index: number) => void;
	isOpen: boolean;
	toggleMenu: () => void;
}> = ({ menuItems, activeIndex, setActiveIndex, isOpen, toggleMenu }) => (
	<div
		className={`${stylesNavbar.mobileMenu} ${isOpen ? stylesNavbar.open : stylesNavbar.close}`}
	>
		{menuItems.map((item, index) => (
			<div
				key={index}
				className={`${stylesNavbar.navbarItem} ${activeIndex === index ? stylesNavbar.active : ""}`}
				onClick={() => {
					setActiveIndex(index);
					toggleMenu();
				}}
			>
				<span className={stylesNavbar.navbarIcon}>{item.icon}</span>
				<span className={stylesNavbar.navbarText}>{item.name}</span>
			</div>
		))}
	</div>
);

const Navbar: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null); // Reference to the navbar container

	const menuItems: MenuItem[] = [
		{ name: "Dashboard", icon: "🚀" },
		{ name: "Documents", icon: "📄" },
		{ name: "Components", icon: "🧩" },
		{ name: "Calendar", icon: "📅" },
		{ name: "Charts", icon: "📊" },
		{ name: "Address Book", icon: "📖" },
	];

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);

    if (!isMenuOpen) {
        document.querySelector(`.${stylesNavbar.hamburger}`)?.classList.add(stylesNavbar.openIcon);
        document.querySelector(`.${stylesNavbar.hamburger}`)?.classList.remove(stylesNavbar.closeIcon);
    } else {
        document.querySelector(`.${stylesNavbar.hamburger}`)?.classList.remove(stylesNavbar.openIcon);
        document.querySelector(`.${stylesNavbar.hamburger}`)?.classList.add(stylesNavbar.closeIcon);
    }
};

	// Funzione per chiudere il menu quando si clicca fuori
	const handleClickOutside = (event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setIsMenuOpen(false);
		}
	};

	useEffect(() => {
		// Aggiunge event listener al mount
		document.addEventListener("mousedown", handleClickOutside);

		// Rimuove event listener al dismount
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className={stylesNavbar.navbar} ref={menuRef}>
			<div className={stylesNavbar.hamburger} onClick={toggleMenu}>
				<FiMenu size={30} color="#333" />
			</div>

			<MobileMenu
				menuItems={menuItems}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
				isOpen={isMenuOpen}
				toggleMenu={toggleMenu}
			/>

			<div className={stylesNavbar.navbarMenu}>
				{menuItems.map((item, index) => (
					<div
						key={index}
						className={`${stylesNavbar.navbarItem} ${activeIndex === index ? stylesNavbar.active : ""}`}
						onClick={() => setActiveIndex(index)}
					>
						<div className={stylesNavbar.spanContainer}>
							<span className={stylesNavbar.navbarText}>{item.name}</span>
						</div>
					</div>
				))}
				<div
					className={stylesNavbar.navbarActiveIndicator}
					style={{ transform: `translateX(${activeIndex * 100}%)` }}
				/>
			</div>
		</div>
	);
};

export default Navbar;