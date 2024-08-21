"use client";
import Image from "next/image";
import logo from "../../../public/logo.png"
import styles from "../../Styles/Navbar.module.css"
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleIconClick = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Logo" width={150} />
      </div>
      <div className={styles.linksContainer}>
        <ul className={styles.horizontalMenu}>
          {/*<li><a className={styles.link}>Laboratori</a></li>
          <li><a className={styles.link}>Servizi</a></li>*/}
          <li><a className={styles.link}>La scuola</a></li>
          <li><a className={styles.link}>Orari</a></li>
          <li><a className={styles.link}>Area riservata</a></li>
          <li><a className={styles.link}>Contatti</a></li>
          <li className={styles.link} onClick={handleIconClick}>
            Modulistica
          {isDropdownVisible && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownArrow}></div>
            <div className={styles.dropdownContent}>
              <button><Link className={styles.links} href="/signup">Assenze</Link></button>
              <button><Link className={styles.links} href="/signin">Iscrizione</Link></button>
              <button><Link className={styles.links} href="/logout">Doposcuola</Link></button>
            </div>
          </div>
        )}
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
