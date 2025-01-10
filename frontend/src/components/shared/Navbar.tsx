"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Usa il router specifico per il client
import { usePathname } from "next/navigation"; // Per ottenere la rotta corrente
import stylesNavbar from "../../Styles/Navbar.module.css";
import { FiMenu } from "react-icons/fi";

interface MenuItem {
  name: string;
  route: string;
}

const MobileMenu: React.FC<{
  menuItems: MenuItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isOpen: boolean;
  toggleMenu: () => void;
}> = ({ menuItems, activeIndex, setActiveIndex, isOpen, toggleMenu }) => {
  const router = useRouter();

  return (
    <div
      className={`${stylesNavbar.mobileMenu} ${
        isOpen ? stylesNavbar.open : stylesNavbar.close
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
            toggleMenu();
            router.push(item.route); // Usa router.push solo lato client
          }}
        >
          <span className={stylesNavbar.navbarText}>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const rawPathname = usePathname(); // Ottieni la rotta corrente
  const pathname = rawPathname ?? "/"; // Usa "/" come valore di fallback se pathname è null
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { name: "Home", route: "/" },
    { name: "La scuola", route: "/lascuola" },
    { name: "Documents", route: "/documents" },
    { name: "Components", route: "/components" },
    { name: "Calendar", route: "/calendar" },
    { name: "Charts", route: "/charts" },
  ];

  // Funzione per trovare l'indice corrispondente alla rotta corrente
  const findActiveIndex = (path: string): number => {
    const index = menuItems.findIndex((item) => item.route === path);
    return index >= 0 ? index : 0; // Torna a 0 (Home) se la rotta non è trovata
  };

  useEffect(() => {
    // Aggiorna l'indice attivo in base alla rotta corrente
    setActiveIndex(findActiveIndex(pathname));
  }, [pathname]); // Aggiorna quando cambia pathname

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={stylesNavbar.navbar} ref={menuRef}>
      <div className={stylesNavbar.hamburger} onClick={toggleMenu}>
        <FiMenu size={30} color="#000" />
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
            className={`${stylesNavbar.navbarItem} ${
              activeIndex === index ? stylesNavbar.active : ""
            }`}
            onClick={() => {
              setActiveIndex(index);
              router.push(item.route);
            }}
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
