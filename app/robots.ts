import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * The admin dashboard and API routes are disallowed here, and the admin layout
 * additionally sends `noindex` so those URLs can never be indexed even when
 * linked from elsewhere. AI crawlers are allowed explicitly because wildcard
 * handling for them is inconsistent in practice.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/admin/", "/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
