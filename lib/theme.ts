import type { SiteTheme } from "./types";

/**
 * Brand colours are admin-editable, so every value that reaches the document
 * is validated here first: the theme is injected as CSS custom properties on
 * `<html>`, which means an unescaped string could inject arbitrary CSS.
 * Only strict hex literals are allowed through.
 */
export const THEME_DEFAULTS: SiteTheme = {
  accent: "#0d83fd",
  heading: "#2d465e",
  text: "#212529",
  lightBg: "#f3f9ff",
};

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normalizes `#abc` to `#aabbcc`; anything else falls back to the default. */
export function sanitizeHex(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!HEX.test(trimmed)) return fallback;
  const full =
    trimmed.length === 4
      ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
      : trimmed.toLowerCase();
  return full;
}

/** Coerces any stored/partial theme object into safe, complete hex values. */
export function sanitizeTheme(input: unknown): SiteTheme {
  const stored = (input ?? {}) as Partial<Record<keyof SiteTheme, unknown>>;
  return {
    accent: sanitizeHex(stored.accent, THEME_DEFAULTS.accent),
    heading: sanitizeHex(stored.heading, THEME_DEFAULTS.heading),
    text: sanitizeHex(stored.text, THEME_DEFAULTS.text),
    lightBg: sanitizeHex(stored.lightBg, THEME_DEFAULTS.lightBg),
  };
}

/** True when every channel still holds its factory value. */
export function isDefaultTheme(theme: SiteTheme): boolean {
  return (Object.keys(THEME_DEFAULTS) as (keyof SiteTheme)[]).every(
    (key) => theme[key] === THEME_DEFAULTS[key]
  );
}

function channels(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors (1 – 21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Readable text color for filled accent surfaces (buttons, panels). Picking a
 * light accent would otherwise leave white labels at ~1.9:1.
 */
export function onAccent(accent: string): string {
  return contrastRatio(accent, "#ffffff") >= 3 ? "#ffffff" : "#0b1b2b";
}

/** Blends `hex` toward `target` by `amount` (0–1). Used where CSS is unavailable. */
export function mixHex(hex: string, target: string, amount: number): string {
  const a = channels(sanitizeHex(hex, THEME_DEFAULTS.accent));
  const b = channels(sanitizeHex(target, "#000000"));
  const ratio = Math.min(Math.max(amount, 0), 1);
  const mixed = a.map((value, i) =>
    Math.round(value + (b[i] - value) * ratio)
      .toString(16)
      .padStart(2, "0")
  );
  return `#${mixed.join("")}`;
}

/**
 * CSS custom properties written onto `<html>`. The derived shades are plain
 * `color-mix()` expressions so they follow any accent the admin picks.
 */
export function themeCssVars(theme: SiteTheme): Record<string, string> {
  const accent = sanitizeHex(theme.accent, THEME_DEFAULTS.accent);
  return {
    "--brand-accent": accent,
    "--brand-heading": sanitizeHex(theme.heading, THEME_DEFAULTS.heading),
    "--brand-text": sanitizeHex(theme.text, THEME_DEFAULTS.text),
    "--brand-light-bg": sanitizeHex(theme.lightBg, THEME_DEFAULTS.lightBg),
    "--on-accent": onAccent(accent),
  };
}