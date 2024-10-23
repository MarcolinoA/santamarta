"use client";
import React from "react";
import style from "../../../Styles/HomePage/Btns/PlusBtn.module.css";
import { useAuthentication } from "../../../hooks/useAuthentications";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

type Position = "absolute" | "relative" | "fixed" | "sticky";

interface ButtonOptions {
  href: string;
  style: {
    position?: Position;
  };
}

interface ButtonProps {
  option: ButtonOptions[];
  customClass?: string;
}

const AddBtn: React.FC<ButtonProps> = ({ option, customClass }) => {
  const { isAuthenticated, userPriority } = useAuthentication();

  if (!isAuthenticated || !userPriority) {
    return null;
  }

  return (
    <div className={style.editButtonContainer} data-id="priority-btn">
      {option.map((option, index) => (
        <Link key={index} href={option.href}>
          <button
            className={`${style.editIcon} ${option.style.position === "fixed" ? style.fixedPosition : ""} ${index === 1 ? customClass : ""}`}
          >
            <FaPlus className={style.editIcon} size={30} />
          </button>
        </Link>
      ))}
    </div>
  );
};

export default AddBtn;