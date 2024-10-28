"use client";
import React, { useState } from "react";
import Card from "./Card";
import fattoriaDidattica from "../../../../public/fattoriaDidattica.jpeg";
import stylesCard from "../../../Styles/Card.module.css";

interface cardTableProps {
	cardTitle: string;
}

const CardTableTwo: React.FC<cardTableProps> = ({ cardTitle }) => {
	const [cardArr, setCardArr] = useState([
		{
			index: 1,
			title: "Centro Estivo",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione della Fattoria Didattica.",
			dataid: "data-1",
		},
		{
			index: 2,
			title: "Doposcuola",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Psicomotricità.",
			dataid: "data-1",
		},
		{
			index: 3,
			title: "Sportello Logopedico",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Inglese.",
			dataid: "data-1",
		},
		{
			index: 4,
			title: "Sportello Pediatrico",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Religione.",
			dataid: "data-1",
		},
		{
			index: 5,
			title: "Sportello Psicologico",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio Musicale.",
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
			<h2 className={stylesCard.cardTitle}>{cardTitle}</h2>
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
								fattoriaDidattica
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

export default CardTableTwo;
