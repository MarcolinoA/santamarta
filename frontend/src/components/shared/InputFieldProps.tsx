import React from "react";
import style from "../../Styles/Login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputFieldProps {
    id: string;
    dataid: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    required?: boolean;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    togglePasswordVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    dataid,
    name,
    type,
    value,
    onChange,
    label,
    required = false,
    showPasswordToggle = false,
    showPassword,
    togglePasswordVisibility,
}) => {
    return (
        <div className={style.formGroup}>
            <label htmlFor={id} className={style.formLabel}>
                {label}
            </label>
            <div className={style.passwordInputWrapper}>
                <input
                    data-id={dataid}
                    type={showPasswordToggle && showPassword ? "text" : type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={style.formInput}
                    autoComplete={type === "password" ? "new-password" : undefined}
                />
                {showPasswordToggle && (
                    <button
                        data-id="passwordToggle"
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={style.passwordToggle}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;