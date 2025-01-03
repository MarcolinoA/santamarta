"use client";
import React, { useState } from "react";
import stylesCard from "../../Styles/Card.module.css";
import Card from "../shared/Card";
import fattoriaDidattica from "../../../public/fattoriaDidattica.jpeg";

interface cardTableProps {
	cardTitle: string;
}

const Laboratori: React.FC<cardTableProps> = ({ cardTitle }) => {
	const [cardArr, setCardArr] = useState([
		{
			index: 1,
			title: "Fattoria didattica",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione della Fattoria Didattica.",
			alt: "Fattoria Didattica Image",
			dataid: "fattoria-didattica",
		},
		{
			index: 2,
			title: "Laboratorio di psicomotricità",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Psicomotricità.",
			alt: "Laboratorio di Psicomotricità Image",
			dataid: "laboratorio-psicomotricita",
		},
		{
			index: 3,
			title: "Laboratorio di inglese",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Inglese.",
			alt: "Laboratorio di Inglese Image",
			dataid: "laboratorio-inglese",
		},
		{
			index: 4,
			title: "Laboratorio di religione",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio di Religione.",
			alt: "Laboratorio di Religione Image",
			dataid: "laboratorio-religione",
		},
		{
			index: 5,
			title: "Laboratorio musicale",
			img: fattoriaDidattica,
			desc: "Questa è la descrizione del Laboratorio Musicale.",
			alt: "Laboratorio Musicale Image",
			dataid: "laboratorio-musicale",
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
			</div>
		</div>
	);
};

export default Laboratori;
