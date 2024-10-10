"use client";
import React, { useRef, useState } from "react";
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
	isFlipped?: boolean; 
	onFlip?: () => void;
	dataid?: string;
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
	isFlipped = false,
	onFlip,
	dataid
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

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
		data-id={`card-container-${dataid}`}
			ref={cardRef}
			className={`${styles.CardContainer} ${isVisible ? styles.visible : ""} ${isFlipped ? styles.flipped : ""} ${className}`}
			style={{ width, height }}
			onClick={handleClick}
		>
			<div className={styles.cardInner}>
				<div className={styles.cardFront} data-id={`card-front-${dataid}`}>
					<Image
						src={img}
						alt={alt || "Default Alt Text"}
						layout="fill"
						objectFit="cover"
						quality={100}
						priority={true}
						data-id={dataid || 'default-data-id'} 
					/>
					<div
						className={styles.cardName}
						style={cardNameStyle}
						data-id={`card-name-${dataid}`}
					>
						{cardName}
					</div>
				</div>
				<div className={styles.cardBack} data-id={`card-back-${dataid}`}>
					<p>{desc}</p>
				</div>
			</div>
		</div>
	);
};

export default Card;