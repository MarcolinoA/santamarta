"use client";
import React from "react";
import style from "../../../Styles/HomePage/Btns/DeleteBtn.module.css";
import { useAuthentication } from "../../../hooks/useAuthentications";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

interface ButtonOptions {
	href: string;
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
						<FaTrash size={30} />
					</div>
				</Link>
			))}
		</div>
	);
};

export default DeleteBtn;
