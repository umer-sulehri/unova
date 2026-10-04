"use client";

import { useState } from "react";
import type { GalleryItem } from "@/lib/types";
import {
  Button,
  EmptyState,
  FormSection,
  ImageField,
  Panel,
  StatusMessage,
  TagInput,
  TextInput,
  api,
} from "./ui";

type Draft = { title: string; categories: string[]; image: string };

const emptyDraft: Draft = { title: "", categories: [], image: "" };

export default function GalleryManager({
  initialItems,
}: {
  initialItems: GalleryItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toDraft = (item: GalleryItem): Draft => ({
    title: item.title,
    categories: item.category ? [item.category] : [],
    image: item.image,
  });

  const toBody = (d: Draft) => ({
    title: d.title,
    category: d.categories[0] ?? "",
    image: d.image,
  });

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (editingId === "new") {
        const created = await api<GalleryItem>("/api/admin/content/gallery", {
          method: "POST",
          body: toBody(draft),
        });
        setItems((prev) => [...prev, created]);
        setMessage(`Added "${created.title}".`);
      } else if (editingId !== null) {
        const updated = await api<GalleryItem>(
          `/api/admin/content/gallery/${editingId}`,
          { method: "PUT", body: toBody(draft) }
        );
        setItems((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        setMessage(`Saved "${updated.title}".`);
      }
      setEditingId(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: GalleryItem) => {
    if (!window.confirm(`Remove "${item.title}" from the gallery?`)) return;
    setBusy(true);
    try {
      await api(`/api/admin/content/gallery/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      setMessage(`Removed "${item.title}".`);
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
          title={editingId === "new" ? "Add a gallery image" : `Edit: ${draft.title}`}
          icon="bi-pencil-square"
          actions={
            <>
              <Button
                onClick={save}
                disabled={busy || !draft.title.trim() || !draft.image.trim()}
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
            <FormSection title="Image" icon="bi-image">
              <div className="col-span-full">
                <ImageField
                  label="Upload image"
                  value={draft.image}
                  onChange={(v) => set("image", v)}
                  hint="Square or 4:3 crops look best in the grid — around 1200×900 px."
                />
              </div>
            </FormSection>

            <FormSection title="Details" icon="bi-card-text">
              <div className="col-span-full">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Title
                  </span>
                  <TextInput
                    value={draft.title}
                    onChange={(v) => set("title", v)}
                    placeholder="Restaurant landing page"
                  />
                </label>
              </div>
              <div className="col-span-full">
                <TagInput
                  label="Category"
                  items={draft.categories}
                  onChange={(categories) => set("categories", categories)}
                  placeholder="e.g. Web Design"
                  hint="The first tag is used as the item's category."
                />
              </div>
            </FormSection>
          </div>
        </Panel>
      )}

      <Panel
        title={`Gallery images (${items.length})`}
        description="Drag-free grid preview of everything on /gallery."
        icon="bi-images"
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
            New image
          </Button>
        }
      >
        {items.length === 0 ? (
          <EmptyState
            icon="bi-images"
            title="No gallery images yet"
            text="Upload your first image and it shows up on the public gallery page instantly."
            action={
              <Button
                onClick={() => {
                  setEditingId("new");
                  setDraft(emptyDraft);
                }}
              >
                <i className="bi bi-plus-lg"></i>
                New image
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-black/[.07] bg-white transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)]"
              >
                <span className="relative block h-40 w-full overflow-hidden bg-light-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[rgba(33,37,41,0.65)]">
                    {item.category || "Uncategorized"}
                  </span>
                </span>

                <div className="p-4">
                  <h4 className="mb-0 truncate text-sm font-bold">{item.title}</h4>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 !px-3 !py-2 text-xs"
                      onClick={() => {
                        setMessage(null);
                        setEditingId(item.id);
                        setDraft(toDraft(item));
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="!px-3 !py-2 text-xs"
                      onClick={() => remove(item)}
                      disabled={busy}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}