"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import {
  Button,
  EmptyState,
  FormSection,
  ImageField,
  Panel,
  StatusMessage,
  TagInput,
  TextArea,
  TextInput,
  api,
} from "./ui";

type Draft = {
  id?: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  categories: string[];
  technologies: string[];
};

function emptyDraft(): Draft {
  return {
    slug: "",
    title: "",
    description: "",
    image: "",
    liveUrl: "",
    codeUrl: "",
    categories: ["web"],
    technologies: [],
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toDraft(p: Project): Draft {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: p.image,
    liveUrl: p.liveUrl,
    codeUrl: p.codeUrl || "",
    categories: p.categories ?? [],
    technologies: p.technologies,
  };
}

export default function ProjectsManager({
  initialItems,
}: {
  initialItems: Project[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...items]
      .sort((a, b) => a.id - b.id)
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.slug.includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
  }, [items, query]);

  const startEdit = (p: Project) => {
    setMessage(null);
    setEditingId(p.id);
    setDraft(toDraft(p));
  };

  const startCreate = () => {
    setMessage(null);
    setEditingId("new");
    setDraft(emptyDraft());
  };

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (editingId === "new") {
        const created = await api<Project>("/api/admin/content/projects", {
          method: "POST",
          body: { ...draft, id: undefined },
        });
        setItems((prev) => [...prev, created]);
        setMessage(`Created "${created.title}".`);
      } else if (editingId !== null) {
        const updated = await api<Project>(
          `/api/admin/content/projects/${editingId}`,
          { method: "PUT", body: { ...draft, id: undefined } }
        );
        setItems((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setMessage(`Saved "${updated.title}".`);
      }
      setEditingId(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Project) => {
    if (!window.confirm(`Delete project "${p.title}"? This cannot be undone.`))
      return;
    setBusy(true);
    try {
      await api(`/api/admin/content/projects/${p.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== p.id));
      setMessage(`Deleted "${p.title}".`);
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
          title={editingId === "new" ? "Create a new project" : `Edit: ${draft.title}`}
          description="Everything here appears on the public project card and detail view."
          icon="bi-pencil-square"
          actions={
            <>
              <Button onClick={save} disabled={busy || !draft.title.trim()}>
                <i className="bi bi-check-lg"></i>
                {busy ? "Saving…" : "Save project"}
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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FormSection title="Basics" icon="bi-info-circle">
              <div className="col-span-full grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Title
                  </span>
                  <TextInput
                    value={draft.title}
                    onChange={(v) => {
                      set("title", v);
                      if (editingId === "new") set("slug", slugify(v));
                    }}
                    placeholder="e.g. Renkli Paints"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Slug
                  </span>
                  <div className="flex items-center gap-2">
                    <TextInput
                      value={draft.slug}
                      onChange={(v) => set("slug", slugify(v))}
                      placeholder="renkli-paints"
                    />
                  </div>
                  <span className="mt-1.5 block font-mono text-xs text-[rgba(33,37,41,0.45)]">
                    /projects/{draft.slug || "…"}
                  </span>
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Description
                  </span>
                  <TextArea
                    value={draft.description}
                    onChange={(v) => set("description", v)}
                    rows={4}
                    placeholder="What was the project about, and what did you deliver?"
                  />
                </label>

                <TagInput
                  label="Categories"
                  items={draft.categories}
                  onChange={(categories) => set("categories", categories)}
                  placeholder="e.g. web"
                  hint="Used as filter chips on /projects."
                />
                <TagInput
                  label="Technologies"
                  items={draft.technologies}
                  onChange={(technologies) => set("technologies", technologies)}
                  placeholder="e.g. React"
                />
              </div>
            </FormSection>

            <FormSection title="Cover image" icon="bi-image">
              <div className="col-span-full">
                <ImageField
                  label="Project thumbnail"
                  value={draft.image}
                  onChange={(v) => set("image", v)}
                  hint="Landscape works best — around 1200×800 px."
                />
              </div>
            </FormSection>

            <FormSection title="Links" icon="bi-link-45deg">
              <div className="col-span-full grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Live URL
                  </span>
                  <TextInput
                    value={draft.liveUrl}
                    onChange={(v) => set("liveUrl", v)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Code URL
                  </span>
                  <TextInput
                    value={draft.codeUrl}
                    onChange={(v) => set("codeUrl", v)}
                    placeholder="Leave empty to hide the button"
                    type="url"
                  />
                </label>
              </div>
            </FormSection>
          </div>
        </Panel>
      )}

      <Panel
        title={`Projects (${visible.length})`}
        description="Search by title, slug or technology."
        icon="bi-collection"
        actions={
          <>
            <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[rgba(33,37,41,0.4)]"></i>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="w-full rounded-lg border border-[rgba(33,37,41,0.18)] bg-white py-2.5 pl-9 pr-3 text-sm transition focus:border-accent focus:shadow-[0_0_0_3px_rgba(13,131,253,0.15)] focus:outline-none sm:w-[220px]"
              />
            </div>
            <Button onClick={startCreate} disabled={busy}>
              <i className="bi bi-plus-lg"></i>
              New project
            </Button>
          </>
        }
      >
        {visible.length === 0 ? (
          <EmptyState
            icon="bi-kanban"
            title={items.length === 0 ? "No projects yet" : "No matches found"}
            text={
              items.length === 0
                ? "Create your first project and it will appear on /projects straight away."
                : "Try a different search term."
            }
            action={
              items.length === 0 ? (
                <Button onClick={startCreate}>
                  <i className="bi bi-plus-lg"></i>
                  New project
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-3">
            {visible.map((p) => (
              <div
                key={p.id}
                className="group flex flex-wrap items-center gap-4 rounded-xl border border-black/[.07] bg-white p-3 transition hover:border-accent/40 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
              >
                <span className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-light-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>

                <div className="min-w-[180px] flex-1">
                  <h3 className="mb-0 text-sm font-bold">{p.title}</h3>
                  <p className="mb-0 truncate font-mono text-[11px] text-[rgba(33,37,41,0.45)]">
                    /{p.slug}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-light-bg px-2 py-0.5 text-[10px] font-semibold text-[rgba(33,37,41,0.6)]"
                      >
                        {t}
                      </span>
                    ))}
                    {p.technologies.length > 4 && (
                      <span className="text-[10px] text-[rgba(33,37,41,0.4)]">
                        +{p.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => startEdit(p)}>
                    <i className="bi bi-pencil"></i>
                    Edit
                  </Button>
                  <a
                    href={`/projects`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on site"
                    className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[rgba(33,37,41,0.18)] bg-white text-[rgba(33,37,41,0.6)] transition hover:border-accent/50 hover:text-accent"
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                  <Button variant="danger" onClick={() => remove(p)} disabled={busy}>
                    <i className="bi bi-trash"></i>
                    Delete
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