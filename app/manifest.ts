import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site";
import { SITE_DESCRIPTION } from "@/lib/seo";

// Manifests are generated per request so an admin upload is picked up without a
// rebuild once the site is deployed.
export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();

  return {
    name: `${settings.siteName} — ${settings.tagline}`,
    short_name: settings.siteName,
    description: settings.description || SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d83fd",
    icons: [
      {
        src: settings.appleIcon || settings.favicon,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: settings.favicon,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
