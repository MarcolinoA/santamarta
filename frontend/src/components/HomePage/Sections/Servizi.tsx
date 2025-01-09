"use client";
import React, { useState } from "react";
import stylesCard from "../../../Styles/Card.module.css";
import stylesText from "../../../Styles/Text.module.css";
import centroEstivo from "../../../../public/servizi/CentroEstivo.png";
import sportelloLogopedico from "../../../../public/servizi/SportelloLogopedico.jpg";
import sportelloPediatrico from "../../../../public/servizi/SportelloPediatrico.jpg";
import sportelloPsicologico from "../../../../public/servizi/SportelloPsicologico.jpg";
import doposcuola from "../../../../public/servizi/Doposcuola.jpg";
import Card from "../../shared/card/Card";

interface cardTableProps {
	cardTitle: string;
}

const Servizi: React.FC<cardTableProps> = ({ cardTitle }) => {
	const [cardArr, setCardArr] = useState([
		{
			index: 1,
			title: "Centro Estivo",
			img: centroEstivo,
			desc: [
				"Il Centro Estivo “Ci vuole un sorriso” offre due periodi di attività:",
				"<strong>Giugno</strong>: Laboratori creativi, tra cui cucina (imparare a fare la pizza), musica, inglese, piscina, giochi d'acqua, orto e fattoria didattica, attività motorie e uscite guidate.",
				"<strong>Luglio</strong>: Servizio di accompagnamento al mare per bambini dell’Infanzia e Primaria, in convenzione con lo stabilimento “Bagno Marina” di Foceverde (LT)."
			],
			dataid: "data-1",
		},
		{
			index: 2,
			title: "Doposcuola",
			img: doposcuola,
			desc: [
				"Il servizio <strong>Doposcuola</strong> è attivo dal lunedì al venerdì. Prevede: un pranzo, tempo di gioco nel giardino attrezzato (dedicato ai bambini della primaria) e supporto per lo svolgimento dei compiti sotto la supervisione di personale qualificato. <br /> Servizi aggiuntivi:<br /><strong>• Pre e Post Scuola</strong><br /><strong>• Navetta</strong>: Per il plesso “Paganico” servizio all'ingresso e all'uscita della scuola; per il plesso “Collepalazzo” è garantita la presenza di una responsabile per l’accompagnamento presso la nostra sede, supporto fornito da Velibus."
		],
			dataid: "data-1",
		},
		{
			index: 3,
			title: "Sportello Logopedico",
			img: sportelloLogopedico,
			desc: [
				"In allestimento",
			],
			dataid: "data-1",
		},
		{
			index: 4,
			title: "Sportello Pediatrico",
			img: sportelloPediatrico,
			desc: [
				"Il nostro Istituto si avvale della collaborazione della <strong>Dott.ssa Stefania Cingolani</strong>, Pediatra, che fornisce assistenza in caso di necessità sanitarie. La dottoressa è disponibile su appuntamento, in giorni stabiliti ogni mese, per intervenire nelle situazioni che richiedono un consulto medico. Oltre a fornire indicazioni specifiche per la gestione di eventuali problematiche di salute, offre supporto e consigli sia alle educatrici sia ai genitori, garantendo un percorso educativo sicuro e orientato al benessere dei bambini."
			],
			dataid: "data-1",
		},
		{
			index: 5,
			title: "Sportello Psicologico",
			img: sportelloPsicologico,
			desc: [
				"Il <strong>Dott. Giorgio Caponera</strong>, da qualche anno accompagna il collegio docenti come consulente esterno.",
				"Il servizio è a disposizione di chiunque voglia confrontarsi su temi legati alla crescita dei propri figli e alla relazione educativa tra adulti e bambini. Lo sportello offre supporto, sostegno e ascolto per affrontare insieme le sfide educative nel pieno rispetto della normativa sulla privacy.",
			],
			dataid: "data-1",
		},
	]);

	const [activeCardIndex, setActiveCardIndex] = useState<number>(1);
	const [flippedCards, setFlippedCards] = useState<number[]>([]);

	const handleCardClick = (index: number) => {
		if (index === activeCardIndex) return;

		const updatedCards = [...cardArr];
		const clickedCardIndex = updatedCards.findIndex(
			(card) => card.index === index
		);
		const activeCard = updatedCards.find(
			(card) => card.index === activeCardIndex
		);

		if (activeCard) {
			// Ripristina la card attiva al lato frontale se è ruotata
			setFlippedCards((prevFlipped) =>
				prevFlipped.filter((i) => i !== activeCardIndex)
			);

			// Scambia le card
			[updatedCards[0], updatedCards[clickedCardIndex]] = [
				updatedCards[clickedCardIndex],
				updatedCards[0],
			];
		}

		// Aggiorna lo stato per mantenere la card nuova (ora grande) con il lato della foto
		setFlippedCards((prevFlipped) => prevFlipped.filter((i) => i !== index));

		setCardArr(updatedCards);
		setActiveCardIndex(index);
	};

	const handleFlipCard = (index: number) => {
		setFlippedCards((prevFlipped) =>
			prevFlipped.includes(index)
				? prevFlipped.filter((i) => i !== index)
				: [...prevFlipped, index]
		);
	};

	return (
		<div className={stylesCard.cardTable}>
			<h2 className={stylesText.titles}>{cardTitle}</h2>
			<div className={stylesCard.cardSection}>
				<div className={stylesCard.cardGrid}>
					{cardArr
						.filter((card) => card.index !== activeCardIndex)
						.map((card) => (
							<Card
								dataid={card.dataid}
								key={card.index}
								onClick={() => handleCardClick(card.index)}
								cardName={card.title}
								img={card.img}
								alt={card.title}
								desc={card.desc} 
								className={
									card.index === activeCardIndex ? stylesCard.activeCard : ""
								}
								isLarge={card.index === activeCardIndex}
								isFlipped={flippedCards.includes(card.index)}
								onFlip={() => handleFlipCard(card.index)}
							/>
						))}
				</div>
				<div className={stylesCard.cardLarge}>
					{cardArr.find((card) => card.index === activeCardIndex) && (
						<Card
							dataid={
								cardArr.find((card) => card.index === activeCardIndex)
									?.dataid || " "
							}
							key={
								cardArr.find((card) => card.index === activeCardIndex)?.index
							}
							onClick={() => handleCardClick(activeCardIndex)}
							cardName={
								cardArr.find((card) => card.index === activeCardIndex)?.title ||
								""
							}
							img={
								cardArr.find((card) => card.index === activeCardIndex)?.img ||
								""
							}
							alt={
								cardArr.find((card) => card.index === activeCardIndex)?.title ||
								""
							}
							desc={
								cardArr.find((card) => card.index === activeCardIndex)?.desc ||
								""
							}
							className={
								cardArr.find((card) => card.index === activeCardIndex)
									?.index === activeCardIndex
									? stylesCard.activeCard
									: ""
							}
							isFlipped={flippedCards.includes(activeCardIndex)} // Passa lo stato della rotazione
							onFlip={() => handleFlipCard(activeCardIndex)} // Funzione per gestire la rotazione
							isLarge={true}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Servizi;
