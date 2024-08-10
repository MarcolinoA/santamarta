"use client"
import React, { useEffect, useRef, useState } from 'react';
import styles from "../Styles/Card.module.css";
import Image, { StaticImageData } from 'next/image';

interface CardProps {
  img: StaticImageData;
  alt: string;
  width?: number | string;
  height?: number | string;
  cardNameWidth?: string;
  cardNameHeight?: string;
  cardName: string;
  onClick?: () => void; // Aggiungi questa proprietà
  className?: string; // Anche className se necessario
}

const Card: React.FC<CardProps> = ({ img, alt, width, height, cardNameWidth, cardNameHeight, cardName, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Adjust the threshold as needed
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Convert cardNameWidth and cardNameHeight to a style object
  const cardNameStyle = {
    width: cardNameWidth,
    height: cardNameHeight,
  };

  return (
    <div 
      ref={cardRef} 
      className={`${styles.CardContainer} ${isVisible ? styles.visible : ''}`} 
      style={{ width, height }}
      onClick={onClick}
    >
      <Image 
        src={img} 
        alt={alt}
        layout="fill" 
        objectFit="cover"
        quality={100}
        priority={true}
      />

      <div className={styles.cardName} style={cardNameStyle}>{cardName}</div>
    </div>
  );
}

export default Card;
