"use client";
import React, { useState } from "react";
import stylesCard from "../../Styles/Card.module.css";
import Card from "../shared/Card";
import fattoriaDidattica from "../../../public/fattoriaDidattica.jpeg";

interface cardTableProps {
  cardTitle: string;
}

const Informazioni: React.FC<cardTableProps> = ({ cardTitle }) => {
  const [cardArr, setCardArr] = useState([
    {
      index: 2,
      title: "Orari",
      img: fattoriaDidattica,
      alt: "Laboratorio di Psicomotricità Image",
      dataid: "orari",
    },
    {
      index: 1,
      title: "Calendario Scolastico",
      img: fattoriaDidattica,
      alt: "Fattoria Didattica Image",
      dataid: "calendario-scolastico",
    },

    {
      index: 3,
      title: "Eventi",
      img: fattoriaDidattica,
      alt: "Laboratorio di Inglese Image",
      dataid: "eventi",
    },
  ]);

  const handleCardClick = () => {
    return <div>Test</div>;
  };

  return (
    <div className={stylesCard.cardTable}>
      <h2 className={stylesCard.cardTitle}>{cardTitle}</h2>
      <div className={stylesCard.cardSection}>
        {cardArr
          .filter((card) => card.index)
          .map((card) => (
            <Card
              dataid={card.dataid}
              key={card.index}
              onClick={() => handleCardClick()}
              cardName={card.title}
              img={card.img}
              alt={card.title}
              isSquare={true}
            />
          ))}
      </div>
    </div>
  );
};

export default Informazioni;
