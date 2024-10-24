import Image from "next/image";
import logo from "../../../public/logo.png";
import styles from "../../Styles/Navbar.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentications";

const Navbar: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthentication();

  const handleIconClick = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleMenuClick = () => {
    setIsMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className={styles.navbar}>
      {!isMenuVisible && (
        <div className={styles.logoContainer}>
          <Image src={logo} alt="Logo" width={150} className="logo" />
        </div>
      )}
      <div className={styles.linksContainer} data-id="nav-links-container">
        <ul className={styles.horizontalMenu} data-id="nav-links-container">
          <li>
            <a className={styles.link}>La scuola</a>
          </li>
          <li>
            <a className={styles.link}>Orari</a>
          </li>
          <li>
            <a className={styles.link}>Area riservata</a>
          </li>
          <li>
            <a className={styles.link}>Contatti</a>
          </li>
          {isAuthenticated && (
            <li>
              <a className={styles.link}>Roma</a>
            </li>
          )}
          <li className={styles.link} onClick={handleIconClick}>
            Modulistica
            {isDropdownVisible && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownArrow}></div>
                <div className={styles.dropdownContent}>
                  <button>
                    <Link className={styles.links} href="/">
                      Assenze
                    </Link>
                  </button>
                  <button >
                    <Link className={styles.links} href="/">
                      Iscrizione
                    </Link>
                  </button>
                  <button>
                    <Link className={styles.links} href="/">
                      Doposcuola
                    </Link>
                  </button>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>

      <div className={styles.hamburgerIcon} onClick={handleMenuClick}>
        &#9776;
      </div>
      {isMenuVisible && (
        <div className={styles.mobileMenu}>
          <ul className={styles.verticalMenu}>
            <li>
              <a className={styles.link}>La scuola</a>
            </li>
            <li>
              <a className={styles.link}>Orari</a>
            </li>
            <li>
              <a className={styles.link}>Area riservata</a>
            </li>
            <li>
              <a className={styles.link}>Contatti</a>
            </li>
            {isAuthenticated && (
              <li>
                <a className={styles.link}>Roma</a>
              </li>
            )}
            <li>
              <a onClick={handleIconClick} className={styles.link}>
                Modulistica
              </a>
            </li>
            {isDropdownVisible && (
              <div>
                <li>
                  <a className={styles.link}>Roma</a>
                </li>

                <li>
                  <a className={styles.link}>Roma</a>
                </li>
                <li>
                  <a className={styles.link}>Roma</a>
                </li>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
