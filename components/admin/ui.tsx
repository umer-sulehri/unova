"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------

export const cardClass =
  "rounded-xl border border-black/[.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]";

export function Panel({
  title,
  description,
  icon,
  actions,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  icon?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${cardClass} overflow-hidden ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[.07] bg-[#fbfcfd] px-6 py-4">
          <div>
            {title && (
              <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
                {icon && <i className={`bi ${icon} text-accent`}></i>}
                {title}
              </h2>
            )}
            {description && (
              <p className="mb-0 mt-1 text-xs text-[rgba(33,37,41,0.55)]">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-full mt-2">
      <div className="mb-4 flex items-center gap-3">
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/[.08] text-accent">
            <i className={`bi ${icon}`}></i>
          </span>
        )}
        <div>
          <h3 className="mb-0 text-base font-bold text-heading">{title}</h3>
          {description && (
            <p className="mb-0 text-xs text-[rgba(33,37,41,0.55)]">
              {description}
            </p>
          )}
        </div>
        <span className="h-px flex-1 bg-black/[.07]"></span>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form controls
// ---------------------------------------------------------------------------

export function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-heading">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs text-[rgba(33,37,41,0.55)]">
          {hint}
        </span>
      )}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-[rgba(33,37,41,0.18)] bg-white px-3.5 py-2.5 text-sm transition placeholder:text-[rgba(33,37,41,0.35)] focus:border-accent focus:shadow-[0_0_0_3px_rgba(13,131,253,0.15)] focus:outline-none";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} ${className}`}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} resize-y leading-relaxed ${className}`}
    />
  );
}

const SWATCHES = [
  "#0d83fd",
  "#198754",
  "#ffc107",
  "#0dcaf0",
  "#6c757d",
  "#dc3545",
  "#6f42c1",
  "#fd7e14",
  "#20c997",
  "#212529",
];

