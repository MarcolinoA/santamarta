"use client";
import logo from "../../../../public/logo.png";
import stylePage from "../../../Styles/HomePage.module.css";
import style from "../../../Styles/Login.module.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const VerificationSuccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className={stylePage.homePageContainer}>
      <form className={style.form} onSubmit={(e) => e.preventDefault()}>
        <Image src={logo} alt="Logo" width={150} />
        <h2 className={style.formTitle}>Verifica completata</h2>
        <button type="button" className={style.formButton} onClick={() => router.push('/account/signin')}>
          Accedi all'account
        </button>
      </form>
    </div>
  );
};

export default VerificationSuccessPage;

