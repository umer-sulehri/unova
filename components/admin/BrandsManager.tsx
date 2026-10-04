"use client";

import { useState } from "react";
import type { Brand } from "@/lib/types";
import {
  Button,
  EmptyState,
  FormSection,
  ImageField,
  Panel,
  StatusMessage,
  TextInput,
  api,
} from "./ui";

type Draft = Omit<Brand, "id">;

const emptyDraft: Draft = { name: "", logo: "", website: "", description: "" };

export default function BrandsManager({
  initialItems,
}: {
  initialItems: Brand[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (editingId === "new") {
        const created = await api<Brand>("/api/admin/content/brands", {
          method: "POST",
          body: draft,
        });
        setItems((prev) => [...prev, created]);
        setMessage(`Added "${created.name}".`);
      } else if (editingId !== null) {
        const updated = await api<Brand>(
          `/api/admin/content/brands/${editingId}`,
          { method: "PUT", body: draft }
        );
        setItems((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setMessage(`Saved "${updated.name}".`);
      }
      setEditingId(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (brand: Brand) => {
    if (!window.confirm(`Remove brand "${brand.name}"?`)) return;
    setBusy(true);
    try {
      await api(`/api/admin/content/brands/${brand.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== brand.id));
      setMessage(`Removed "${brand.name}".`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <StatusMessage message={message} />

      {editingId !== null && (
        <Panel
          title={editingId === "new" ? "Add a brand" : `Edit: ${draft.name}`}
          icon="bi-pencil-square"
          actions={
            <>
              <Button
                onClick={save}
                disabled={busy || !draft.name.trim() || !draft.logo.trim()}
              >
                <i className="bi bi-check-lg"></i>
                {busy ? "Saving…" : "Save"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditingId(null)}
                disabled={busy}
              >
                Cancel
              </Button>
            </>
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormSection title="Logo" icon="bi-image">
              <div className="col-span-full">
                <ImageField
                  label="Brand logo"
                  value={draft.logo}
                  onChange={(v) => set("logo", v)}
                  aspect="aspect-[3/1]"
                  fit="object-contain"
                  hint="Transparent PNG looks best — around 600×200 px."
                />
              </div>
            </FormSection>

            <FormSection title="Details" icon="bi-card-text">
              <div className="col-span-full">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Brand name
                  </span>
                  <TextInput
                    value={draft.name}
                    onChange={(v) => set("name", v)}
                    placeholder="Renkli Paints"
                  />
                </label>
              </div>
              <div className="col-span-full">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Website
                  </span>
                  <TextInput
                    value={draft.website}
                    onChange={(v) => set("website", v)}
                    placeholder="https://example.com"
                    type="url"
                  />
                  <span className="mt-1.5 block text-xs text-[rgba(33,37,41,0.55)]">
                    Leave empty (or use #) to hide the &ldquo;Visit website&rdquo;
                    link.
                  </span>
                </label>
              </div>
              <div className="col-span-full">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Description
                  </span>
                  <textarea
                    value={draft.description}
                    rows={3}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="One or two lines about the work you did for them."
                    className="w-full resize-y rounded-lg border border-[rgba(33,37,41,0.18)] bg-white px-3.5 py-2.5 text-sm leading-relaxed transition placeholder:text-[rgba(33,37,41,0.35)] focus:border-accent focus:shadow-[0_0_0_3px_rgba(13,131,253,0.15)] focus:outline-none"
                  ></textarea>
                </label>
              </div>
            </FormSection>
          </div>
        </Panel>
      )}

      <Panel
        title={`Brands (${items.length})`}
        description="Client logos shown on /brands and in the client strip."
        icon="bi-award"
        actions={
          <Button
            onClick={() => {
              setMessage(null);
              setEditingId("new");
              setDraft(emptyDraft);
            }}
            disabled={busy}
          >
            <i className="bi bi-plus-lg"></i>
            New brand
          </Button>
        }
      >
        {items.length === 0 ? (
          <EmptyState
            icon="bi-award"
            title="No brands yet"
            text="Add your client logos and they appear across the site."
            action={
              <Button
                onClick={() => {
                  setEditingId("new");
                  setDraft(emptyDraft);
                }}
              >
                <i className="bi bi-plus-lg"></i>
                New brand
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((brand) => (
              <div
                key={brand.id}
                className="group flex flex-col rounded-xl border border-black/[.07] bg-white p-4 transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)]"
              >
                <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-light-bg p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h4 className="mb-1 text-sm font-bold">{brand.name}</h4>
                {brand.website && brand.website !== "#" && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-1 truncate text-[11px] text-accent"
                  >
                    {brand.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {brand.description && (
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[rgba(33,37,41,0.55)]">
                    {brand.description}
                  </p>
                )}

                <div className="mt-auto flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1 !px-3 !py-2 text-xs"
                    onClick={() => {
                      setMessage(null);
                      setEditingId(brand.id);
                      setDraft({
                        name: brand.name,
                        logo: brand.logo,
                        website: brand.website,
                        description: brand.description,
                      });
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="!px-3 !py-2 text-xs"
                    onClick={() => remove(brand)}
                    disabled={busy}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}