export function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="relative h-[42px] w-[56px] shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[rgba(33,37,41,0.2)]">
        <input
          type="color"
          value={value || "#0d83fd"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute -left-2 -top-2 h-[60px] w-[72px] cursor-pointer border-0 p-0"
        />
      </label>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder="#0d83fd"
        className="min-w-[110px] flex-1 font-mono"
      />
      <div className="flex flex-wrap gap-1.5">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            onClick={() => onChange(swatch)}
            title={swatch}
            style={{ backgroundColor: swatch }}
            className={`h-6 w-6 rounded-full transition hover:scale-110 ${
              value.toLowerCase() === swatch
                ? "ring-2 ring-accent ring-offset-2"
                : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Image picker: drag & drop / click to upload, with a preview and an
 * optional manual URL field for images that already live somewhere else.
 */
export function ImageField({
  label,
  value,
  onChange,
  hint,
  aspect = "aspect-video",
  fit = "object-cover",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  aspect?: string;
  fit?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error ?? "Upload failed."
        );
      }
      onChange((data as { url: string }).url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-heading">
        {label}
      </span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`group relative overflow-hidden rounded-xl border-2 border-dashed transition ${
          dragging
            ? "border-accent bg-accent/[.06]"
            : "border-[rgba(33,37,41,0.18)] bg-[#fbfcfd] hover:border-accent/50"
        }`}
      >
        <div className={`${aspect} w-full ${value ? "" : "p-6"}`}>
          {value ? (
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className={`h-full w-full ${fit}`}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-default"
                >
                  <i className="bi bi-arrow-repeat mr-1"></i> Replace
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  <i className="bi bi-trash mr-1"></i> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
            >
              {uploading ? (
                <>
                  <span className="spinner-border h-6 w-6 text-accent" aria-hidden="true"></span>
                  <span className="text-sm font-semibold text-accent">
                    Uploading…
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/[.08] text-xl text-accent">
                    <i className="bi bi-cloud-arrow-up"></i>
                  </span>
                  <span className="text-sm font-semibold text-heading">
                    Click to upload or drag an image here
                  </span>
                  <span className="text-xs text-[rgba(33,37,41,0.5)]">
                    PNG, JPG, WEBP, GIF, AVIF or SVG · up to 5 MB
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="mt-2 mb-0 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <i className="bi bi-exclamation-triangle mt-[1px]"></i>
          {error}
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="text-xs font-semibold text-accent hover:text-accent/80"
        >
          <i className={`bi ${showUrl ? "bi-dash" : "bi-plus"} mr-1`}></i>
          {showUrl ? "Hide" : "Use an existing URL instead"}
        </button>
        {value && (
          <span className="truncate font-mono text-[11px] text-[rgba(33,37,41,0.45)]">
            {value}
          </span>
        )}
      </div>

      {showUrl && (
        <div className="mt-2">
          <TextInput
            value={value}
            onChange={onChange}
            placeholder="/img/portfolio/portfolio-1.png or https://…"
            className="font-mono text-xs"
          />
        </div>
      )}

      {hint && (
        <span className="mt-1.5 block text-xs text-[rgba(33,37,41,0.55)]">
          {hint}
        </span>
      )}
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-black/[.07] bg-white px-3 py-2.5 text-sm font-medium text-default transition hover:border-accent/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 accent-[#0d83fd]"
      />
      {label}
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-[52px] shrink-0 rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-accent" : "bg-[rgba(33,37,41,0.22)]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ${
          checked ? "left-[27px]" : "left-1"
        }`}
      ></span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

export const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const btnPrimary = `${btnBase} bg-accent text-white shadow-[0_4px_12px_rgba(13,131,253,0.25)] hover:bg-accent/90`;
export const btnSecondary = `${btnBase} border border-[rgba(33,37,41,0.18)] bg-white text-default hover:border-accent/50 hover:bg-accent/[.04] hover:text-accent`;
export const btnDanger = `${btnBase} border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100`;
export const btnGhost = `${btnBase} px-3 py-2 text-[rgba(33,37,41,0.65)] hover:bg-black/[.04] hover:text-default`;

export function Button({
  variant = "primary",
  icon,
  children,
  className = "",
  ...rest
}: {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: string;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const map = {
    primary: btnPrimary,
    secondary: btnSecondary,
    danger: btnDanger,
    ghost: btnGhost,
  };
  return (
    <button className={`${map[variant]} ${className}`} {...rest}>
      {icon && <i className={`bi ${icon}`}></i>}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Repeating-list helpers
// ---------------------------------------------------------------------------

/** Edits a string[] as one item per line in a textarea. */
export function StringList({
  label,
  items,
  onChange,
  hint,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint ?? "One item per line."}>
      <TextArea
        rows={Math.max(3, Math.min(12, items.length + 1))}
        value={items.join("\n")}
        onChange={(text) =>
          onChange(
            text
              .split("\n")
              .map((l) => l.trim())
              .filter((l) => l !== "")
          )
        }
      />
    </Field>
  );
}

export function TagInput({
  label,
  items,
  onChange,
  placeholder = "Type and press Enter",
  hint,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [value, setValue] = useState("");

  const add = () => {
    const trimmed = value.trim();
    if (!trimmed || items.includes(trimmed)) {
      setValue("");
      return;
    }
    onChange([...items, trimmed]);
    setValue("");
  };

  return (
    <Field label={label} hint={hint}>
      <div className="rounded-lg border border-[rgba(33,37,41,0.18)] bg-white p-2">
        {items.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent/[.08] py-1 pr-1.5 pl-2.5 text-xs font-medium text-accent"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onChange(items.filter((i) => i !== item))}
                  aria-label={`Remove ${item}`}
                  className="flex h-4 w-4 items-center justify-center rounded-full transition hover:bg-accent hover:text-white"
                >
                  <i className="bi bi-x"></i>
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-1.5 py-1 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={add}
            className="rounded-md bg-accent/[.08] px-2.5 py-1 text-xs font-semibold text-accent transition hover:bg-accent hover:text-white"
          >
            Add
          </button>
        </div>
      </div>
    </Field>
  );
}

export function ItemCard({
  title,
  subtitle,
  style,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  style?: CSSProperties;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${cardClass} p-6`} style={style}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="mb-0 text-base font-bold">{title}</h3>
          {subtitle && (
            <p className="mb-0 text-xs text-[rgba(33,37,41,0.55)]">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export function StatusMessage({ message }: { message: string | null }) {
  if (!message) return null;
  const isError = /^error|failed|invalid|unauthorized/i.test(message);
  return (
    <p
      className={`mb-0 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
      role="status"
    >
      <i className={`bi ${isError ? "bi-exclamation-triangle" : "bi-check-circle"} mt-[2px]`}></i>
      {message}
    </p>
  );
}

export function EmptyState({
  icon = "bi-inbox",
  title,
  text,
  action,
}: {
  icon?: string;
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/10 px-6 py-16 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/[.08] text-2xl text-accent">
        <i className={`bi ${icon}`}></i>
      </span>
      <h3 className="mb-1 text-base font-bold">{title}</h3>
      {text && (
        <p className="mb-0 max-w-[420px] text-sm text-[rgba(33,37,41,0.6)]">
          {text}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export async function api<T>(
  url: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(url, {
    method: options?.method ?? "GET",
    headers: options?.body ? { "Content-Type": "application/json" } : undefined,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error ?? `Request failed (${res.status})`
    );
  }
  return data as T;
}