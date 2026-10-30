import { NextRequest, NextResponse } from "next/server";
import {
  createContactMessage,
  normalizeContactMessageInput,
  validateContactMessageInput,
} from "@/lib/messages";
import { getSiteSettings } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase";
import { sendContactWhatsAppNotification } from "@/lib/whatsapp";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 6;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later or use WhatsApp." },
      { status: 429 }
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots do not learn anything.
  if (typeof raw._gotcha === "string" && raw._gotcha.trim()) {
    return NextResponse.json({ ok: true });
  }

  const input = normalizeContactMessageInput(raw);
  const validationError = validateContactMessageInput(input);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    await createContactMessage(input);
  } catch (err) {
    console.error("[contact] Failed to save message:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Could not send your message. Please try WhatsApp instead.";
    // In production (Vercel) the filesystem is read-only and if Supabase is
    // misconfigured we still want to fire the WhatsApp webhook/alert when
    // possible. Return success so the user isn't blocked by storage issues.
    if (process.env.NODE_ENV === "production" && !isSupabaseConfigured()) {
      console.warn(
        "[contact] Storage unavailable in production; proceeding without persisting message (WhatsApp alert will still be attempted)."
      );
    } else {
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const settings = await getSiteSettings();
  await sendContactWhatsAppNotification(input, {
    siteName: settings.siteName,
    fallbackPhone: settings.whatsapp || settings.phone,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
