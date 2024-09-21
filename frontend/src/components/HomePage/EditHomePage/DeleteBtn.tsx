"use client";
import React from "react";
import style from "../../../Styles/HomePage/DeleteBtn.module.css";
import { useAuthentication } from "../../../hooks/useAuthentications";
import Link from "next/link";

interface ButtonOptions {
	href: string;
	icon: React.ReactNode;
}

interface ButtonProps {
	option: ButtonOptions[];
}

const DeleteBtn: React.FC<ButtonProps> = ({ option }) => {
	const { isAuthenticated, userPriority } = useAuthentication();

	if (!isAuthenticated || !userPriority) {
		return null;
	}

	return (
		<div className={style.deleteButtonContainer}>
			{option.map((option, index) => (
				<Link key={index} href={option.href}>
					<div
						className={`${style.deleteIcon}`}
					>
						{option.icon}
					</div>
				</Link>
			))}
		</div>
	);
};

export default DeleteBtn;
