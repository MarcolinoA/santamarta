"use client"
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import style from "../../Styles/Header.module.css";

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
              <p>{isLoggedIn ? `Ciao, ${username}` : 'Ospite'}</p>
              <button>Profile</button>
              <button>Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;