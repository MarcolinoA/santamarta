"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "../../../hooks/useAuthentications";
import FormPageLayout from "../../shared/FormPageLayout";
import AccessDenied from "../../shared/AccessDenied";

const LogoutC: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false); // Aggiunto stato per rilevare se siamo lato client
  const router = useRouter();
  const { isAuthenticated, username, logout } = useAuthentication();

  useEffect(() => {
    // Imposta isClient su true una volta che siamo nel client
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/users/logout`,
        {
          method: "POST",
          credentials: "include", // Assicurati che i cookie siano inviati
        }
      );

      if (response.ok) {
        logout(); // Chiama la funzione di logout
        router.push("/"); // Reindirizza alla homepage
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message || "Unknown error");
        setError(errorData.message || "Logout failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Logout error:", error); // Logga l'errore
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Se non è client-side, non renderizzare nulla
  if (!isClient) {
    return null;
  }

  // Se non autenticato, mostra AccessDenied
  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  // Se autenticato, mostra il form di logout
  return (
    <FormPageLayout
      title="Logout"
      error={error}
      loading={loading}
      onSubmit={handleLogout}
      buttonText="Logout"
      loadingText="Logging out..."
      isAuthenticated={isAuthenticated}
      username={username || ""}
      options={[{ label: "Home", href: "/", dataid: "home-btn" }]}
      buttonDataId="logout-btn"
      formDataId="logoutForm"
      errorDataId="logout-err-msg"
    />
  );
};

export default LogoutC;
