"use client";
import React, { useState } from "react";
import styles from "../../Styles/Carousel.module.css"; 
import { StaticImageData } from "next/image";
import stylesCarousel from "../../Styles/HomePage/Header.module.css";

interface CarouselProps {
  images: { src: string | StaticImageData; alt: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Ottieni la sorgente come stringa
  const getImageSrc = (src: string | StaticImageData): string => {
    return typeof src === "string" ? src : src.src; // Usa la proprietà src di StaticImageData
  };

  return (
    <div className={styles.carouselContainer}>
      {/* Freccia sinistra */}
      <button className={styles.arrowLeft} onClick={goToPrevious}>
        ◀
      </button>

      {/* Immagine corrente */}
      <div className={styles.carouselContainer}>
        <img
          src={getImageSrc(images[currentIndex].src)}
          alt={images[currentIndex].alt}
          className={stylesCarousel.customImage}
        />
      </div>

      {/* Freccia destra */}
      <button className={styles.arrowRight} onClick={goToNext}>
        ▶
      </button>

      {/* Indicatori */}
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
