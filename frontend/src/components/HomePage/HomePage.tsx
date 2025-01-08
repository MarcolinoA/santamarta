"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import stylesHeader from "../../Styles/HomePage/Header.module.css";
import { imageServices } from "../../services/apiImagesServices";
import PriorityBtn from "../shared/btns/PriorityBtn";
import HeaderBtn from "../shared/btns/HeaderBtn";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FALLBACK_IMAGE =
  "https://scuola-santamarta.s3.eu-north-1.amazonaws.com/OpenDay.jpeg";

const HomePage = () => {
  const [images, setImages] = useState<{ image: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const option = [
    {
      href: "/home/homeImgList",
      style: {
        position: "absolute" as const,
      },
    },
  ];

  useEffect(() => {
    const fetchActiveImages = async () => {
      setLoading(true);
      try {
        const result = await imageServices.getActiveImages();
        // Verifica che result.images esista e abbia elementi
        setImages(result?.images?.length > 0 ? result.images : [{ image: FALLBACK_IMAGE }]);
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
    <div className={stylesHeader.headerContainer}>
{loading ? (
        <div className={stylesHeader.loader}></div>
      ) : images.length > 1 ? (
        // Se ci sono più immagini, renderizza il carosello
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image.image}
                alt={`Active image ${index + 1}`}
                layout="responsive"
                width={800}
                height={600}
                quality={100}
                priority={true}
                className={stylesHeader.customImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // Se c'è solo una immagine, la mostra come immagine statica
        <Image
          src={images[0].image}
          alt="Active Image"
          layout="responsive"
          width={800}
          height={600}
          quality={100}
          priority={true}
          className={stylesHeader.customImage}
        />
      )}
      <HeaderBtn
        isLoggedIn={true}
        username={(username as string) || ""}
        options={options}
      />
      <PriorityBtn option={option} />
    </div>
  );
};

export default HomePage;
