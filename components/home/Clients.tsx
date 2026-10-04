"use client";

import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const clients = [
  "/img/clients/client-1.png",
  "/img/clients/client-2.png",
  "/img/clients/client-3.png",
  "/img/clients/client-4.png",
  "/img/clients/client-5.png",
  "/img/clients/client-6.png",
  "/img/clients/client-7.jpg",
  "/img/clients/client-8.png",
];

export default function Clients() {
  const swiperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = swiperRef.current;
    if (!el) return;
    const paginationEl = el.querySelector(".swiper-pagination");
    const swiper = new Swiper(el, {
      modules: [Autoplay, Pagination],
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: "auto",
      pagination: {
        el: paginationEl as HTMLElement,
        type: "bullets",
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 2, spaceBetween: 40 },
        480: { slidesPerView: 3, spaceBetween: 60 },
        640: { slidesPerView: 4, spaceBetween: 80 },
        992: { slidesPerView: 6, spaceBetween: 120 },
      },
    });
    return () => {
      swiper.destroy(true, true);
    };
  }, []);

  return (
    <section id="clients" className="clients section">
      <div className="bt-container" data-aos="fade-up" data-aos-delay="100">
        <div ref={swiperRef} className="swiper">
          <div className="swiper-wrapper items-center">
            {clients.map((src) => (
              <div key={src} className="swiper-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="max-w-full h-auto" />
              </div>
            ))}
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
}
