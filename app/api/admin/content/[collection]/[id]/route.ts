import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteItem, slugify, updateItem } from "@/lib/content";
import { COLLECTIONS, type Collection } from "@/lib/types";

type Ctx = { params: Promise<{ collection: string; id: string }> };

function resolveCollection(raw: string): Collection | null {
  const normalized = raw.endsWith(".json") ? raw.slice(0, -5) : raw;
  return (COLLECTIONS as readonly string[]).includes(normalized)
    ? (normalized as Collection)
    : null;
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { collection, id } = await ctx.params;
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

  delete body.id; // id is immutable

  // Normalize slug when the collection uses slugs
  if ((name === "projects" || name === "services") && "slug" in body) {
    body.slug = slugify(String(body.slug ?? ""));
  }

  try {
    const updated = await updateItem(name, Number(id), body);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed.";
    const notFound = message.includes("not found");
    console.error("[api] update failed:", err);
    return NextResponse.json(
      { error: message },
      { status: notFound ? 404 : 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { collection, id } = await ctx.params;
  const name = resolveCollection(collection);
  if (!name) {
    return NextResponse.json(
      { error: `Unknown collection "${collection}"` },
      { status: 404 }
    );
  }

  try {
    const removed = await deleteItem(name, Number(id));
    if (!removed) {
      return NextResponse.json(
        { error: `Item ${id} not found in "${collection}"` },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, removed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed.";
    const notFound = message.includes("not found");
    // Guard rails such as the singleton "site" record are client errors.
    const guarded = message.includes("cannot be deleted");
    if (!notFound && !guarded) console.error("[api] delete failed:", err);
    return NextResponse.json(
      { error: message },
      { status: notFound ? 404 : guarded ? 400 : 500 }
    );
  }
}
