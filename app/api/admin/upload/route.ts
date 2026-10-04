import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

function safeName(original: string): string {
  const ext = (path.extname(original) || ".png").toLowerCase();
  const base = path
    .basename(original, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "image"}-${Date.now().toString(36)}${ext}`;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is larger than 5 MB. Please compress it and try again." },
      { status: 413 }
    );
  }

  if (!ALLOWED.test(file.name)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPG, WEBP, GIF, AVIF or SVG." },
      { status: 415 }
    );
  }

  const filename = safeName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdmin()
      .storage.from(BUCKET)
      .upload(filename, bytes, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (error) {
      console.error("[upload] storage error:", error.message);
      return NextResponse.json(
        {
          error: `Storage upload failed: ${error.message}. Did you create the "${BUCKET}" bucket? See supabase/schema.sql.`,
        },
        { status: 500 }
      );
    }

    const { data } = getSupabaseAdmin()
      .storage.from(BUCKET)
      .getPublicUrl(filename);

    return NextResponse.json({ url: data.publicUrl, filename });
  }

  // Local development fallback: write into public/uploads so the site works
  // before Supabase is connected.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Image uploads need Supabase Storage. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/schema.sql.",
      },
      { status: 503 }
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);

  return NextResponse.json({ url: `/uploads/${filename}`, filename });
}