import type { Metadata, Viewport } from "next";
import { Roboto, Nunito, Inter } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";
import AosProvider from "@/components/AosProvider";
import JsonLd from "@/components/seo/JsonLd";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/site";
import { sanitizeTheme, themeCssVars } from "@/lib/theme";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const defaultTitle = `${settings.siteName} | UI/UX, Web Development & Marketing in Lahore`;

  return {
    // Required so canonical, OG and sitemap URLs resolve to absolute origins.
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.description || SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName, url: SITE_URL }],
    creator: settings.siteName,
    publisher: settings.siteName,
    category: "Digital Agency",
    alternates: {
      canonical: "/",
      types: { "application/json": "/manifest.webmanifest" },
    },
    icons: {
      icon: [
        { url: settings.favicon, type: "image/png", sizes: "512x512" },
        { url: settings.favicon, type: "image/png" },
      ],
      shortcut: [settings.favicon],
      apple: [{ url: settings.appleIcon, sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: settings.siteName,
      title: defaultTitle,
      description: settings.description,
      locale: "en_US",
      images: [
        settings.ogImage
          ? {
              url: settings.ogImage,
              width: OG_IMAGE.width,
              height: OG_IMAGE.height,
              alt: `${settings.siteName} — ${settings.tagline}`,
            }
          : OG_IMAGE,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: settings.description,
      images: [settings.ogImage || OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    formatDetection: { telephone: true, email: true, address: false },
    other: {
      "geo.region": settings.address.countryCode
        ? `${settings.address.countryCode}-${(settings.address.region ?? "")
            .slice(0, 2)
            .toUpperCase()}`
        : "PK-PB",
      "geo.placename": settings.address.city || "Lahore",
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSiteSettings();
  return {
    themeColor: sanitizeTheme(settings.theme).accent,
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  // Brand palette as CSS custom properties: the first paint is already themed,
  // so there is no flash of the default blue before hydration.
  const themeVars = themeCssVars(settings.theme) as React.CSSProperties;

  return (
    <html lang="en" style={themeVars}>
      <body
        className={`${roboto.variable} ${nunito.variable} ${inter.variable} antialiased`}
      >
        <JsonLd
          data={[organizationJsonLd(settings), websiteJsonLd(settings)]}
        />
        <SiteSettingsProvider initialSettings={settings}>
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </SiteSettingsProvider>
        <ScrollTop />
        <AosProvider />
      </body>
    </html>
  );
}
