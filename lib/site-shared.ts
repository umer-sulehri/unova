// Settings helpers that are safe to import from client components.
//
// `lib/site.ts` owns the Supabase/JSON backed reader (`getSiteSettings`), which
// pulls Node APIs into the bundle. Anything a React client component needs —
// factory defaults, formatters and the social field list — lives here instead.

import { THEME_DEFAULTS, sanitizeTheme } from "./theme";
import type { SiteSettings } from "./types";

/** Factory defaults, used until an admin saves the settings record. */
export function defaultSiteSettings(): SiteSettings {
  return {
    id: 1,
    siteName: "UNOVA",
    tagline:
      "UI/UX design, web development & digital marketing agency in Lahore, Pakistan",
    description:
      "UNOVA is a Lahore-based digital agency delivering UI/UX design, web development, graphic design, SEO and social media marketing for brands that want to stand out.",
    logo: "/img/UNOVA.png",
    favicon: "/img/favicon.png",
    appleIcon: "/img/apple-touch-icon.png",
    ogImage: "/opengraph-image",
    contactName: "Umer",
    phone: "+92 309 4785572",
    whatsapp: "923094785572",
    email: "connectunova@gmail.com",
    address: {
      street: "Arooj Center, Fareed Kot Road",
      city: "Lahore",
      region: "Punjab",
      postalCode: "54660",
      country: "Pakistan",
      countryCode: "PK",
    },
    businessHours: "Mon – Sat, 10:00 AM – 7:00 PM",
    mapUrl: "",
    showTeamSection: true,
    theme: { ...THEME_DEFAULTS },
    socials: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      behance: "",
      dribbble: "",
      x: "",
    },
  };
}

/** Fills every missing key so a partial record can never break rendering. */
export function withDefaults(
  stored: Partial<SiteSettings> | null
): SiteSettings {
  const base = defaultSiteSettings();
  if (!stored) return base;

  return {
    ...base,
    ...stored,
    id: 1,
    // `?? base` so a legacy record (or an explicit null) can never hide the
    // section by accident.
    showTeamSection: stored.showTeamSection ?? base.showTeamSection,
    contactName: stored.contactName?.trim() || base.contactName,
    // Never trust stored colors: they are written into a <style>-like context.
    theme: sanitizeTheme(stored.theme),
    address: { ...base.address, ...(stored.address ?? {}) },
    socials: { ...base.socials, ...(stored.socials ?? {}) },
  };
}

/** Single-line address for cards and the footer. */
export function formatAddress(settings: SiteSettings): string {
  const { street, city, region, postalCode, country } = settings.address;
  return [street, city, region, postalCode, country]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

/** Digits-only phone number for `tel:` links. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** https://wa.me/<digits> link, or an empty string when unset. */
export function whatsappHref(settings: SiteSettings): string {
  const digits = settings.whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export const SOCIAL_FIELDS = [
  {
    key: "facebook",
    label: "Facebook",
    icon: "bi-facebook",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "bi-instagram",
    placeholder: "https://instagram.com/yourpage",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "bi-linkedin",
    placeholder: "https://linkedin.com/company/yourpage",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: "bi-youtube",
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    key: "behance",
    label: "Behance",
    icon: "bi-behance",
    placeholder: "https://behance.net/yourprofile",
  },
  {
    key: "dribbble",
    label: "Dribbble",
    icon: "bi-dribbble",
    placeholder: "https://dribbble.com/yourprofile",
  },
  {
    key: "x",
    label: "X (Twitter)",
    icon: "bi-twitter-x",
    placeholder: "https://x.com/yourhandle",
  },
] as const satisfies readonly {
  key: keyof SiteSettings["socials"];
  label: string;
  icon: string;
  placeholder: string;
}[];
