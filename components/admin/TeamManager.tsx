"use client";

import { useMemo, useState } from "react";
import type { TeamMember } from "@/lib/types";
import {
  Button,
  EmptyState,
  FormSection,
  ImageField,
  Panel,
  StatusMessage,
  Switch,
  TextArea,
  TextInput,
  api,
} from "./ui";

type Draft = {
  id?: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
};

function emptyDraft(nextOrder: number): Draft {
  return { name: "", role: "", image: "", bio: "", order: nextOrder };
}

function toDraft(member: TeamMember): Draft {
  return {
    id: member.id,
    name: member.name,
    role: member.role ?? "",
    image: member.image ?? "",
    bio: member.bio ?? "",
    order: Number.isFinite(member.order) ? member.order : 0,
  };
}

export default function TeamManager({
  initialItems,
  initialVisible,
}: {
  initialItems: TeamMember[];
  initialVisible: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  // Dashboard switch for the whole About section (`visible` is the filtered
  // member list further down, hence the longer name here).
  const [sectionVisible, setSectionVisible] = useState(initialVisible);
  const [visibilityBusy, setVisibilityBusy] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(1));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...items]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id - b.id)
      .filter(
        (m) =>
          !q ||
          m.name.toLowerCase().includes(q) ||
          (m.role ?? "").toLowerCase().includes(q)
      );
  }, [items, query]);

  const startEdit = (member: TeamMember) => {
    setMessage(null);
    setEditingId(member.id);
    setDraft(toDraft(member));
  };

  const startCreate = () => {
    setMessage(null);
    setEditingId("new");
    setDraft(emptyDraft(items.length + 1));
  };

  /** Publish/unpublish the About section without deleting anyone. */
  const toggleVisibility = async (next: boolean) => {
    const previous = sectionVisible;
    setSectionVisible(next);
    setVisibilityBusy(true);
    setVisibilityMessage(null);
    try {
      await api<{ showTeamSection?: boolean }>("/api/admin/content/site/1", {
        method: "PUT",
        body: { showTeamSection: next },
      });
      setVisibilityMessage(
        next
          ? "Team section is live on the About page."
          : "Team section hidden. Your members are kept and return as soon as you switch it back on."
      );
    } catch (err) {
      setSectionVisible(previous);
      setVisibilityMessage(
        err instanceof Error ? err.message : "Could not save the toggle."
      );
    } finally {
      setVisibilityBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (editingId === "new") {
        const created = await api<TeamMember>("/api/admin/content/team", {
          method: "POST",
          body: {
            name: draft.name,
            role: draft.role,
            image: draft.image,
            bio: draft.bio,
            order: Number.isFinite(draft.order) ? draft.order : 0,
            id: undefined,
          },
        });
        setItems((prev) => [...prev, created]);
        setMessage(`Created "${created.name}".`);
      } else if (editingId !== null) {
        const updated = await api<TeamMember>(
          `/api/admin/content/team/${editingId}`,
          {
            method: "PUT",
            body: {
              name: draft.name,
              role: draft.role,
              image: draft.image,
              bio: draft.bio,
              order: Number.isFinite(draft.order) ? draft.order : 0,
              id: undefined,
            },
          }
        );
        setItems((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
        setMessage(`Saved "${updated.name}".`);
      }
      setEditingId(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (member: TeamMember) => {
    if (
      !window.confirm(
        `Delete team member "${member.name}"? This cannot be undone.`
      )
    )
      return;
    setBusy(true);
    try {
      await api(`/api/admin/content/team/${member.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((m) => m.id !== member.id));
      setMessage(`Deleted "${member.name}".`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <Panel
        title="Team section visibility"
        description="Publish or hide the team block on the About page."
        icon="bi-eye"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Switch
              checked={sectionVisible}
              onChange={toggleVisibility}
              disabled={visibilityBusy}
              label="Show the team section on the About page"
            />
            <div>
              <p className="mb-0 text-sm font-semibold text-heading">
                {sectionVisible
                  ? "Visible on the website"
                  : "Hidden from the website"}
              </p>
              <p className="mb-0 mt-1 max-w-[520px] text-xs leading-[1.6] text-[rgba(33,37,41,0.65)]">
                {sectionVisible
                  ? "The section renders on /about using the members listed below."
                  : "Nothing is rendered on /about. Members stay saved here and reappear the moment you switch this back on."}
              </p>
            </div>
          </div>

          <a
            href={sectionVisible ? "/about#team" : "/about"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[rgba(33,37,41,0.18)] bg-white px-4 py-2.5 text-sm font-semibold text-default transition hover:border-accent/50 hover:text-accent"
          >
            <i className="bi bi-box-arrow-up-right"></i>
            {sectionVisible ? "View section" : "View About page"}
          </a>
        </div>

        <StatusMessage message={visibilityMessage} />
      </Panel>

      <StatusMessage message={message} />

      {editingId !== null && (
        <Panel
          title={editingId === "new" ? "Add a team member" : `Edit: ${draft.name}`}
          description="These cards render in the Team section of the About page."
          icon="bi-person-badge"
          actions={
            <>
              <Button onClick={save} disabled={busy || !draft.name.trim()}>
                <i className="bi bi-check-lg"></i>
                {busy ? "Saving…" : "Save member"}
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
            <FormSection title="Profile" icon="bi-person">
              <div className="col-span-full grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Name
                  </span>
                  <TextInput
                    value={draft.name}
                    onChange={(v) => set("name", v)}
                    placeholder="e.g. Umer"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Role
                  </span>
                  <TextInput
                    value={draft.role}
                    onChange={(v) => set("role", v)}
                    placeholder="e.g. Co-Founder & Creative Director"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Short bio
                  </span>
                  <TextArea
                    value={draft.bio}
                    onChange={(v) => set("bio", v)}
                    rows={4}
                    placeholder="One or two sentences about what this person does."
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-heading">
                    Display order
                  </span>
                  <TextInput
                    value={String(draft.order)}
                    onChange={(v) => set("order", Number(v) || 0)}
                    type="number"
                  />
                  <span className="mt-1.5 block text-xs text-[rgba(33,37,41,0.5)]">
                    Lower numbers appear first on /about.
                  </span>
                </label>
              </div>
            </FormSection>

            <FormSection title="Photo" icon="bi-image">
              <div className="col-span-full">
                <ImageField
                  label="Team photo"
                  value={draft.image}
                  onChange={(v) => set("image", v)}
                  hint="Square portrait works best — around 600×600 px."
                />
              </div>
            </FormSection>
          </div>
        </Panel>
      )}

      <Panel
        title={`Team (${visible.length})`}
        description="Search by name or role. Members appear on the About page in display order."
        icon="bi-people"
        actions={
          <>
            <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[rgba(33,37,41,0.4)]"></i>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team…"
                className="w-full rounded-lg border border-[rgba(33,37,41,0.18)] bg-white py-2.5 pl-9 pr-3 text-sm transition focus:border-accent focus:shadow-[0_0_0_3px_rgba(13,131,253,0.15)] focus:outline-none sm:w-[220px]"
              />
            </div>
            <Button onClick={startCreate} disabled={busy}>
              <i className="bi bi-plus-lg"></i>
              New member
            </Button>
          </>
        }
      >
        {visible.length === 0 ? (
          <EmptyState
            icon="bi-people"
            title={items.length === 0 ? "No team members yet" : "No matches found"}
            text={
              items.length === 0
                ? "Add your first team member and it will appear in the About page team section straight away."
                : "Try a different search term."
            }
            action={
              items.length === 0 ? (
                <Button onClick={startCreate}>
                  <i className="bi bi-plus-lg"></i>
                  New member
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-3">
            {visible.map((member, index) => (
              <div
                key={member.id}
                className="group flex flex-wrap items-center gap-4 rounded-xl border border-black/[.07] bg-white p-3 transition hover:border-accent/40 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
              >
                <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-light-bg">
                  {member.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={member.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-lg font-bold text-[rgba(33,37,41,0.35)]">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </span>

                <div className="min-w-[180px] flex-1">
                  <h3 className="mb-0 text-sm font-bold">{member.name}</h3>
                  <p className="mb-0 text-[11px] font-medium text-accent">
                    {member.role || "—"}
                  </p>
                </div>

                <span className="rounded-full bg-light-bg px-2.5 py-1 text-[11px] font-semibold text-[rgba(33,37,41,0.6)]">
                  #{index + 1} · order {member.order ?? 0}
                </span>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => startEdit(member)}>
                    <i className="bi bi-pencil"></i>
                    Edit
                  </Button>
                  <a
                    href={sectionVisible ? "/about#team" : "/about"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={
                      sectionVisible
                        ? "View on site"
                        : "Section hidden — opens the About page"
                    }
                    className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[rgba(33,37,41,0.18)] bg-white text-[rgba(33,37,41,0.6)] transition hover:border-accent/50 hover:text-accent"
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                  <Button
                    variant="danger"
                    onClick={() => remove(member)}
                    disabled={busy}
                  >
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