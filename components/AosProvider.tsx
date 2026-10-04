"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

export default function AosProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // index/service-details pages: duration 600 (main.js)
    // web-projects page: duration 800 (inline script)
    AOS.init({
      duration: pathname === "/projects" ? 800 : 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
    const t = setTimeout(() => AOS.refreshHard(), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
