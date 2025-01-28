"use client";
import React, { useRef, useState } from "react";
import stylesCard from "../../../Styles/Card.module.css";
import Image, { StaticImageData } from "next/image";
import { Fjalla_One } from "next/font/google";

const fjalla = Fjalla_One({
  subsets: ["latin"],
  weight: "400",
});

interface CardProps {
  img: string | StaticImageData;
  alt: string;
  cardName: string;
  desc?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  dataid?: string;
  isLarge?: boolean;
  isSquare?: boolean;
  isFlippable?: boolean;
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
  isSquare = false,
  isFlippable = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(isLarge || isFlipped);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isFlippable) {
      if (onFlip) onFlip();
      setIsCardFlipped((prev) => !prev);
    }
    if (onClick) onClick(); // Notifica il genitore del click
  };

  const getCardSizeClass = () => {
    if (isSquare) return stylesCard.squareCard;
    if (isLarge) return stylesCard.largeCard;
    return stylesCard.smallCard;
  };

  const getCardNameSizeClass = () => {
    if (isSquare) return stylesCard.cardNameSquare;
    if (isLarge) return stylesCard.cardNameLarge;
    return stylesCard.cardNameSmall;
  };

  const cardClassesArray = [
    stylesCard.CardContainer,
    isVisible && stylesCard.visible,
    isCardFlipped && stylesCard.flipped,
    className,
    getCardSizeClass()
  ];
  
  const cardClasses = cardClassesArray.filter(Boolean).join(" ");

  const cardNameClasses = `${stylesCard.cardName} ${getCardNameSizeClass()}`;
  const cardNameClassesBack = `${stylesCard.cardNameBack} ${getCardNameSizeClass()}`;

  return (
    <div
      data-id={`card-container-${dataid}`}
      ref={cardRef}
      className={`${cardClasses} ${fjalla.className}`}
      onClick={handleClick}
    >
      <div className={`${stylesCard.cardInner} ${isCardFlipped && isFlippable ? stylesCard.flipped : ""}`}>
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
        <div className={stylesCard.cardBack}>
          {Array.isArray(desc) ? (
            desc.map((line, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>
            ))
          ) : (
            <p>{desc}</p>
          )}
          <div className={cardNameClassesBack} data-id={`card-name-${dataid}`}>
            {cardName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
