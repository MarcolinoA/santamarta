import React from 'react';
import Image from 'next/image';
import Header from './Header';
import logo from "../../../public/logo.png";
import style from "../../Styles/Login.module.css";
import stylePage from "../../Styles/HomePage/Header.module.css";

interface FormPageLayoutProps {
    title: string;
    error?: string | null;
    loading: boolean;
    onSubmit: () => void;
    buttonText: string;
    loadingText: string;
    isAuthenticated: boolean;
    username: string;
    options: { label: string, href: string, dataid: string }[];
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
    isAuthenticated,
    username,
    options,
    buttonDataId,
    formDataId,
    errorDataId,
}) => {
    return (
        <div className={stylePage.headerContainer}>
            <Image src={logo} alt="Logo" width={150} />
            <h2 data-id="page-title" className={style.formTitle}>{title}</h2>
            {error && <div data-id={errorDataId} className={style.errorMessage}>{error}</div>}
            <form data-id={formDataId} onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className={style.form}>
                <button
                    data-id={buttonDataId}
                    type="submit"
                    className={style.formButton}
                    disabled={loading}
                >
                    {loading ? loadingText : buttonText}
                </button>
            </form>
            <Header
                isLoggedIn={isAuthenticated}
                username={username}
                options={options}
            />
        </div>
    );
};

export default FormPageLayout;
