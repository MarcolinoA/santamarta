import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import stylesForm from "../../Styles/Form.module.css";

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
    <div className={stylesForm.formGroup}>
      <label htmlFor={id} className={stylesForm.formLabel}>
        {label}
      </label>
      <div className={stylesForm.passwordInputWrapper}>
        <input
          data-id={dataid}
          type={showPasswordToggle && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={stylesForm.formInput}
          autoComplete={type === "password" ? "new-password" : undefined}
        />
        {showPasswordToggle && (
          <button
            data-id="passwordToggle"
            type="button"
            onClick={togglePasswordVisibility}
            className={stylesForm.passwordToggle}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
