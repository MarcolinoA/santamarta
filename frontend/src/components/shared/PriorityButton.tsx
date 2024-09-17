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
}

const PriorityButton: React.FC<ButtonProps> = ({ option }) => {
	const { isAuthenticated, userPriority } = useAuthentication();

	if (!isAuthenticated || !userPriority) {
		return null;
	}

	return (
		<div className={style.editButtonContainer}>
			{option.map((option, index) => (
				<Link key={index} href={option.href}>
					<div
						className={`${style.editIcon} ${option.style.position === "fixed" ? style.fixedPosition : ""}`} // Add a dynamic class
					>
						{option.icon}
					</div>
				</Link>
			))}
		</div>
	);
};

export default PriorityButton;
