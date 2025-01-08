"use client";
import React, { useState } from "react";
import fattoriaDidattica from "../../../../public/fattoriaDidattica.jpeg";
import OverlayCardTable from "../../shared/card/OverlayCardTable";
import stylesCard from "../../../Styles/Card.module.css";

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

  return (
    <div>
      <OverlayCardTable cardTitle="Offerta Formativa" cardItems={cardArr} gridClassName={stylesCard.customGridClass1}/>
    </div>
  );
};

export default OffertaFormativa;
