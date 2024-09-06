"use client"
import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'; // Importa useSearchParams
import test from '../../../public/test.jpg';
import styles from "../../Styles/HomePage.module.css"
import Navbar from './Navbar';
import Header from '../utils/Header';

const HomePage = () => {
  const options = [
    { label: 'Registrati', href: '/account/pages/signup' },
    { label: 'Accedi', href: '/account/pages/signin' },
    { label: 'Esci', href: '/account/pages/logout' },
    { label: 'Elimina', href: '/account/pages/deleteAccount' },
  ];

  const searchParams = useSearchParams();
  let username = '';

  if (searchParams) {
    username = searchParams.get('username') || '';
  }
  
  return (
    <div className={styles.homePageContainer}>
      <Navbar />
      <Image 
        src={test} 
        alt="test" 
        layout="fill" 
        objectFit="cover"
        quality={100}
        priority={true}
      />
      <Header isLoggedIn={true} username={username as string || ''} options={options}/>
    </div>
  );
}

export default HomePage;
