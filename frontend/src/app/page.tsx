import React from "react";
import Head from "next/head";
import HomePage from "../components/HomePage/HomePage";
import styles from "../styles/HomePage.module.css";
import CardTable from "../components/CardTable";
import Script from "next/script";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="stylesheet" href="h" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
<Script
  src="https://www.google.com/recaptcha/enterprise.js?render=explicit"
  strategy="beforeInteractive"
/>      </Head>

      <main className={styles.main}>
        <HomePage />
      </main>

      <div>
        <CardTable cardTitle="Laboratori"/>

        <CardTable cardTitle="Servizi"/>
      </div>

      <footer>
        <p>footer</p>
      </footer>
    </div>
  );
};

export default Home;