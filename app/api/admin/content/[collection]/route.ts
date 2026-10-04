import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createItem, readCollection, slugify } from "@/lib/content";
import { COLLECTIONS, type Collection } from "@/lib/types";

type Ctx = { params: Promise<{ collection: string }> };

function resolveCollection(raw: string): Collection | null {
  const normalized = raw.endsWith(".json") ? raw.slice(0, -5) : raw;
  return (COLLECTIONS as readonly string[]).includes(normalized)
    ? (normalized as Collection)
    : null;
}

export async function GET(_request: NextRequest, ctx: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { collection } = await ctx.params;
  const name = resolveCollection(collection);
  if (!name) {
    return NextResponse.json(
      { error: `Unknown collection "${collection}"` },
      { status: 404 }
    );
  }
  return NextResponse.json(await readCollection(name));
}

export async function POST(request: NextRequest, ctx: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { collection } = await ctx.params;
  const name = resolveCollection(collection);
  if (!name) {
    return NextResponse.json(
      { error: `Unknown collection "${collection}"` },
      { status: 404 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length === 0
  ) {
    return NextResponse.json(
      { error: "Body must be a non-empty object" },
      { status: 400 }
    );
  }

  // Normalize slug when the collection uses slugs
  if (name === "projects" || name === "services") {
    const base =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug
        : typeof body.title === "string"
          ? body.title
          : "";
    body.slug = slugify(base);
  }
  delete body.id; // ids are assigned by the database layer

  try {
    const created = await createItem(name, body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[api] create failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Create failed." },
      { status: 500 }
    );
  }
}
