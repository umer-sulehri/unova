import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import type { ContactMessage, ContactMessageStatus } from "./types";

const MESSAGES_FILE = path.join(process.cwd(), "data", "contact-messages.json");
const MAX = {
  name: 120,
  email: 200,
  phone: 60,
  subject: 160,
  budget: 80,
  message: 5000,
};

export type ContactMessageInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  budget: string;
  message: string;
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function normalizeContactMessageInput(
  raw: Record<string, unknown>
): ContactMessageInput {
  return {
    name: clean(raw.name, MAX.name),
    email: clean(raw.email, MAX.email),
    phone: clean(raw.phone, MAX.phone),
    subject: clean(raw.subject, MAX.subject),
    budget: clean(raw.budget, MAX.budget),
    message: clean(raw.message, MAX.message),
  };
}

export function validateContactMessageInput(input: ContactMessageInput): string | null {
  if (!input.name) return "Please enter your name.";
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return "Please enter a valid email address.";
  }
  if (!input.message || input.message.length < 5) {
    return "Please tell us a little about your project.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// JSON fallback (development / before Supabase is connected)
// ---------------------------------------------------------------------------

async function readFallback(): Promise<ContactMessage[]> {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContactMessage[]) : [];
  } catch {
    return [];
  }
}

async function writeFallback(messages: ContactMessage[]): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Contact messages need Supabase. Run supabase/contact-messages.sql " +
        "and check the Supabase env vars in .env.local."
    );
  }
  await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await fs.writeFile(
    MESSAGES_FILE,
    `${JSON.stringify(messages, null, 2)}\n`,
    "utf8"
  );
}

// ---------------------------------------------------------------------------
// Public API (server only)
// ---------------------------------------------------------------------------

export async function createContactMessage(
  input: ContactMessageInput
): Promise<ContactMessage> {
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const messages = await readFallback();
    const id = messages.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const created: ContactMessage = {
      ...input,
      id,
      status: "new",
      createdAt: now,
    };
    await writeFallback([created, ...messages]);
    return created;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("contact_messages")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    console.error("[messages] Failed to save contact message:", error.message);
    throw new Error(
      error.code === "42P01"
        ? "The contact_messages table does not exist yet. Run supabase/contact-messages.sql in Supabase."
        : "Could not save your message. Please try WhatsApp instead."
    );
  }

  return mapRow(data);
}

export async function readContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) {
    return (await readFallback()).sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[messages] Failed to read contact messages:", error.message);
    return [];
  }

  return (data ?? []).map(mapRow);
}

export async function setContactMessageStatus(
  id: number,
  status: ContactMessageStatus
): Promise<ContactMessage> {
  if (!isSupabaseConfigured()) {
    const messages = await readFallback();
    const index = messages.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Message ${id} not found.`);
    messages[index] = { ...messages[index], status };
    await writeFallback(messages);
    return messages[index];
  }

  const { data, error } = await getSupabaseAdmin()
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function deleteContactMessage(id: number): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const messages = await readFallback();
    const next = messages.filter((item) => item.id !== id);
    if (next.length === messages.length) return false;
    await writeFallback(next);
    return true;
  }

  const { error } = await getSupabaseAdmin()
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

function mapRow(row: Record<string, unknown>): ContactMessage {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    subject: String(row.subject ?? ""),
    budget: String(row.budget ?? ""),
    message: String(row.message ?? ""),
    status: row.status === "read" ? "read" : "new",
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}
