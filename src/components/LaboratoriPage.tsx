"use client"
import React, { useState } from 'react';
import styles from "../Styles/LaboratoriPage.module.css";
import Card from './Card';
import fattoriaDidattica from "../../public/fattoriaDidattica.jpeg";

const LaboratoriPage = () => {
  const [activeCard, setActiveCard] = useState<boolean>(false);

  const cardArr = [
    {
      index: 1,
      title: 'Fattoria didattica',
      img: fattoriaDidattica,
      desc: 'test',
    },
    {
      index: 2,
      title: 'Laboratorio di psicomotricità',
      img: fattoriaDidattica,
      desc: 'test',
      bigger: true,
    },
    {
      index: 3,
      title: 'Laboratorio di inglese',
      img: fattoriaDidattica,
      desc: 'test',
    },
    {
      index: 4,
      title: 'Laboratorio di religione',
      img: fattoriaDidattica,
      desc: 'test',
    },
    {
      index: 5,
      title: 'Laboratorio musicale',
      img: fattoriaDidattica,
      desc: 'test',
    }
  ];

  // Funzione che gestisce il clic sulla card
  const handleCardClick = () => {
    setActiveCard(!activeCard); // Toggle della card attiva
  }

  return (
    <div className={styles.laboratori}>
      <h1 className={styles.title}>Laboratori</h1>
      <div className={styles.cardLayout}>
        {cardArr.map((card) => (
          <Card 
            key={card.index}
            onClick={() => handleCardClick()} // Passa una funzione
            cardName={card.title}
            cardNameWidth='200px'
            cardNameHeight='30px'
            width={activeCard ? '500px' : '250px'}
            height={activeCard ? '620px' : '300px'}
            img={card.img}
            alt={card.title}
            className={activeCard ? styles.activeCard : ''} // Condizionale per la classe
          />
        ))}
      </div>
    </div>
  );
}

export default LaboratoriPage;
