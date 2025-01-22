"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import stylesHeader from "../../Styles/HomePage/Header.module.css";
import { imageServices } from "../../services/apiImagesServices";
import PriorityBtn from "../shared/btns/PriorityBtn";
import HeaderBtn from "../shared/btns/HeaderBtn";
import Carousel from "../shared/Carousel";
import img1 from "../../../public/festadelluva.jpeg";
import img3 from "../../../public/fattoriaDidattica.jpeg";
import img4 from "../../../public/homePage.jpeg";

const FALLBACK_IMAGE =
  "https://scuola-santamarta.s3.eu-north-1.amazonaws.com/OpenDay.jpeg";

const HomePage = () => {
  const [images, setImages] = useState<{ image: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
/*
  const options = [
    {
      label: "Registrati",
      href: "/account/pages/signup",
      dataid: "signup-btn",
    },
    { label: "Accedi", href: "/account/pages/signin", dataid: "signin-btn" },
    { label: "Esci", href: "/account/pages/logout", dataid: "logout-btn" },
    {
      label: "Elimina",
      href: "/account/pages/deleteAccount",
      dataid: "delete-account-btn",
    },
  ];
  */

  const option = [
    {
      href: "/home/homeImgList",
      style: {
        position: "absolute" as const,
      },
    },
  ];

  const Arrimages = [
    { src: img1, alt: "Immagine 1" },
    { src: img4, alt: "Immagine 2" },
  ];

  useEffect(() => {
    const fetchActiveImages = async () => {
      setLoading(true);
      try {
        const result = await imageServices.getActiveImages();
        // Verifica che result.images esista e abbia elementi
        setImages(
          result?.images?.length > 0
            ? result.images
            : [{ image: FALLBACK_IMAGE }]
        );
      } catch (error) {
        console.error("Error fetching active images:", error);
        setImages([{ image: FALLBACK_IMAGE }]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveImages();
  }, []);

  const searchParams = useSearchParams();
  let username = "";

  if (searchParams) {
    username = searchParams.get("username") || "";
  }

  return (
    <div className={stylesHeader.container}>
      <Carousel images={Arrimages} />
      <PriorityBtn option={option} />
    </div>
  );
};

export default HomePage;
