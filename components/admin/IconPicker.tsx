"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BOOTSTRAP_ICONS } from "@/lib/bootstrap-icons";

const CATEGORY_RULES: { label: string; keywords: string[] }[] = [
  { label: "Brand & Design", keywords: ["palette", "brush", "paint", "pen", "droplet", "magic", "scissors", "vector", "bezier", "layers", "bounding", "crop", "sliders"] },
  { label: "Code & Tech", keywords: ["code", "terminal", "cpu", "gpu", "server", "database", "cloud", "git", "bug", "gear", "hdd", "memory", "motherboard", "router", "network", "broadcast", "usb", "display", "window", "keyboard", "mouse"] },
  { label: "Business", keywords: ["briefcase", "building", "shop", "cart", "basket", "bag", "currency", "cash", "coin", "credit", "wallet", "receipt", "piggy", "percent", "graph", "chart", "bar", "kanban", "clipboard", "file-earmark", "folder", "archive", "box", "truck", "printer"] },
  { label: "Communication", keywords: ["chat", "envelope", "mail", "telephone", "phone", "at", "bell", "megaphone", "send", "reply", "share", "people", "person", "hand", "emoji", "sms", "voicemail", "rss"] },
  { label: "Media", keywords: ["camera", "image", "film", "video", "music", "play", "pause", "mic", "volume", "speaker", "headphone", "tv", "radio", "disc", "vinyl", "soundwave", "badge", "award", "trophy", "star", "heart", "lightbulb", "easel"] },
  { label: "Arrows", keywords: ["arrow", "chevron", "caret", "return", "forward", "back", "skip", "chevron"] },
  { label: "Places", keywords: ["geo", "map", "house", "home", "building", "shop", "store", "office", "pin", "globe", "compass", "signpost", "road", "train", "car", "airplane", "ship", "bus", "bicycle", "motorcycle", "fuel", "water"] },
  { label: "Security & Status", keywords: ["shield", "lock", "unlock", "key", "eye", "check", "x-", "exclamation", "info", "question", "warning", "ban", "slash", "clipboard", "hourglass", "alarm", "bell", "flag", "patch"] },
];

const CATEGORY_ORDER = [
  "Popular",
  "Brand & Design",
  "Code & Tech",
  "Business",
  "Communication",
  "Media",
  "Arrows",
  "Places",
  "Security & Status",
];

const POPULAR = [
  ...new Set([
  "bi-star",
  "bi-heart",
  "bi-check-circle",
  "bi-lightning-charge",
  "bi-rocket-takeoff",
  "bi-gear",
  "bi-cog",
  "bi-palette",
  "bi-brush",
  "bi-code-slash",
  "bi-laptop",
  "bi-phone",
  "bi-tablet",
  "bi-display",
  "bi-camera",
  "bi-camera-reels",
  "bi-megaphone",
  "bi-graph-up-arrow",
  "bi-bar-chart",
  "bi-briefcase",
  "bi-building",
  "bi-shop",
  "bi-cart",
  "bi-people",
  "bi-person",
  "bi-chat-square-text",
  "bi-envelope",
  "bi-telephone",
  "bi-globe",
  "bi-search",
  "bi-gear-wide-connected",
  "bi-magic",
  "bi-shield-check",
  "bi-award",
  "bi-trophy",
  "bi-lightbulb",
  "bi-box-seam",
  "bi-layers",
  "bi-diagram-3",
  "bi-bezier2",
  "bi-cpu",
  "bi-cloud-arrow-up",
  "bi-database",
  "bi-server",
  "bi-terminal",
  "bi-git",
  "bi-bug",
  "bi-hdd",
  "bi-window",
  "bi-display",
  "bi-sun",
  "bi-moon-stars",
  "bi-clock",
  "bi-calendar",
  "bi-map",
  "bi-house",
  "bi-tree",
  "bi-flower1",
  "bi-droplet",
  "bi-fire",
  "bi-snow",
  "bi-wind",
  "bi-arrow-up-right",
  "bi-arrow-repeat",
  "bi-send",
  "bi-bookmark",
  "bi-tag",
  "bi-wallet",
  "bi-currency-dollar",
  "bi-credit-card",
  "bi-receipt",
  "bi-key",
  "bi-fingerprint",
  "bi-eye",
  "bi-hand-thumbs-up",
  "bi-quote",
  "bi-link-45deg",
  "bi-printer",
  "bi-paperclip",
  "bi-folder",
  "bi-file-earmark-text",
  ] as string[]),
];

