import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Public read-only endpoint so clients can refresh brand data after an admin save. */
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(
    { settings },
    { headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
  );
}
