"use client"
import React, { useState } from "react";
import "./BtnThemeStyle.css";
import ArrowDown from "../Icons/ArrowDown"
import ArrowUp from "../Icons/ArrowUp"

const BtnTheme = () => {
    const [open, setOpen] = useState(false);

    const toggleTheme = () => {
        if (open) setOpen(!open);
        else setOpen(open)
    } 

  return (
    <div>
      <label>
        <input
          type="checkbox"
          onChange={toggleTheme}
          className="inp"
        />
        <ArrowDown />
        <ArrowUp />
      </label>

    </div>
  );
};

export default BtnTheme;