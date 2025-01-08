"use client";
import React, { useState } from "react";
import fattoriaDidattica from "../../../../public/fattoriaDidattica.jpeg";
import OverlayCardTable from "../../shared/card/OverlayCardTable";
import stylesCard from "../../../Styles/Card.module.css";

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

  return (
    <div>
      <OverlayCardTable cardTitle="Informazioni" cardItems={cardArr} gridClassName={stylesCard.customGridClass1}/>
    </div>
  );
};

export default Informazioni;
