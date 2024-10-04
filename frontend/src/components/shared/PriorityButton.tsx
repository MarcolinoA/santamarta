"use client";
import React from "react";
import style from "../../Styles/HomePage/EditButton.module.css";
import { useAuthentication } from "../../hooks/useAuthentications";
import Link from "next/link";

type Position = "absolute" | "relative" | "fixed" | "sticky";

interface ButtonOptions {
	href: string;
	icon: React.ReactNode;
	style: {
		position?: Position; // Ensuring position matches specific types
	};
}

interface ButtonProps {
	option: ButtonOptions[];
	customClass?: string; // Aggiungi questa linea
}

const PriorityButton: React.FC<ButtonProps> = ({ option, customClass }) => {
	const { isAuthenticated, userPriority } = useAuthentication();

	if (!isAuthenticated || !userPriority) {
		return null;
	}

	return (
		<div className={style.editButtonContainer} data-id="priority-btn">
			{option.map((option, index) => (
				<Link key={index} href={option.href}>
					<div
						className={`${style.editIcon} ${option.style.position === "fixed" ? style.fixedPosition : ""} ${index === 1 ? customClass : ""}`} 
						>
						{option.icon}
					</div>
				</Link>
			))}
		</div>
	);
};

export default PriorityButton;
