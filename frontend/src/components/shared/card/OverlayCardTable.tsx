"use client";
import React, { useState } from "react";
import stylesCard from "../../../Styles/Card.module.css";
import stylesText from "../../../Styles/Text.module.css";
import Card from "./Card";
import Overlay from "./Overlay";
import { StaticImageData } from "next/image";

interface CardItem {
  index: number;
  title: string;
  desc: string;
  img: string | StaticImageData; // Può essere una stringa (URL) o un'immagine statica importata
  alt: string;
  dataid: string;
  pdf?: string; // Opzionale: link al PDF o altro file
}

interface OverlayCardTableProps {
  cardTitle: string;
  cardItems: CardItem[];
  gridClassName: string;
}

const OverlayCardTable: React.FC<OverlayCardTableProps> = ({ cardTitle, cardItems, gridClassName }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  const handleCardClick = (card: CardItem) => {
    setSelectedCard(card);
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
    setSelectedCard(null);
  };

  return (
    <div className={stylesCard.cardTable}>
      <h2 className={stylesText.titles}>{cardTitle}</h2>
      <div className={gridClassName}>
        {cardItems
          .filter((card) => card.index) // Facoltativo: se hai bisogno di filtrare per l'indice
          .map((card) => (
            <Card
              dataid={card.dataid}
              key={card.index}
              onClick={() => handleCardClick(card)}
              cardName={card.title}
              img={card.img}
              alt={card.alt}
              isSquare={true}
              isFlippable={false}
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

export default OverlayCardTable;
