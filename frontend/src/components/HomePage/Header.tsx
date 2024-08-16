"use client"
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Make sure you have react-icons installed
import style from "../../Styles/Header.module.css";

interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, username }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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
              {/* You can add more options here */}
              <p>{isLoggedIn ? `Welcome, ${username}` : 'Guest'}</p>
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
