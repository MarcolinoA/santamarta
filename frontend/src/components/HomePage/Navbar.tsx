import Image from "next/image";
import logo from "../../../public/logo.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentications";
import stylesNavbar from "../../Styles/Navbar.module.css";

const Navbar: React.FC = () => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const { isAuthenticated, checkAuth } = useAuthentication();

  const handleIconClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

	const handleMenuClick = () => {
		setIsMenuVisible((prev) => !prev);
	};

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<div className={stylesNavbar.navbar}>
			{!isMenuVisible && (
				<div className={stylesNavbar.logoContainer}>
					<Image src={logo} alt="Logo" width={150} className="logo" />
				</div>
			)}
			<div className={stylesNavbar.linksContainer}>
				<ul className={stylesNavbar.horizontalMenu}>
					<li>
						<a className={stylesNavbar.link}>La scuola</a>
					</li>
					<li>
						<a className={stylesNavbar.link}>Orari</a>
					</li>
					<li>
						<a className={stylesNavbar.link}>Area riservata</a>
					</li>
					<li>
						<a className={stylesNavbar.link}>Contatti</a>
					</li>
					{isAuthenticated && (
						<li>
							<a className={stylesNavbar.link}>Roma</a>
						</li>
					)}
					<li>
						<a className={stylesNavbar.link}>Modulistica</a>
					</li>
				</ul>
			</div>
			<div
				onClick={handleMenuClick}
				className={`${stylesNavbar.hamburgerIcon} ${isMenuVisible ? stylesNavbar.rotate : ""}`}
			>
				&#9776;
			</div>
			{isMenuVisible && (
				<div
					className={`${stylesNavbar.mobileMenu} ${isMenuVisible ? stylesNavbar.visible : ""}`}
				>
					<ul className={stylesNavbar.verticalMenu}>
						{isAuthenticated && (
							<li>
								<a className={stylesNavbar.link}>Roma</a>
							</li>
						)}
						<li>
							<a className={stylesNavbar.link}>La scuola</a>
						</li>
						<li>
							<a className={stylesNavbar.link}>Orari</a>
						</li>
						<li>
							<a className={stylesNavbar.link}>Area riservata</a>
						</li>
						<li>
							<a className={stylesNavbar.link}>Contatti</a>
						</li>
						<li>
							<Link className={stylesNavbar.link} href="/">
								Assenze
							</Link>
						</li>
						<li>
							<Link className={stylesNavbar.link} href="/">
								Iscrizione
							</Link>
						</li>
						<li>
							<Link className={stylesNavbar.link} href="/">
								Doposcuola
							</Link>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default Navbar;
