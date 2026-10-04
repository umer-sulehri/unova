import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import {
  COLLECTIONS,
  type Collection,
  type AnyContentItem,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "data", "content");

function isValidCollection(value: string): value is Collection {
  return (COLLECTIONS as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Fallback: bundled JSON seed files, used only while Supabase env vars are
// not configured yet (so the site still works before setup). In production
// writes always require Supabase; in development writes are mirrored to the
// JSON files so the admin stays usable during setup.
// ---------------------------------------------------------------------------

let warnedFallback = false;

async function readJsonFallback(
  collection: Collection
): Promise<AnyContentItem[]> {
  if (!warnedFallback) {
    console.warn(
      "[content] Supabase not configured — serving bundled seed data from " +
        "data/content/*.json. Run supabase/schema.sql and set the env vars " +
        "to go live."
    );
    warnedFallback = true;
  }
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, `${collection}.json`),
      "utf8"
    );
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function fallbackUnavailable(): never {
  throw new Error(
    "Supabase is not configured, so content cannot be saved. Set " +
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
  );
}

/**
 * Development only: persist writes to the bundled JSON seed files so the admin
 * is usable before Supabase is connected. Production always requires Supabase.
 */
function canWriteFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}

async function writeJsonFallback(
  collection: Collection,
  items: AnyContentItem[]
): Promise<void> {
  if (!canWriteFallback()) fallbackUnavailable();
  await fs.writeFile(
    path.join(CONTENT_DIR, `${collection}.json`),
    `${JSON.stringify(items, null, 2)}\n`,
    "utf8"
  );
  console.warn(
    `[content] Wrote "${collection}.json" locally (development fallback). ` +
      "Configure Supabase to persist changes in production."
  );
}

// ---------------------------------------------------------------------------
// Public API (same shapes as before — callers are unaffected)
// ---------------------------------------------------------------------------

export async function readCollection(
  collection: string
): Promise<AnyContentItem[]> {
  if (!isValidCollection(collection)) return [];

  if (!isSupabaseConfigured()) return readJsonFallback(collection);

  const { data, error } = await getSupabaseAdmin()
    .from(collection)
    .select("data")
    .order("id");

  if (error) {
    console.error(`[content] Failed to read "${collection}":`, error.message);
    return [];
  }
  return (data ?? []).map((row) => row.data as AnyContentItem);
}

export async function createItem(
  collection: string,
  itemData: Record<string, unknown>
): Promise<AnyContentItem> {
  if (!isValidCollection(collection)) {
    throw new Error(`Unknown collection "${collection}"`);
  }

  if (!isSupabaseConfigured()) {
    const items = await readJsonFallback(collection);
    const id = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const created = { ...itemData, id } as unknown as AnyContentItem;
    await writeJsonFallback(collection, [...items, created]);
    return created;
  }

  const supabase = getSupabaseAdmin();
  const { data: maxRow, error: maxError } = await supabase
    .from(collection)
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) throw new Error(maxError.message);
  const id = (maxRow?.id ?? 0) + 1;

  const { error } = await supabase
    .from(collection)
    .insert({ id, data: itemData });
  if (error) throw new Error(error.message);

  return { ...itemData, id } as unknown as AnyContentItem;
}

export async function updateItem(
  collection: string,
  id: number,
  patch: Record<string, unknown>
): Promise<AnyContentItem> {
  if (!isValidCollection(collection)) {
    throw new Error(`Unknown collection "${collection}"`);
  }

  if (!isSupabaseConfigured()) {
    const items = await readJsonFallback(collection);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Item ${id} not found in "${collection}"`);
    const merged = { ...items[index], ...patch, id } as AnyContentItem;
    items[index] = merged;
    await writeJsonFallback(collection, items);
    return merged;
  }

  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchError } = await supabase
    .from(collection)
    .select("data")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!row) throw new Error(`Item ${id} not found in "${collection}"`);

  const merged = { ...(row.data as object), ...patch };
  const { error } = await supabase
    .from(collection)
    .update({ data: merged })
    .eq("id", id);
  if (error) throw new Error(error.message);

  return merged as unknown as AnyContentItem;
}

export async function deleteItem(
  collection: string,
  id: number
): Promise<AnyContentItem | null> {
  if (!isValidCollection(collection)) {
    throw new Error(`Unknown collection "${collection}"`);
  }

  // The site collection is a singleton record: deleting it would break every
  // page that reads the global settings.
  if (collection === "site") {
    throw new Error('The "site" settings record cannot be deleted.');
  }

  if (!isSupabaseConfigured()) {
    const items = await readJsonFallback(collection);
    const removed = items.find((item) => item.id === id);
    if (!removed) return null;
    await writeJsonFallback(
      collection,
      items.filter((item) => item.id !== id)
    );
    return removed;
  }

  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchError } = await supabase
    .from(collection)
    .select("data")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!row) return null;

  const { error } = await supabase.from(collection).delete().eq("id", id);
  if (error) throw new Error(error.message);

  return row.data as AnyContentItem;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
