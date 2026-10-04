"use client";

import { useState } from "react";
import type {
  FaqItem,
  PackageCard,
  ProcessStep,
  Project,
  Service,
  ServiceBenefit,
} from "@/lib/types";
import IconPicker from "./IconPicker";
import {
  Button,
  Checkbox,
  ColorInput,
  EmptyState,
  Field,
  FormSection,
  ImageField,
  Panel,
  StatusMessage,
  StringList,
  TagInput,
  TextArea,
  TextInput,
  api,
} from "./ui";

function SubCard({
  label,
  icon,
  onRemove,
  children,
}: {
  label: string;
  icon?: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-12 rounded-xl border border-black/[.07] bg-[#fbfcfd] p-5 md:col-span-6 xl:col-span-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[rgba(33,37,41,0.55)]">
          {icon && <i className={`bi ${icon} text-accent`}></i>}
          {label}
        </span>
        <button
          type="button"
          onClick={onRemove}
          title="Remove"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[rgba(33,37,41,0.4)] transition hover:bg-red-50 hover:text-red-600"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="col-span-full">
      <Button variant="secondary" icon="bi-plus-lg" onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}

type Draft = {
  slug: string;
  title: string;
  icon: string;
  color: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  benefits: ServiceBenefit[];
  process: ProcessStep[];
  packages: PackageCard[];
  faq: FaqItem[];
  relatedProjects: string[];
  overviewText: string;
  deliverables: string[];
  tools: string[];
};

const emptyDraft = (): Draft => ({
  slug: "",
  title: "",
  icon: "bi-star",
  color: "#0d83fd",
  tagline: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  benefits: [],
  process: [],
  packages: [],
  faq: [],
  relatedProjects: [],
  overviewText: "",
  deliverables: [],
  tools: [],
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toDraft(s: Service): Draft {
  return {
    slug: s.slug,
    title: s.title,
    icon: s.icon,
    color: s.color,
    tagline: s.tagline,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    heroImage: s.heroImage,
    benefits: s.benefits ?? [],
    process: s.process ?? [],
    packages: s.packages ?? [],
    faq: s.faq ?? [],
    relatedProjects: s.relatedProjects ?? [],
    overviewText: (s.overview ?? []).join("\n\n"),
    deliverables: s.deliverables ?? [],
    tools: s.tools ?? [],
  };
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n|\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function ServicesManager({
  initialItems,
  projects,
}: {
  initialItems: Service[];
  projects: Project[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const startEdit = (s: Service) => {
    setMessage(null);
    setEditingId(s.id);
    setDraft(toDraft(s));
  };

  const buildBody = (): Omit<Service, "id"> => ({
    slug: draft.slug,
    title: draft.title,
    icon: draft.icon || "bi-star",
    color: draft.color || "#0d83fd",
    tagline: draft.tagline,
    heroTitle: draft.heroTitle,
    heroSubtitle: draft.heroSubtitle,
    heroImage: draft.heroImage,
    overview: paragraphs(draft.overviewText),
    benefits: draft.benefits,
    process: draft.process,
    deliverables: draft.deliverables,
    tools: draft.tools,
    packages: draft.packages,
    faq: draft.faq,
    relatedProjects: draft.relatedProjects,
  });

  const save = async () => {
    if (editingId === null) return;
    setBusy(true);
    setMessage(null);
    try {
      const updated = await api<Service>(
        `/api/admin/content/services/${editingId}`,
        { method: "PUT", body: buildBody() }
      );
      setItems((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setMessage(`Saved "${updated.title}". View it at /services/${updated.slug}`);
      setEditingId(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  function updateList<T>(
    key: "benefits" | "process" | "packages" | "faq",
    index: number,
    patch: Partial<T>
  ) {
    setDraft((d) => ({
      ...d,
      [key]: (d[key] as unknown as T[]).map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function addToList<T>(
    key: "benefits" | "process" | "packages" | "faq",
    blank: T
  ) {
    setDraft((d) => ({
      ...d,
      [key]: [...(d[key] as unknown as T[]), blank],
    }));
  }

  function removeFromList<T>(
    key: "benefits" | "process" | "packages" | "faq",
    index: number
  ) {
    setDraft((d) => ({
      ...d,
      [key]: (d[key] as unknown as T[]).filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="space-y-5">
      <StatusMessage message={message} />

      {editingId !== null && (
        <Panel
          title={`Editing: ${items.find((i) => i.id === editingId)?.title ?? ""}`}
          description="Each block below maps to a section on the public service page."
          icon="bi-pencil-square"
          actions={
            <>
              <Button onClick={save} disabled={busy}>
                <i className="bi bi-check-lg"></i>
                {busy ? "Saving…" : "Save service"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditingId(null)}
                disabled={busy}
              >
                Close editor
              </Button>
            </>
          }
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <FormSection title="Basics" description="Name, slug and card styling" icon="bi-info-circle">
              <Field label="Title">
                <TextInput
                  value={draft.title}
                  onChange={(v) => set("title", v)}
                  placeholder="UI/UX Design"
                />
              </Field>
              <Field label="Slug" hint={`/services/${draft.slug || "…"}`}>
                <TextInput
                  value={draft.slug}
                  onChange={(v) => set("slug", slugify(v))}
                  placeholder="ui-ux"
                />
              </Field>
              <Field label="Tagline" hint="One line shown on the card and services page.">
                <TextInput
                  value={draft.tagline}
                  onChange={(v) => set("tagline", v)}
                  placeholder="Crafting intuitive digital experiences."
                />
              </Field>
              <IconPicker
                value={draft.icon}
                onChange={(v) => set("icon", v)}
                label="Card icon"
                hint="Used on the service card and in the admin list."
              />
              <Field label="Accent color" className="md:col-span-2 xl:col-span-1">
                <ColorInput value={draft.color} onChange={(v) => set("color", v)} />
              </Field>
            </FormSection>

            <FormSection title="Hero Banner" description="Top of the service page" icon="bi-card-image">
              <Field label="Hero title">
                <TextInput
                  value={draft.heroTitle}
                  onChange={(v) => set("heroTitle", v)}
                  placeholder="UI/UX Design Services"
                />
              </Field>
              <Field label="Hero subtitle" className="md:col-span-2 xl:col-span-1">
                <TextArea
                  value={draft.heroSubtitle}
                  onChange={(v) => set("heroSubtitle", v)}
                  rows={3}
                />
              </Field>
              <div className="md:col-span-2 xl:col-span-3">
                <ImageField
                  label="Hero image"
                  value={draft.heroImage}
                  onChange={(v) => set("heroImage", v)}
                  hint="Wide banner works best — around 1600×900 px."
                />
              </div>
            </FormSection>

            <FormSection title="Overview" description="Intro paragraphs" icon="bi-text-paragraph">
              <div className="col-span-full">
                <Field
                  label="Overview paragraphs"
                  hint="Separate paragraphs with a blank line."
                >
                  <TextArea
                    value={draft.overviewText}
                    onChange={(v) => set("overviewText", v)}
                    rows={7}
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Benefits Grid"
              description="Icon cards under the overview"
              icon="bi-grid-3x3-gap"
            >
              {draft.benefits.map((b, i) => (
                <SubCard
                  key={i}
                  label={`Benefit ${i + 1}`}
                  icon={b.icon}
                  onRemove={() => removeFromList<ServiceBenefit>("benefits", i)}
                >
                  <IconPicker
                    value={b.icon}
                    onChange={(v) => updateList<ServiceBenefit>("benefits", i, { icon: v })}
                    label="Icon"
                  />
                  <TextInput
                    value={b.title}
                    onChange={(v) => updateList<ServiceBenefit>("benefits", i, { title: v })}
                    placeholder="Research-Driven"
                  />
                  <TextArea
                    value={b.description}
                    onChange={(v) => updateList<ServiceBenefit>("benefits", i, { description: v })}
                    rows={2}
                  />
                </SubCard>
              ))}
              <AddButton
                label="Add benefit"
                onClick={() =>
                  addToList<ServiceBenefit>("benefits", {
                    icon: "bi-check-circle",
                    title: "",
                    description: "",
                  })
                }
              />
            </FormSection>

            <FormSection
              title="Our Process"
              description="Numbered steps"
              icon="bi-list-ol"
            >
              {draft.process.map((step, i) => (
                <SubCard
                  key={i}
                  label={`Step ${i + 1}`}
                  onRemove={() => removeFromList<ProcessStep>("process", i)}
                >
                  <TextInput
                    value={step.title}
                    onChange={(v) => updateList<ProcessStep>("process", i, { title: v })}
                    placeholder="Discovery & Research"
                  />
                  <TextArea
                    value={step.description}
                    onChange={(v) =>
                      updateList<ProcessStep>("process", i, { description: v })
                    }
                    rows={3}
                  />
                </SubCard>
              ))}
              <AddButton
                label="Add step"
                onClick={() =>
                  addToList<ProcessStep>("process", { title: "", description: "" })
                }
              />
            </FormSection>

            <FormSection
              title="Deliverables & Tools"
              description="Checklist and tech badges"
              icon="bi-check2-square"
            >
              <TagInput
                label="Deliverables"
                items={draft.deliverables}
                onChange={(deliverables) => set("deliverables", deliverables)}
                hint="Shown as a tick list."
              />
              <TagInput
                label="Tools / tech badges"
                items={draft.tools}
                onChange={(tools) => set("tools", tools)}
                hint="Shown as pill badges."
              />
            </FormSection>

            <FormSection
              title="Package Cards"
              description="Pricing tiers"
              icon="bi-box-seam"
            >
              {draft.packages.map((pkg, i) => (
                <SubCard
                  key={i}
                  label={pkg.name || `Package ${i + 1}`}
                  icon="bi-box-seam"
                  onRemove={() => removeFromList<PackageCard>("packages", i)}
                >
                  <TextInput
                    value={pkg.name}
                    onChange={(v) => updateList<PackageCard>("packages", i, { name: v })}
                    placeholder="Full Product Design"
                  />
                  <TextInput
                    value={pkg.tagline}
                    onChange={(v) => updateList<PackageCard>("packages", i, { tagline: v })}
                    placeholder="Who it's for"
                  />
                  <StringList
                    label="Features"
                    items={pkg.features}
                    onChange={(features) =>
                      updateList<PackageCard>("packages", i, { features })
                    }
                  />
                  <Checkbox
                    checked={pkg.highlighted}
                    onChange={(highlighted) =>
                      updateList<PackageCard>("packages", i, { highlighted })
                    }
                    label="Highlight this package"
                  />
                </SubCard>
              ))}
              <AddButton
                label="Add package"
                onClick={() =>
                  addToList<PackageCard>("packages", {
                    name: "",
                    tagline: "",
                    features: [],
                    highlighted: false,
                  })
                }
              />
            </FormSection>

            <FormSection
              title="Mini FAQ"
              description="Accordion at the bottom"
              icon="bi-question-circle"
            >
              {draft.faq.map((f, i) => (
                <SubCard
                  key={i}
                  label={`Q${i + 1}`}
                  icon="bi-question-circle"
                  onRemove={() => removeFromList<FaqItem>("faq", i)}
                >
                  <TextInput
                    value={f.question}
                    onChange={(v) => updateList<FaqItem>("faq", i, { question: v })}
                    placeholder="How long does it take?"
                  />
                  <TextArea
                    value={f.answer}
                    onChange={(v) => updateList<FaqItem>("faq", i, { answer: v })}
                    rows={3}
                  />
                </SubCard>
              ))}
              <AddButton
                label="Add FAQ item"
                onClick={() => addToList<FaqItem>("faq", { question: "", answer: "" })}
              />
            </FormSection>

            <FormSection
              title="Related Projects"
              description="Shown at the bottom of the service page"
              icon="bi-diagram-3"
            >
              <div className="col-span-full grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {projects.length === 0 && (
                  <p className="text-sm text-[rgba(33,37,41,0.55)]">
                    Add projects first to link them here.
                  </p>
                )}
                {projects.map((p) => (
                  <Checkbox
                    key={p.slug}
                    checked={draft.relatedProjects.includes(p.slug)}
                    onChange={(checked) =>
                      set(
                        "relatedProjects",
                        checked
                          ? [...draft.relatedProjects, p.slug]
                          : draft.relatedProjects.filter((s) => s !== p.slug)
                      )
                    }
                    label={p.title}
                  />
                ))}
              </div>
            </FormSection>
          </div>
        </Panel>
      )}

      <Panel
        title={`Services (${items.length})`}
        description="Pick a service to edit its page sections."
        icon="bi-gear"
      >
        {items.length === 0 ? (
          <EmptyState
            icon="bi-gear"
            title="No services yet"
            text="Services appear as cards on /services and as full detail pages."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {[...items]
              .sort((a, b) => a.id - b.id)
              .map((s) => (
                <div
                  key={s.id}
                  className="group flex items-start gap-4 rounded-xl border border-black/[.07] bg-white p-4 transition hover:border-accent/40 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: `${s.color}14`, color: s.color }}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-0 text-sm font-bold">{s.title}</h3>
                    <p className="mb-0 mt-0.5 line-clamp-2 text-xs text-[rgba(33,37,41,0.55)]">
                      {s.tagline}
                    </p>
                    <p className="mb-2 mt-1.5 font-mono text-[11px] text-[rgba(33,37,41,0.4)]">
                      /services/{s.slug}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-light-bg px-2 py-0.5 text-[10px] font-semibold text-[rgba(33,37,41,0.6)]">
                        {s.benefits?.length ?? 0} benefits
                      </span>
                      <span className="rounded-full bg-light-bg px-2 py-0.5 text-[10px] font-semibold text-[rgba(33,37,41,0.6)]">
                        {s.process?.length ?? 0} steps
                      </span>
                      <span className="rounded-full bg-light-bg px-2 py-0.5 text-[10px] font-semibold text-[rgba(33,37,41,0.6)]">
                        {s.packages?.length ?? 0} packages
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    <Button variant="secondary" onClick={() => startEdit(s)}>
                      <i className="bi bi-pencil"></i>
                      Edit
                    </Button>
                    <a
                      href={`/services/${s.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View page"
                      className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[rgba(33,37,41,0.18)] bg-white text-[rgba(33,37,41,0.6)] transition hover:border-accent/50 hover:text-accent"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Panel>
    </div>
  );
}