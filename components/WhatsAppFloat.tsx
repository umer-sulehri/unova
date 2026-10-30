"use client";

import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { whatsappHref } from "@/lib/site-shared";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  if (pathname?.startsWith("/admin")) return null;

  const href = whatsappHref(settings);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${settings.contactName} on WhatsApp`}
      className="group fixed bottom-[15px] left-[15px] z-[1040] flex items-center gap-3 rounded-full bg-[#25d366] py-3 pl-3 pr-4 text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1ebe5d] sm:pr-5"
    >
      <i className="bi bi-whatsapp text-2xl leading-none"></i>
      <span className="hidden leading-tight sm:block">
        <span className="block text-[11px] font-semibold uppercase tracking-[.12em] text-white/80">
          WhatsApp
        </span>
        <span className="block text-sm font-bold">{settings.contactName}</span>
      </span>
      <span className="absolute bottom-full left-0 mb-2 hidden whitespace-nowrap rounded-lg bg-default px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 sm:block">
        {settings.phone || settings.whatsapp}
      </span>
    </a>
  );
}
