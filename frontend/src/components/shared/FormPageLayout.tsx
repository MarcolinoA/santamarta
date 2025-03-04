import React from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";
import stylesHeader from "../../Styles/HomePage/Header.module.css";
import stylesForm from "../../Styles/Form.module.css";
import Navbar from "./Navbar";
import { Fjalla_One } from "next/font/google";

const fjalla = Fjalla_One({
  subsets: ["latin"],
  weight: "400",
});

interface FormPageLayoutProps {
  title: string;
  error?: string | null;
  loading: boolean;
  onSubmit: () => void;
  buttonText: string;
  loadingText: string;
  isAuthenticated: boolean;
  username: string;
  options: { label: string; href: string; dataid: string }[];
  buttonDataId: string;
  formDataId: string;
  errorDataId: string;
}

const FormPageLayout: React.FC<FormPageLayoutProps> = ({
  title,
  error,
  loading,
  onSubmit,
  buttonText,
  loadingText,
  buttonDataId,
  formDataId,
  errorDataId,
}) => {
  return (
    <>
      <Navbar />
      <div
        className={`${stylesHeader.headerContainer} ${stylesHeader.formPageLayout} ${fjalla.className}`}
      >
        <form
          data-id={formDataId}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className={stylesForm.form}
        >
        <Image src={logo} alt="Logo" width={150} />
        <h2 data-id="page-title" className={stylesForm.formTitle}>
          {title}
        </h2>
        {error && (
          <div data-id={errorDataId} className={stylesForm.errorMessage}>
            {error}
          </div>
        )}
          <button
            data-id={buttonDataId}
            type="submit"
            className={`${stylesForm.formButton} ${fjalla.className}`}
            disabled={loading}
          >
            {loading ? loadingText : buttonText}
          </button>
        </form>
      </div>
    </>
  );
};

export default FormPageLayout;
