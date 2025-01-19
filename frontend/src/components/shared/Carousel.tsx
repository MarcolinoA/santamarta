"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../Styles/Carousel.module.css";
import { StaticImageData } from "next/image";

interface CarouselProps {
  images: { src: string | StaticImageData; alt: string }[];
  autoScroll?: boolean; // Opzione per abilitare lo scorrimento automatico
  interval?: number; // Intervallo in millisecondi
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoScroll = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false); // Gestisce le transizioni
  const autoScrollRef = useRef<number | null>(null); // Riferimento per lo scorrimento automatico (numero o null)

  const totalImages = images.length;

  const getImageSrc = (src: string | StaticImageData): string => {
    return typeof src === "string" ? src : src.src;
  };

  const goToPrevious = () => {
    if (isTransitioning) return; // Blocca transizioni multiple
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const goToNext = () => {
    if (isTransitioning) return; // Blocca transizioni multiple
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const resetAutoScroll = () => {
    if (autoScrollRef.current !== null) {
      clearInterval(autoScrollRef.current); // Solo se il timer è attivo
    }
    if (autoScroll) {
      autoScrollRef.current = window.setInterval(() => {
        goToNext();
      }, interval);
    }
  };

  // Resetta il carosello quando si raggiunge una copia temporanea
  useEffect(() => {
    if (currentIndex === -1) {
      // Passa dall'immagine "clonata" finale all'ultima vera immagine
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalImages - 1); // Salta all'ultima vera immagine
      }, 300); // Tempo per la transizione
    } else if (currentIndex === totalImages) {
      // Passa dall'immagine "clonata" iniziale alla prima vera immagine
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0); // Salta alla prima vera immagine
      }, 300); // Tempo per la transizione
    } else {
      // Abilita le transizioni normali
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, totalImages]);

  // Effetto per scorrimento automatico
  useEffect(() => {
    resetAutoScroll();

    return () => {
      if (autoScrollRef.current !== null) clearInterval(autoScrollRef.current);
    };
  }, [currentIndex, autoScroll, interval]);

  const handleIndicatorClick = (index: number) => {
    if (isTransitioning) return; // Blocca transizioni multiple
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  return (
    <div
      className={styles.carouselContainer}
      onMouseLeave={resetAutoScroll} // Riprende lo scorrimento automatico quando il mouse lascia il carosello
    >
      {/* Contenitore delle immagini con transizione */}
      <div
        className={styles.imageContainer}
        style={{
          transform: `translate3d(-${(currentIndex + 1) * 100}%, 0, 0)`,
          transition: isTransitioning ? "transform 0.3s ease-in-out" : "none",
        }}
      >
        {/* Aggiunta immagine clonata finale all'inizio */}
        <div className={styles.imageWrapper}>
          <img
            src={getImageSrc(images[totalImages - 1].src)}
            alt={images[totalImages - 1].alt}
            className={styles.image}
          />
        </div>

        {/* Immagini principali */}
        {images.map((image, index) => (
          <div key={index} className={styles.imageWrapper}>
            <img
              src={getImageSrc(image.src)}
              alt={image.alt}
              className={styles.image}
            />
          </div>
        ))}

        {/* Aggiunta immagine clonata iniziale alla fine */}
        <div className={styles.imageWrapper}>
          <img
            src={getImageSrc(images[0].src)}
            alt={images[0].alt}
            className={styles.image}
          />
        </div>
      </div>

      {/* Indicatori */}
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => handleIndicatorClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;