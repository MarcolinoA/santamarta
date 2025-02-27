"use client";
import React from "react";
import logo from "../../../../public/logo.png";
import stylesOverlay from "../../../Styles/HomePage/Overlay.module.css";
import Image from "next/image";

interface OverlayProps {
  isVisible: boolean;
  title: string;
  description: string;
  onClose: () => void;
  pdf?: string;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({
  isVisible,
  title,
  description,
  onClose,
  pdf,
  children,
}) => {
  if (!isVisible) return null;

  return (
    <div className={stylesOverlay.overlay}>
      <div className={stylesOverlay.overlayContent}>
        <Image className={stylesOverlay.overlayImage} src={logo} alt="Logo" width={150} />
        <button className={stylesOverlay.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={stylesOverlay.overlayTitle}>{title}</h2>

        <p
          className={stylesOverlay.overlayDescription}
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>

        {pdf && (
          <a href={pdf} download className={stylesOverlay.downloadButton}>
            Scarica PDF
          </a>
        )}

        {children}
      </div>
    </div>
  );
};

export default Overlay;
