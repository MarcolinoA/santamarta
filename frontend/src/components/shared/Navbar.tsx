"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import stylesNavbar from "../../Styles/Navbar.module.css";
import stylesBtn from "../../Styles/HomePage/Btns/HeaderBtn.module.css";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import { useAuthentication } from "../../hooks/useAuthentications";

interface MenuItem {
  name: string;
  route: string;
}

const Navbar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "/";
  const router = useRouter();
  const { isAuthenticated, username } = useAuthentication();

  const menuItems: MenuItem[] = [
    { name: "Home", route: "/" },
    { name: "La scuola", route: "/lascuola" },
    { name: "Documents", route: "/documents" },
    { name: "Profilo", route: "#" },
  ];

  const dropdownOptions = [
    { label: "Impostazioni", href: "/settings", dataid: "settings" },
    { label: "Logout", href: "/logout", dataid: "logout" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    if (isMobile) {
      // Gestione del dropdown per la versione mobile
      if (isProfileDropdownVisible) {
        setIsDropdownClosing(true); // Inizia l'animazione di chiusura
        setTimeout(() => {
          setIsProfileDropdownVisible(false); // Nascondi il menu dopo l'animazione
          setIsDropdownClosing(false); // Resetta lo stato di chiusura
        }, 300); // Durata dell'animazione (300ms)
      } else {
        setIsProfileDropdownVisible(true); // Mostra il menu
      }
    } else {
      // Gestione del dropdown per la versione desktop
      setIsDropdownVisible((prev) => !prev);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
      setIsProfileDropdownVisible(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Definiamo 768px come punto di interruzione per la versione mobile
    };

    // Chiama handleResize all'inizio per impostare lo stato corretto
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const findActiveIndex = (path: string): number => {
    const index = menuItems.findIndex((item) => item.route === path);
    return index >= 0 ? index : 0;
  };

  useEffect(() => {
    setActiveIndex(findActiveIndex(pathname));
  }, [pathname]);

  return (
    <div className={stylesNavbar.navbar} ref={menuRef}>
      <div className={stylesNavbar.hamburger} onClick={toggleMenu}>
        <FiMenu size={30} color="#000" />
      </div>

      <div
        className={`${stylesNavbar.mobileMenu} ${
          isMenuOpen ? stylesNavbar.open : stylesNavbar.close
        }`}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`${stylesNavbar.navbarItem} ${
              activeIndex === index ? stylesNavbar.active : ""
            }`}
            onClick={() => {
              setActiveIndex(index);
              if (item.name === "Profilo") {
                toggleProfileDropdown();
              } else {
                toggleMenu();
                setIsProfileDropdownVisible(false);
                router.push(item.route);
              }
            }}
          >
            <span className={stylesNavbar.navbarText}>{item.name}</span>
          </div>
        ))}

        {/* Mostra gli elementi della tendina sotto "Profilo" */}
        <div
          className={`${stylesNavbar.dropdownSubMenu} ${
            isProfileDropdownVisible ? stylesNavbar.open : ""
          }`}
        >
          {dropdownOptions.map((option, index) => (
            <div key={index} className={stylesNavbar.navbarItem}>
              <button className={stylesBtn.dropdownButton}>
                <Link className={stylesBtn.dropdownLinks} href={option.href}>
                  {option.label}
                </Link>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={stylesNavbar.navbarMenu}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`${stylesNavbar.navbarItem} ${
              activeIndex === index ? stylesNavbar.active : ""
            }`}
            onClick={() => {
              setActiveIndex(index);
              if (item.name === "Profilo")
                toggleProfileDropdown(); // Gestisce sia mobile che desktop
              else router.push(item.route);
            }}
          >
            <div className={stylesNavbar.spanContainer}>
              <span className={stylesNavbar.navbarText}>{item.name}</span>
            </div>
          </div>
        ))}

        {/* Dropdown desktop per "Profilo" */}
        {isDropdownVisible && (
          <div className={stylesBtn.dropdownMenu}>
            {dropdownOptions.map((option, index) => (
              <div key={index} className={stylesBtn.drop}>
                <button className={stylesBtn.dropdownButton}>
                  <Link className={stylesBtn.dropdownLinks} href={option.href}>
                    {option.label}
                  </Link>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
