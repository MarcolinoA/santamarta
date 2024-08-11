import React from 'react';
import Image from 'next/image';
import test from '../../public/test.jpg';
import styles from '../styles/HomePage.module.css';
import Navbar from './Navbar';

const HomePage = () => {
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
    </div>
  );
}

export default HomePage;