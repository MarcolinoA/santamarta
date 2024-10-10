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

/**. 
 * 
 * Unit Test
Questi test si concentrano su singoli aspetti del componente.

Toggle visibilità password:

Verifica che il pulsante per alternare la visibilità della password venga renderizzato solo quando showPasswordToggle={true}.
Verifica che il tipo di input cambi da password a text (o viceversa) quando si clicca sul pulsante per visualizzare/nascondere la password.
Callback di onChange:

Verifica che la funzione onChange venga chiamata correttamente quando l'utente digita qualcosa nel campo di input.
2. Integration Test
Testa il comportamento del componente insieme agli altri elementi con cui interagisce.

Comportamento del bottone di visibilità:

Verifica che l'icona di FaEye venga mostrata quando showPassword={false} e che cambi in FaEyeSlash quando showPassword={true}.
Simula il click sul bottone di visibilità e verifica che la funzione togglePasswordVisibility venga chiamata.
Validazione dell'input:

Verifica che il componente rispetti la proprietà required. Se il campo è obbligatorio e l'utente non inserisce alcun valore, l'attributo required dovrebbe essere presente.
3. E2E Test (End-to-End)
Se integrato in un form più grande, puoi fare dei test end-to-end per simulare l'interazione dell'utente.

Interazione completa:
Simula la digitazione nel campo e verifica che il valore cambi correttamente.
Se showPasswordToggle={true}, simula il click sull'icona e verifica che il testo diventi visibile quando la password è mostrata. */