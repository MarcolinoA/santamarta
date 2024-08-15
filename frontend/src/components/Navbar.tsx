"use client";
import Image from "next/image";
import logo from "../../public/logo.png";
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Logo" width={150} />
      </div>
      <div className={styles.linksContainer}>
        <ul className={styles.horizontalMenu}>
          <li><a className={styles.link}>Laboratori</a></li>
          <li><a className={styles.link}>Servizi</a></li>
          <li><a className={styles.link}>La scuola</a></li>
          <li><a className={styles.link}>Orari</a></li>
          <li><a className={styles.link}>Area riservata</a></li>
          <li><a className={styles.link}>Contatti</a></li>
          <li><a className={styles.link}>Modulistica</a></li>
          <li><a className={styles.link}>Accedi</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
