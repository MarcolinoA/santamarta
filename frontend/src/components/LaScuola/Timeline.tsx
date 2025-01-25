"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../Styles/Timeline.module.css";
import stylesText from "../../Styles/Text.module.css";

const Timeline: React.FC = () => {
  const events = [
    {
      date: "1960",
      title: "IL NOVIZIATO",
      description:
        "Le prime testimonianze del lavoro svolto a Casa Betania risalgono al 1960, quando inizia nella Casa, non nuova e da ristrutturare, l'attività di noviziato. Le novizie furono le prime ad abitare i locali di Casa Betania e vi rimasero fino all'ottobre 1965.",
    },
    {
      date: "1966",
      title: "INIZIO DEL CONVITTO",
      description:
        "Nel 1966 cominciò a funzionare il convitto per le bambine provenienti da famiglie orfane o disagiate.",
    },
    {
      date: "1975/1980",
      title: "SCUOLA ELEMENTARE",
      description:
      "Negli anni 1975/1980, alcuni locali furono concessi in affitto al Comune di Velletri in difficoltà, per reperire ambienti da destinare alla Scuola elementare di Paganico.",
    },
    {
      date: "1982",
      title: "NASCE LA SCUOLA MATERNA",
      description:
        "Negli anni '80 l'internato diminuì progressivamente, mentre cresceva la richiesta di una scuola materna e servizi per la prima infanzia. Così, nel 1982, furono istituite due sezioni di scuola materna approvate dalle autorità, seguite da un semiconvitto per bambini delle elementari con mensa, doposcuola e attività formative.",
    },
    {
      date: "2002",
      title: "DIVENTA PARITARIA",
      description:
        "Con decreto del 22 febbraio n. 3487 il Ministero della Pubblica Istruzione ha riconosciuto alla scuola dell'Infanzia lo status di Scuola Paritaria.",
    },
    {
      date: "2003/2004",
      title: "NUOVA STRUTTURA",
      description:
        "Nell'anno 2003/2004 la Scuola dell'Infanzia fa il suo primo ingresso nella struttura costruita secondo le norme vigenti.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentEvent = events[currentIndex];

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineContent}>
        <button
          className={styles.arrowButton}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft/>
        </button>

        <div className={styles.timelineEvent}>
          <div className={stylesText.laScuolaTitle}>{currentEvent.date}</div>
          <div className={styles.eventContent}>
            <h4 className={`${stylesText.laScuolaTitle} ${stylesText.timeline}`}>{currentEvent.title}</h4>
            <p className={stylesText.laScuolaP}>{currentEvent.description}</p>
          </div>
        </div>

        <button
          className={styles.arrowButton}
          onClick={handleNext}
          disabled={currentIndex === events.length - 1}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Timeline;
