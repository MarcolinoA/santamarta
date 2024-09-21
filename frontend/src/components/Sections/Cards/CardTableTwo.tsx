"use client";
import React, { useState } from "react";
import styles from "../../../Styles/Card.module.css";
import Card from "./Card";
import fattoriaDidattica from "../../../../public/fattoriaDidattica.jpeg";

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
		},
		{
			index: 2,
			title: "Doposcuola",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Psicomotricità.",
		},
		{
			index: 3,
			title: "Sportello Logopedico",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Inglese.",
		},
		{
			index: 4,
			title: "Sportello Pediatrico",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Religione.",
		},
		{
			index: 5,
			title: "Sportello Psicologico",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio Musicale.",
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
		<div className={styles.cardTable}>
			<h2 className={styles.cardTitle}>{cardTitle}</h2>
			<div className={styles.cardSection}>
				<div className={styles.cardGrid}>
					{cardArr
						.filter((card) => card.index !== activeCardIndex)
						.map((card) => (
							<Card
								key={card.index}
								onClick={() => handleCardClick(card.index)}
								cardName={card.title}
								cardNameWidth="200px"
								cardNameHeight="30px"
								width="250px"
								height="300px"
								img={card.img}
								alt={card.title}
								desc={card.desc}
								className={
									card.index === activeCardIndex ? styles.activeCard : ""
								}
								isFlipped={flippedCards.includes(card.index)} // Passa lo stato della rotazione
								onFlip={() => handleFlipCard(card.index)} // Funzione per gestire la rotazione
							/>
						))}
				</div>
				<div className={styles.cardLarge}>
					{cardArr.find((card) => card.index === activeCardIndex) && (
						<Card
							key={
								cardArr.find((card) => card.index === activeCardIndex)?.index
							}
							onClick={() => handleCardClick(activeCardIndex)}
							cardName={
								cardArr.find((card) => card.index === activeCardIndex)?.title ||
								""
							}
							cardNameWidth="200px"
							cardNameHeight="30px"
							width="500px"
							height="620px"
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
									? styles.activeCard
									: ""
							}
							isFlipped={flippedCards.includes(activeCardIndex)} // Passa lo stato della rotazione
							onFlip={() => handleFlipCard(activeCardIndex)} // Funzione per gestire la rotazione
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default CardTableTwo;
