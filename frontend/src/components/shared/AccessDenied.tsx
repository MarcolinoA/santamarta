import Image from "next/image";
import React from "react";
import logo from "../../../public/logo.png";
import HeaderBtn from "./btns/HeaderBtn";
import stylesHeader from "../../Styles/HomePage/Header.module.css";
import stylesForm from "../../Styles/Form.module.css";
import Navbar from "./Navbar";

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
        <Image src={logo} alt="Logo" width={150} />
        <h2 data-id="access-denied" className={stylesForm.formTitle}>
          Accesso Negato
        </h2>
        <p data-id="session-expired">
          Sessione scaduta. Effettua nuovamente il login.
        </p>
      </div>
    </>
  );
}

export default AccessDenied;
