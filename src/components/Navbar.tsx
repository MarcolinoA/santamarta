"use client";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useState } from "react";
import "../Styles/Navbar.css";
import ArrowDown from "../Icons/ArrowDown"
import ArrowUp from "../Icons/ArrowUp"

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="navbar">
      <div className="logo-container">
        <Image src={logo} alt="" width={150} />
      </div>
      <div className="links-container">
        <ul className="horizontal-menu">
          <li className="item">
            <a className="link">Laboratori</a>
          </li>
          <li className="item">
            <a className="link">Servizi</a>
          </li>
          <li className="item">
            <a className="link">La scuola</a>
          </li>
          <li className="item">
            <a className="link">Orari</a>
          </li>
          <li className="item">
            <div className="dropdown">
              <summary className="summary link" onClick={() => setOpen(!open)}>
                Altro
                { open ? <ArrowUp /> : <ArrowDown /> }
              </summary>
              {open && (
                <ul className="dropdown-list">
                  <li className="dd-item">
                    <a className="dd-link">Area Riservata</a>
                  </li>
                  <li className="dd-item">
                    <a className="dd-link">Contatti</a>
                  </li>
                  <li className="dd-item">
                    <a className="dd-link">Modulistica</a>
                  </li>
                </ul>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
