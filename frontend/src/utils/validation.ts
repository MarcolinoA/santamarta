interface FormData {
	name?: string;
	surname?: string;
	username?: string;
	password?: string;
	email?: string;
}

interface Errors {
	name?: string;
	surname?: string;
	username?: string;
	password?: string;
	email?: string;
	confirmPassword?: string;
	confirmEmail?: string;
	form?: string;
}

// Aggiungi un parametro `isSignUp` per distinguere tra login e registrazione
export const validateForm = (
	formData: FormData, 
	confirmPassword?: string, 
	confirmEmail?: string, 
	isSignUp: boolean = true // True per la registrazione, False per il login
): Errors => {
	const errors: Errors = {};

	// Se `isSignUp` è true, validiamo anche i campi aggiuntivi per la registrazione
	if (isSignUp) {
		if (!formData.name) errors.name = "Il nome è obbligatorio";
		if (!formData.surname) errors.surname = "Il cognome è obbligatorio";
		if (!formData.email) errors.email = "L'email è obbligatoria";
		if (formData.email !== confirmEmail) {
			errors.confirmEmail = "Le email non corrispondono";
		}
		if (formData.password !== confirmPassword) {
			errors.confirmPassword = "Le password non corrispondono";
		}
	}

	// Validazione per `username` e `password` (comune a entrambe le pagine)
	if (!formData.username) errors.username = "Lo username è obbligatorio";
	if (!formData.password) errors.password = "La password è obbligatoria";

	return errors;
};
