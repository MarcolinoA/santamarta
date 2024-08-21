"use client"
import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'; // Importa useSearchParams
import test from '../../../public/test.jpg';
import styles from "../../Styles/HomePage.module.css"
import Navbar from './Navbar';
import Header from './Header';

const HomePage = () => {
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
      <Header isLoggedIn={true} username={username as string || ''} />
    </div>
  );
}

export default HomePage;
