// Central SEO configuration and metadata helpers.
//
// Every public route builds its metadata through `pageMetadata()` so titles,
// descriptions, canonicals, Open Graph and Twitter tags stay consistent, and
// `metadataBase` in the root layout can resolve every relative URL absolutely.

import type { Metadata } from "next";
// Imported from site-shared (not ./site) so client components such as the
// about-page video player can use SEO constants without pulling Node APIs in.
import {
  SOCIAL_FIELDS,
  defaultSiteSettings,
  formatAddress,
  telHref,
  whatsappHref,
} from "./site-shared";
import type { FaqItem, Service, SiteSettings } from "./types";

/**
 * `NEXT_PUBLIC_SITE_URL` must be the canonical origin in production. The value is
 * trimmed because a trailing newline in a Vercel env var silently corrupts every
 * canonical and sitemap URL.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (rawSiteUrl && rawSiteUrl.length > 0
  ? rawSiteUrl
  : "http://localhost:3000"
).replace(/\/+$/, "");

/**
 * Fallbacks only. The admin-managed values in `lib/site-shared.ts`
 * (`defaultSiteSettings()`) are what every page, tag and schema actually uses.
 */
export const SITE_NAME = defaultSiteSettings().siteName;
export const SITE_TAGLINE = defaultSiteSettings().tagline;
export const SITE_DESCRIPTION = defaultSiteSettings().description;

export const SITE_KEYWORDS = [
  "digital agency Lahore",
  "UI UX design agency Pakistan",
  "web development company Lahore",
  "graphic design agency",
  "SEO services Pakistan",
  "social media marketing agency",
  "brand identity design",
  "custom web development",
  "freelance designer Pakistan",
  "digital marketing agency Lahore",
];

export const BUSINESS = {
  foundingDate: "2020",
  priceRange: "$$",
  /** Opening hours in schema.org format. */
  openingHours: "Mo-Sa 10:00-19:00",
} as const;

/** Admin-managed profile URLs, used for schema `sameAs`. */
export function socialLinks(settings: SiteSettings): string[] {
  return SOCIAL_FIELDS.map((field) => settings.socials[field.key])
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`));
}

/** Canonical path of the agency film. */
export const SHOWREEL_SRC = "/video/UNOVA__Digital_Experiences.mp4";

/** Poster frame shown before playback starts. */
export const SHOWREEL_POSTER = "/img/showreel-poster.jpg";

/** Runtime of the film (238.6 s) in ISO 8601. */
export const SHOWREEL_DURATION = "PT3M59S";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  /** Brand-neutral: the real alt is built from the site settings in the layout. */
  alt: "Digital agency in Lahore — UI/UX, web development & marketing",
};

/** Icons reused by both Open Graph and the manifest. */
export const ICONS = {
  icon: "/img/UNOVA -favicon.png",
  shortcut: "/img/favicon.png",
  apple: "/img/apple-touch-icon.png",
};

export type PageMetadataInput = {
  /** Short page title. The brand suffix is added by the layout template. */
  title: string;
  description: string;
  /** Absolute path (e.g. "/services/web-development") or a full URL. */
  path?: string;
  keywords?: string[];
  /** Absolute or site-relative OG image. */
  image?: string | typeof OG_IMAGE;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Admin-managed brand name, used for social card titles. */
  siteName?: string;
};

/**
 * Builds a full Metadata object: unique title, meta description, keywords,
 * absolute canonical URL, Open Graph, Twitter card and robots directives.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
  keywords,
  image = OG_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
  siteName = SITE_NAME,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const images: { url: string; width?: number; height?: number; alt?: string }[] =
    typeof image === "string" ? [{ url: absoluteUrl(image) }] : [image];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type,
      url,
      title: `${title} | ${siteName}`,
      description,
      siteName,
      locale: "en_US",
      images,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: images.map((img) => img.url),
    },
  };
}

/** Clips a description to a SERF-friendly length without cutting mid-word. */
export function truncate(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

/** ProfessionalService schema built from the admin-managed settings record. */
export function organizationJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": organizationId,
    name: settings.siteName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(settings.logo),
      caption: settings.siteName,
    },
    image: absoluteUrl(settings.ogImage || OG_IMAGE.url),
    description: settings.description,
    slogan: settings.tagline,
    email: settings.email,
    telephone: settings.phone,
    ...(socialLinks(settings).length > 0 || whatsappHref(settings)
      ? { sameAs: [...socialLinks(settings), whatsappHref(settings)].filter(Boolean) }
      : {}),
    ...(settings.businessHours ? { openingHours: BUSINESS.openingHours } : {}),
    priceRange: BUSINESS.priceRange,
    foundingDate: BUSINESS.foundingDate,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      addressRegion: settings.address.region,
      postalCode: settings.address.postalCode,
      addressCountry: settings.address.countryCode,
    },
    areaServed: [
      { "@type": "Country", name: settings.address.country },
      { "@type": "Place", name: settings.address.city },
    ],
    knowsAbout: [
      "UI/UX Design",
      "Web Development",
      "Graphic Design",
      "Search Engine Optimization",
      "Social Media Marketing",
      "Brand Identity",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: telHref(settings.phone).replace("tel:", ""),
      email: settings.email,
      contactType: "sales",
      areaServed: settings.address.countryCode,
      availableLanguage: ["en", "ur"],
    },
  };
}

/** Single-line address helper re-exported for templates. */
export const addressLine = formatAddress;

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: SITE_URL,
    name: settings.siteName,
    description: settings.description,
    publisher: { "@id": organizationId },
    inLanguage: "en",
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.title,
    serviceType: service.title,
    description: truncate(service.heroSubtitle || service.tagline),
    url: absoluteUrl(`/services/${service.slug}`),
    image: service.heroImage ? absoluteUrl(service.heroImage) : absoluteUrl(OG_IMAGE.url),
    provider: { "@id": organizationId },
    areaServed: { "@type": "Country", name: "Pakistan" },
    audience: { "@type": "BusinessAudience", name: "SMBs and startups" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} packages`,
      itemListElement: service.packages.map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        description: pkg.tagline,
      })),
    },
  };
}

export function videoJsonLd({
  name,
  description,
  thumbnail,
  duration,
  contentUrl,
  uploadDate,
}: {
  name: string;
  description: string;
  thumbnail: string;
  duration: string;
  contentUrl: string;
  uploadDate: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: [absoluteUrl(thumbnail)],
    uploadDate,
    duration,
    contentUrl: absoluteUrl(contentUrl),
    embedUrl: absoluteUrl("/"),
    publisher: { "@id": organizationId },
  };
}

/** ItemList markup so portfolio/gallery entries can surface as search results. */
export function itemListJsonLd({
  name,
  items,
  path,
}: {
  name: string;
  path: string;
  items: { name: string; url: string; image?: string }[];
}) {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: item.name,
        url: item.url,
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  };
}
