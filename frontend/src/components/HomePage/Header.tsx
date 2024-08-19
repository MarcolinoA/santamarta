"use client"
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import style from "../../Styles/Header.module.css";
import Link from 'next/link';

interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const savedUsername = Cookies.get('username'); // Recupera lo username dal cookie
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleIconClick = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <div className={style.headerContainer}>
      <div className={style.userInfo} onClick={handleIconClick}>
        <FaUserCircle
          className={style.userIcon}
          size={30}
        />
        {isDropdownVisible && (
          <div className={style.dropdownMenu}>
            <div className={style.dropdownArrow}></div>
            <div className={style.dropdownContent}>
              <p>{isLoggedIn ? `Ciao, ${username} gestisci il tuo account` : `Ciao, ospite, gestisci il tuo account`}</p>
              <button><Link className={style.links} href="/signup">Registrati</Link></button>
              <button><Link className={style.links} href="/signin">Accedi</Link></button>
              <button><Link className={style.links} href="/logout">Esci</Link></button>
              <button><Link className={style.links} href="/deleteAccount">Elimina</Link></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
