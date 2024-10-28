"use client";
import React from "react";
import stylesBtn from "../../../Styles/HomePage/Btns/PriorityBtn.module.css";
import { useAuthentication } from "../../../hooks/useAuthentications";
import Link from "next/link";
import { FaPen } from "react-icons/fa";

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

const PriorityBtn: React.FC<ButtonProps> = ({ option, customClass }) => {
  const { isAuthenticated, userPriority } = useAuthentication();

  if (!isAuthenticated || !userPriority) {
    return null;
  }

  return (
    <div className={stylesBtn.editButtonContainer} data-id="priority-btn">
      {option.map((option, index) => (
        <Link key={index} href={option.href}>
          <button
            className={`${stylesBtn.editIcon} ${option.style.position === "fixed" ? stylesBtn.fixedPosition : ""} ${index === 1 ? customClass : ""}`}
          >
            <FaPen className={stylesBtn.editIcon} size={30} />
          </button>
        </Link>
      ))}
    </div>
  );
};

export default PriorityBtn;