function stripPrefix(icon: string): string {
  return icon.replace(/^bi-/, "");
}

function categoryOf(name: string): string {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => name.includes(k))) return rule.label;
  }
  return "Other";
}

export default function IconPicker({
  value,
  onChange,
  label = "Icon",
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const grouped = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const icon of BOOTSTRAP_ICONS) {
      const cat = categoryOf(stripPrefix(icon));
      const list = map.get(cat) ?? [];
      list.push(icon);
      map.set(cat, list);
    }
    return map;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return BOOTSTRAP_ICONS.filter((icon) =>
        stripPrefix(icon).includes(q)
      ).slice(0, 400);
    }
    if (activeCategory === "Popular") {
      return POPULAR.filter((icon) => BOOTSTRAP_ICONS.includes(icon));
    }
    return (grouped.get(activeCategory) ?? []).slice(0, 400);
  }, [query, activeCategory, grouped]);

  const categories = useMemo(() => {
    const extra = [...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c));
    return [...CATEGORY_ORDER, ...extra.sort()];
  }, [grouped]);

  const preview = value || "bi-star";

  return (
    <div className="relative">
      <span className="mb-1 block text-sm font-semibold text-heading">
        {label}
      </span>

      <div className="flex gap-2">
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-accent/[.08] text-xl text-accent">
          <i className={`bi ${preview}`}></i>
        </span>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center justify-between gap-2 rounded-md border border-[rgba(33,37,41,0.2)] bg-white px-3 py-2 text-left text-sm transition hover:border-accent"
        >
          <span className="truncate font-mono text-[13px] text-[rgba(33,37,41,0.75)]">
            {value || "Choose an icon…"}
          </span>
          <i className="bi bi-chevron-down text-xs text-[rgba(33,37,41,0.5)]"></i>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="Clear icon"
            aria-label="Clear icon"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-[rgba(33,37,41,0.2)] bg-white text-[rgba(33,37,41,0.6)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

      {hint && (
        <span className="mt-1 block text-xs text-[rgba(33,37,41,0.55)]">
          {hint}
        </span>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 pt-[8vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Choose an icon"
        >
          <div
            className="flex max-h-[80vh] w-full max-w-[820px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-black/10 px-5 py-4">
              <div className="relative flex-1">
                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[rgba(33,37,41,0.4)]"></i>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 2,000+ icons — try 'rocket', 'camera', 'chart'…"
                  className="w-full rounded-lg border border-[rgba(33,37,41,0.2)] bg-white py-2.5 pl-9 pr-3 text-sm transition focus:border-accent focus:shadow-[0_0_0_3px_rgba(13,131,253,0.15)] focus:outline-none"
                />
              </div>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-sm text-[rgba(33,37,41,0.55)] hover:text-accent"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[rgba(33,37,41,0.6)] transition hover:bg-black/5 hover:text-default"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {!query && (
              <div className="flex gap-2 overflow-x-auto border-b border-black/10 px-5 py-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      activeCategory === cat
                        ? "bg-accent text-white"
                        : "bg-[#f1f3f5] text-[rgba(33,37,41,0.7)] hover:bg-accent/10 hover:text-accent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5">
              {results.length === 0 ? (
                <p className="py-10 text-center text-sm text-[rgba(33,37,41,0.55)]">
                  No icons match &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                  {results.map((icon) => {
                    const active = icon === value;
                    return (
                      <button
                        key={icon}
                        type="button"
                        title={icon}
                        onClick={() => {
                          onChange(icon);
                          setOpen(false);
                        }}
                        className={`group flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border p-2 transition ${
                          active
                            ? "border-accent bg-accent/[.08] text-accent"
                            : "border-transparent hover:border-accent/30 hover:bg-accent/[.05]"
                        }`}
                      >
                        <i className={`bi ${icon} text-xl`}></i>
                        <span className="w-full truncate text-center text-[9px] text-[rgba(33,37,41,0.5)]">
                          {stripPrefix(icon)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-black/10 px-5 py-3 text-xs text-[rgba(33,37,41,0.55)]">
              <span>
                {query
                  ? `${results.length} match${results.length === 1 ? "" : "es"}`
                  : "Click an icon to select it"}
              </span>
              <span className="font-mono">Selected: {value || "none"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}