"use client";
import React, { useState } from "react";
import stylesCard from "../../Styles/Card.module.css";
import Card from "../shared/Card";
import fattoriaDidattica from "../../../public/fattoriaDidattica.jpeg";

interface cardTableProps {
  cardTitle: string;
}

const OffertaFormativa: React.FC<cardTableProps> = ({ cardTitle }) => {
  const [cardArr, setCardArr] = useState([
    {
      index: 2,
      title: "Piano Triennale",
      img: fattoriaDidattica,
      alt: "Piano Triennale",
      dataid: "piano-triennale",
    },
    {
      index: 1,
      title: "Progetto didattico speciale",
      img: fattoriaDidattica,
      alt: "Progetto didattico speciale",
      dataid: "prog-didattico-speciale",
    },

    {
      index: 3,
      title: "Patto di corresponsabilità",
      img: fattoriaDidattica,
      alt: "Patto di corresponsabilita",
      dataid: "patto-di-corresponsabilita",
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

export default OffertaFormativa;