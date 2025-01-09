"use client";
import React, { useState } from "react";
import OverlayCardTable from "../shared/card/OverlayCardTable";
import stylesCard from "../../Styles/Card.module.css";
import stylesText from "../../Styles/Text.module.css";
import Carousel from "../shared/Carousel";
import img1 from "../../../public/festadelluva.jpeg";
import img2 from "../../../public/logo.png";
import img3 from "../../../public/fattoriaDidattica.jpeg";

const LaScuolaPage: React.FC = () => {
  const [cardArr, setCardArr] = useState([
    {
      index: 1,
      title: "Laboratori artistici e creativi e didattici",
      desc: "In allestimento.",
      img: "",
      alt: "Laboratori artistici e creativi",
      dataid: "laboratori",
    },
    {
      index: 2,
      title: "Sport e attività motorie",
      desc: "In allestimento.",
      img: "",
      alt: "Sport e attività motorie",
      dataid: "motoria",
    },
    {
      index: 3,
      title: "Accesso alla biblioteca scolastica",
      desc: "In allestimento.",
      img: "",
      alt: "Accesso alla biblioteca scolastica",
      dataid: "biblioteca",
    },
    {
      index: 4,
      title: "Uscite didattiche",
      desc: "In allestimento.",
      img: "",
      alt: "Uscite didattiche",
      dataid: "uscite",
    },
    {
      index: 5,
      title: "Supporto educativo e psicologico",
      desc: "In allestimento.",
      img: "",
      alt: "Supporto educativo e psicologico",
      dataid: "supporto",
    },
    {
      index: 6,
      title: "Servizi aggiuntivi ed extradidattici",
      desc: "In allestimento.",
      img: "",
      alt: "Servizi aggiuntivi ed extradidattici",
      dataid: "servizi",
    },
  ]);

  const [cardArrStaff, setCardArrStaff] = useState([
    {
      index: 1,
      title: "Sezione Arancione",
      desc: "Valentina D'Angelo",
      img: "",
      alt: "Sezione Arancione",
      dataid: "arancione",
    },
    {
      index: 2,
      title: "Sezione Blu",
      desc: "Lucia Giuliani",
      img: "",
      alt: "Sezione Blu",
      dataid: "blu",
    },
    {
      index: 3,
      title: "Sezione Gialla",
      desc: "Loriana Bonanni",
      img: "",
      alt: "Sezione Gialla",
      dataid: "gialla",
    },
    {
      index: 4,
      title: "Sezione Rossa",
      desc: "Daniela D'andrea",
      img: "",
      alt: "Sezione Rossa",
      dataid: "rossa",
    },
    {
      index: 5,
      title: "Sezione Verde",
      desc: "Sr. Lucy",
      img: "",
      alt: "Sezione Verde",
      dataid: "verde",
    },
    {
      index: 6,
      title: "Altro",
      desc: "<strong>Educatrice: </strong> <br /> Valentina Picchi <br /> Marizia Briamonte <br /><br /> <strong>IRC</strong> <br /> Sr. Viviana Miranda <br /><br /> <strong>MOTORIA</strong> <br /> Paolo Ciafrei <br /><br /> <strong>MUSICA</strong> <br /> Francesco Mollica",
      img: "",
      alt: "Altro",
      dataid: "Altro",
    },
  ]);

  const images = [
    { src: img1, alt: "Immagine 1" },
    { src: img2, alt: "Immagine 2" },
    { src: img3, alt: "Immagine 3" },
  ];
  return (
    <div>
      <div className={stylesText.laScuolaDesc}>
        <h1  className={stylesText.laScuolaTitle}>Cos'è Santa Marta</h1>
        <p className={stylesText.laScuolaP}>
          Santa Marta è una scuola parificata dell’Infanzia accoglie bambini dai
          3 ai 5 anni e promuove la formazione integrale del bambino/a nella sua
          unicità. Per questo, si pone come da indicazioni ministeriale le
          seguenti finalità: sviluppo dell’identità, sviluppo dell’autonomia,
          sviluppo delle competenze, sviluppo della cittadinanza.
        </p>
      </div>

      <Carousel images={images} />

      <OverlayCardTable
        cardTitle="La scuola è attrezzata di: "
        cardItems={cardArr}
        gridClassName={stylesCard.customGridClass2}
      />

      <OverlayCardTable
        cardTitle="Lo staff"
        cardItems={cardArrStaff}
        gridClassName={stylesCard.customGridClass2}
      />
    </div>
  );
};

export default LaScuolaPage;
