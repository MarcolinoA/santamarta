import Image from "next/image";
import React from "react";
import stylesHeader from "../../Styles/HomePage/Header.module.css";
import stylesForm from "../../Styles/Form.module.css";
import Navbar from "./Navbar";
import logo from "../../../public/logo.png";

const options = [
  { label: "Home", href: "/", dataid: "home-btn" },
  { label: "Accedi", href: "/account/pages/signin", dataid: "signin-btn" },
  {
    label: "Registrati",
    href: "/account/pages/signup",
    dataid: "signup-btn",
  },
];

function AccessDenied() {
  return (
    <>
      <Navbar />
      <div
        className={`${stylesHeader.headerContainer} ${stylesHeader.formPageLayout}`}
      >
        <Image src={logo} alt="Logo" width={150} className={stylesForm.logo}/>
        <h2 data-id="access-denied" className={stylesForm.accessDeniedTitle}>
          Accesso Negato
        </h2>
      </div>
    </>
  );
}

export default AccessDenied;
