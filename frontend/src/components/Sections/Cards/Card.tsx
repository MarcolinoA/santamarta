"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../../Styles/Card.module.css";
import Image, { StaticImageData } from "next/image";

interface CardProps {
	img: string | StaticImageData;
	alt: string;
	width?: number | string;
	height?: number | string;
	cardNameWidth?: string;
	cardNameHeight?: string;
	cardName: string;
	desc?: string;
	onClick?: () => void;
	className?: string;
	isFlipped?: boolean; // Nuovo prop per indicare se la card è ruotata
	onFlip?: () => void; // Nuovo prop per gestire la rotazione
}

const Card: React.FC<CardProps> = ({
	img,
	alt,
	width,
	height,
	cardNameWidth,
	cardNameHeight,
	cardName,
	desc,
	onClick,
	className,
	isFlipped = false, // Default: non ruotata
	onFlip,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.1 }
		);

		if (cardRef.current) {
			observer.observe(cardRef.current);
		}

		return () => {
			if (cardRef.current) {
				observer.unobserve(cardRef.current);
			}
		};
	}, []);

	const cardNameStyle = {
		width: cardNameWidth,
		height: cardNameHeight,
	};

	const handleClick = () => {
		if (onFlip) onFlip(); // Chiama la funzione onFlip per gestire la rotazione
		if (onClick) onClick();
	};

	return (
		<div
			ref={cardRef}
			className={`${styles.CardContainer} ${isVisible ? styles.visible : ""} ${isFlipped ? styles.flipped : ""} ${className}`}
			style={{ width, height }}
			onClick={handleClick}
		>
			<div className={styles.cardInner}>
				<div className={styles.cardFront}>
					<Image
						src={img}
						alt={alt}
						layout="fill"
						objectFit="cover"
						quality={100}
						priority={true}
					/>
					<div className={styles.cardName} style={cardNameStyle}>
						{cardName}
					</div>
				</div>
				<div className={styles.cardBack}>
					<p>{desc}</p>
				</div>
			</div>
		</div>
	);
};

export default Card;
