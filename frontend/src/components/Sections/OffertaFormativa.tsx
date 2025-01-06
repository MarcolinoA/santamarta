"use client";
import React, { useState } from "react";
import stylesCard from "../../Styles/Card.module.css";
import Card from "../shared/Card";
import fattoriaDidattica from "../../../public/fattoriaDidattica.jpeg";
import Overlay from "../shared/Overlay";

interface cardTableProps {
  cardTitle: string;
}

const OffertaFormativa: React.FC<cardTableProps> = ({ cardTitle }) => {
  const [cardArr, setCardArr] = useState([
    {
      index: 2,
      title: "Piano Triennale",
      desc: "In allestimento.",
      img: fattoriaDidattica,
      alt: "Piano Triennale",
      dataid: "piano-triennale",
      pdf: "",
    },
    {
      index: 1,
      title: "Progetto didattico speciale",
      desc: "In allestimento.",
      img: fattoriaDidattica,
      alt: "Progetto didattico speciale",
      dataid: "prog-didattico-speciale",
      pdf: "",
    },

    {
      index: 3,
      title: "Patto di corresponsabilità",
      desc: "In allestimento.",
      img: fattoriaDidattica,
      alt: "Patto di corresponsabilita",
      dataid: "patto-di-corresponsabilita",
      pdf: "",
    },
  ]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<(typeof cardArr)[0] | null>(
    null
  );

  const handleCardClick = (card: (typeof cardArr)[0]) => {
    setSelectedCard(card);
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
    setSelectedCard(null);
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
              onClick={() => handleCardClick(card)}
              cardName={card.title}
              img={card.img}
              alt={card.title}
              isSquare={true}
            />
          ))}
      </div>

      <Overlay
        isVisible={overlayVisible}
        title={selectedCard?.title || ""}
        description={selectedCard?.desc || ""}
        pdf={selectedCard?.pdf}
        onClose={closeOverlay}
      />
    </div>
  );
};

export default OffertaFormativa;
