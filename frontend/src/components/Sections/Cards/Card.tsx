"use client";
import React, { useRef, useState } from "react";
import stylesCard from "../../../Styles/Card.module.css";
import Image, { StaticImageData } from "next/image";

interface CardProps {
	img: string | StaticImageData;
	alt: string;
	cardName: string;
	desc?: string;
	onClick?: () => void;
	className?: string;
	isFlipped?: boolean;
	onFlip?: () => void;
	dataid?: string;
	isLarge?: boolean;
}

const Card: React.FC<CardProps> = ({
	img,
	alt,
	cardName,
	desc,
	onClick,
	className,
	isFlipped = false,
	onFlip,
	dataid,
	isLarge = false,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		if (onFlip) onFlip();
		if (onClick) onClick();
	};

	const cardClasses = `${stylesCard.CardContainer} ${isVisible ? stylesCard.visible : ""} ${isFlipped ? stylesCard.flipped : ""} ${className} ${isLarge ? stylesCard.largeCard : stylesCard.smallCard}`;
	const cardNameClasses = `${stylesCard.cardName} ${isLarge ? stylesCard.cardNameLarge : stylesCard.cardNameSmall}`;

	return (
		<div
			data-id={`card-container-${dataid}`}
			ref={cardRef}
			className={cardClasses}
			onClick={handleClick}
		>
			<div className={stylesCard.cardInner}>
				<div className={stylesCard.cardFront} data-id={`card-front-${dataid}`}>
					<Image
						src={img}
						alt={alt || "Default Alt Text"}
						layout="fill"
						objectFit="cover"
						quality={100}
						priority={true}
						data-id={dataid || "default-data-id"}
					/>
					<div className={cardNameClasses} data-id={`card-name-${dataid}`}>
						{cardName}
					</div>
				</div>
				<div className={stylesCard.cardBack} data-id={`card-back-${dataid}`}>
					<p>{desc}</p>
				</div>
			</div>
		</div>
	);
};

export default Card;