"use client";

import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const toggle = () => setActive(window.scrollY > 100);
    toggle();
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <button
      type="button"
      id="scroll-top"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-[15px] z-[1040] flex h-11 w-11 items-center justify-center rounded-full bg-accent transition-all duration-[400ms] hover:bg-accent/80 ${
        active
          ? "bottom-[15px] visible opacity-100"
          : "-bottom-[15px] invisible opacity-0"
      }`}
    >
      <i className="bi bi-arrow-up-short text-2xl leading-none text-white"></i>
    </button>
  );
}
