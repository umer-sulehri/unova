"use client";

import { useMemo, useState } from "react";
import type { ContactMessage } from "@/lib/types";
import {
  Button,
  EmptyState,
  Panel,
  StatusMessage,
  api,
} from "./ui";

type Filter = "all" | "new" | "read";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function waHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default function MessagesManager({
  initialItems,
}: {
  initialItems: ContactMessage[];
}) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const newCount = items.filter((item) => item.status === "new").length;

  const visible = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.status === filter);
  }, [items, filter]);

  const setStatus = async (item: ContactMessage) => {
    const next = item.status === "new" ? "read" : "new";
    setBusyId(item.id);
    setMessage(null);
    try {
      const updated = await api<ContactMessage>(
        `/api/admin/messages/${item.id}`,
        { method: "PATCH", body: { status: next } }
      );
      setItems((current) =>
        current.map((row) => (row.id === item.id ? updated : row))
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not update message.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${item.name}?`)) return;
    setBusyId(item.id);
    setMessage(null);
    try {
      await api(`/api/admin/messages/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((row) => row.id !== item.id));
      setMessage("Message deleted.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not delete message.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Contact Messages"
        description="Every query submitted from the website contact forms."
        icon="bi-chat-dots"
        actions={
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/[.08] px-3 py-1.5 text-xs font-semibold text-accent">
            <i className="bi bi-inbox"></i>
            {newCount} new
          </span>
        }
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {(["all", "new", "read"] as const).map((value) => {
            const count =
              value === "all"
                ? items.length
                : items.filter((item) => item.status === value).length;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                  filter === value
                    ? "bg-accent text-white"
                    : "border border-black/[.1] bg-white text-[rgba(33,37,41,0.65)] hover:border-accent/40 hover:text-accent"
                }`}
              >
                {value} ({count})
              </button>
            );
          })}
        </div>

        {message && <StatusMessage message={message} />}

        {visible.length === 0 ? (
          <EmptyState
            icon="bi-chat-square-text"
            title="No messages here yet"
            text="When someone submits a query from /contact or the homepage form, it will appear in this inbox."
          />
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {visible.map((item) => {
              const whatsapp = waHref(item.phone);
              return (
                <li
                  key={item.id}
                  className={`rounded-xl border p-4 transition ${
                    item.status === "new"
                      ? "border-accent/25 bg-accent/[.03]"
                      : "border-black/[.08] bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          item.status === "new"
                            ? "bg-accent text-white"
                            : "bg-light-bg text-[rgba(33,37,41,0.55)]"
                        }`}
                      >
                        {item.name.charAt(0).toUpperCase() || "?"}
                      </span>
                      <div className="min-w-0">
                        <p className="mb-0 flex flex-wrap items-center gap-2 text-sm font-bold text-heading">
                          {item.name}
                          {item.status === "new" && (
                            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-white">
                              New
                            </span>
                          )}
                        </p>
                        <p className="mb-0 text-xs text-[rgba(33,37,41,0.55)]">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {whatsapp && (
                        <a
                          href={whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#25d366]/10 px-3 py-1.5 text-xs font-semibold text-[#128c4b] transition hover:bg-[#25d366]/20"
                        >
                          <i className="bi bi-whatsapp"></i>
                          WhatsApp
                        </a>
                      )}
                      <Button
                        variant="secondary"
                        onClick={() => setStatus(item)}
                        disabled={busyId === item.id}
                        className="!px-3 !py-1.5 !text-xs"
                      >
                        <i
                          className={`bi ${
                            item.status === "new"
                              ? "bi-check2-circle"
                              : "bi-envelope"
                          }`}
                        ></i>
                        {item.status === "new" ? "Mark read" : "Mark unread"}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => remove(item)}
                        disabled={busyId === item.id}
                        className="!px-3 !py-1.5 !text-xs"
                      >
                        <i className="bi bi-trash"></i>
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <p className="mb-0">
                      <span className="font-semibold text-heading">Email:</span>{" "}
                      <a
                        href={`mailto:${item.email}`}
                        className="break-all text-accent hover:underline"
                      >
                        {item.email}
                      </a>
                    </p>
                    {item.phone && (
                      <p className="mb-0">
                        <span className="font-semibold text-heading">Phone:</span>{" "}
                        {item.phone}
                      </p>
                    )}
                    {item.subject && (
                      <p className="mb-0">
                        <span className="font-semibold text-heading">Topic:</span>{" "}
                        {item.subject}
                      </p>
                    )}
                    {item.budget && (
                      <p className="mb-0">
                        <span className="font-semibold text-heading">Budget:</span>{" "}
                        {item.budget}
                      </p>
                    )}
                  </div>

                  <p className="mb-0 mt-3 whitespace-pre-wrap rounded-lg bg-light-bg px-4 py-3 text-sm leading-relaxed text-[rgba(33,37,41,0.8)]">
                    {item.message}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
