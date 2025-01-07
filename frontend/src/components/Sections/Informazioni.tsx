"use client";
import React, { useState } from "react";
import stylesCard from "../../Styles/Card.module.css";
import Overlay from "../shared/Overlay";
import fattoriaDidattica from "../../../public/fattoriaDidattica.jpeg";
import Card from "../shared/Card";

interface cardTableProps {
  cardTitle: string;
}

const Informazioni: React.FC<cardTableProps> = ({ cardTitle }) => {
  const [cardArr] = useState([
    {
      index: 2,
      title: "Orari",
      desc: "martedì - giovedì e venerdì <br> 8.00 - 9.30 // 15.45 - 17.00",
      img: fattoriaDidattica,
      alt: "Laboratorio di Psicomotricità Image",
      dataid: "orari",
    },
    {
      index: 1,
      title: "Calendario Scolastico",
      desc: "Scarica il calendario scolastico in formato pdf.",
      img: fattoriaDidattica,
      alt: "Fattoria Didattica Image",
      dataid: "calendario-scolastico",
      pdf: "/calendario.pdf",
    },
    {
      index: 3,
      title: "Eventi",
      desc: "• Tempo di vendemmia <br> • Castagnata • Piantiamo un albero <br> • Visita al frantoio <br> • Andiamo a teatro <br> • Alla scoperta del miele",
      img: fattoriaDidattica,
      alt: "Laboratorio di Inglese Image",
      dataid: "eventi",
    },
  ]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof cardArr[0] | null>(
    null
  );

  const handleCardClick = (card: typeof cardArr[0]) => {
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
        {cardArr.map((card) => (
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

export default Informazioni;
