"use client";
import logo from "../../../../public/logo.png"
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import Image from 'next/image';

const AccountVerificationPage: React.FC = () => {
  return (
    <div className={stylePage.homePageContainer}>
      <form className={style.form}>
				<Image src={logo} alt="Logo" width={150} />
        <h2 className={style.formTitle}>Controlla il tuo indirizzo di posta elettronico</h2>
				<p className={style.desc}>Abbiamo inviato un'email di conferma all'account che hai usato per iscriverti, fai click sul link per completare registrazione!</p>
      </form>
    </div>
  );
};

export default AccountVerificationPage;
