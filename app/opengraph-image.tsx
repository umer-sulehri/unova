import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site";

/**
 * A static alt is required by the file convention, so it stays brand-neutral:
 * the admin-managed alt comes from the root layout metadata instead.
 */
export const alt = "Digital agency in Lahore — UI/UX, web development & marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const settings = await getSiteSettings();
  const initial = settings.siteName.charAt(0).toUpperCase() || "U";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0d83fd 0%, #0a69ca 55%, #062d4d 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 68,
              height: 68,
              borderRadius: 18,
              background: "rgba(255,255,255,0.18)",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            {initial}
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 4 }}>
            {settings.siteName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.1 }}>
            Elevate Your Brand Through Design &amp; Digital Innovation
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
            {settings.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["UI/UX Design", "Web Development", "SEO", "Social Media"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "12px 26px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  fontSize: 24,
                }}
              >
                {chip}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
