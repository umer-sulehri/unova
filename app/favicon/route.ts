import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Serves the admin-managed favicon for `/favicon.ico` (rewritten in
 * next.config.ts) and `/favicon`, so the browser tab icon always follows the
 * uploaded brand asset. Image bytes are proxied instead of redirected because
 * browsers and crawlers treat `/favicon.ico` inconsistently.
 */
export async function GET() {
  const settings = await getSiteSettings();
  const target = absoluteUrl(settings.favicon || "/img/favicon.png");

  try {
    const upstream = await fetch(target, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      throw new Error(`Upstream responded with ${upstream.status}`);
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "image/png",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    // Never break the page over a missing icon file.
    return NextResponse.redirect(target, 307);
  }
}
