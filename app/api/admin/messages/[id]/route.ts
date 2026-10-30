import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteContactMessage,
  setContactMessageStatus,
} from "@/lib/messages";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const messageId = Number(id);
  if (!Number.isFinite(messageId)) {
    return NextResponse.json({ error: "Invalid message id" }, { status: 400 });
  }

  let body: { status?: unknown };
  try {
    body = (await request.json()) as { status?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.status !== "new" && body.status !== "read") {
    return NextResponse.json(
      { error: 'Status must be "new" or "read"' },
      { status: 400 }
    );
  }

  try {
    const updated = await setContactMessageStatus(messageId, body.status);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed.";
    const notFound = message.includes("not found");
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

  const { id } = await ctx.params;
  const messageId = Number(id);
  if (!Number.isFinite(messageId)) {
    return NextResponse.json({ error: "Invalid message id" }, { status: 400 });
  }

  try {
    const removed = await deleteContactMessage(messageId);
    if (!removed) {
      return NextResponse.json(
        { error: `Message ${messageId} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api] delete message failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed." },
      { status: 500 }
    );
  }
}
