import React from "react";
import Head from "next/head";
import DeleteAccountPage from "../../../../components/Account/DeleteAccountPage/DeleteAccountPage";

const Delete_Account = () => {
  return (
    <div>
      <Head>
        <title>Delete Account</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="stylesheet" href="h" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main>
        <DeleteAccountPage />
      </main>
    </div>
  );
};

export default Delete_Account;