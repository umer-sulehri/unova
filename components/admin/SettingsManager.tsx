"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { SOCIAL_FIELDS } from "@/lib/site-shared";
import {
  THEME_DEFAULTS,
  contrastRatio,
  isDefaultTheme,
  sanitizeTheme,
  themeCssVars,
} from "@/lib/theme";
import type { SiteSettings, SiteTheme } from "@/lib/types";
import {
  Button,
  ColorInput,
  Field,
  FormSection,
  ImageField,
  Panel,
  StatusMessage,
  TextArea,
  TextInput,
  inputClass,
} from "./ui";

export default function SettingsManager({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const router = useRouter();
  const { settings, setSettings, refresh } = useSiteSettings();
  const [draft, setDraft] = useState<SiteSettings>(initialSettings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const patch = (values: Partial<SiteSettings>) =>
    setDraft((current) => ({ ...current, ...values }));

  /**
   * Theme picking is a live preview: the picked palette is pushed into the
   * provider, which rewrites the `--brand-*` custom properties on <html>, so
   * the whole page repaints immediately. Nothing is written until Save.
   */
  const [preview, setPreview] = useState<SiteTheme | null>(null);
  const theme = sanitizeTheme(preview ?? draft.theme);
  const accentOnWhite = useMemo(
    () => contrastRatio(theme.accent, "#ffffff"),
    [theme.accent]
  );
  const accentFailsAa = accentOnWhite < 4.5;

  const updateTheme = (values: Partial<SiteTheme>) => {
    const next = sanitizeTheme({ ...theme, ...values });
    setPreview(next);
    setSettings({ ...settings, theme: next });
  };

  const resetTheme = () => {
    setPreview(null);
    patch({ theme: { ...THEME_DEFAULTS } });
    setSettings({ ...settings, theme: { ...THEME_DEFAULTS } });
  };

  const patchAddress = (values: Partial<SiteSettings["address"]>) =>
    setDraft((current) => ({
      ...current,
      address: { ...current.address, ...values },
    }));

  const patchSocial = (key: keyof SiteSettings["socials"], value: string) =>
    setDraft((current) => ({
      ...current,
      socials: { ...current.socials, [key]: value },
    }));

  const save = async () => {
    if (!draft.siteName.trim()) {
      setMessage("Site name is required.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/site/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, theme }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error ?? "Could not save settings."
        );
      }
      const saved = data as SiteSettings;
      setDraft(saved);
      setSettings(saved);
      setPreview(null);
      setMessage("Settings saved. The whole site now uses these values.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setDraft(initialSettings);
    setSettings(initialSettings);
    setPreview(null);
    await refresh();
    setMessage("Reverted to the last saved values.");
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Site Settings"
        description="Brand name, logo, contact details and social links used across the whole site."
        icon="bi-sliders"
        actions={
          <>
            <Button variant="secondary" onClick={reset} disabled={busy}>
              Revert
            </Button>
            <Button onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save settings"}
            </Button>
          </>
        }
      >
        <StatusMessage message={message} />

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <FormSection
            title="Theme colors"
            description="Repaints buttons, links, headings and section backgrounds across the whole site."
            icon="bi-palette"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Accent color"
                hint="Buttons, links, icons and highlights."
              >
                <ColorInput
                  value={theme.accent}
                  onChange={(v) => updateTheme({ accent: v })}
                />
              </Field>

              <Field
                label="Heading color"
                hint="Every h1–h6 on the site."
              >
                <ColorInput
                  value={theme.heading}
                  onChange={(v) => updateTheme({ heading: v })}
                />
              </Field>

              <Field
                label="Body text color"
                hint="Paragraphs and general copy."
              >
                <ColorInput
                  value={theme.text}
                  onChange={(v) => updateTheme({ text: v })}
                />
              </Field>

              <Field
                label="Alt section background"
                hint="The tinted band behind alternate sections."
              >
                <ColorInput
                  value={theme.lightBg}
                  onChange={(v) => updateTheme({ lightBg: v })}
                />
              </Field>
            </div>

            {/* Live swatch preview */}
            <div className="mt-5 overflow-hidden rounded-xl border border-black/[.08]">
              <div
                className="flex flex-wrap items-center gap-3 px-5 py-4"
                style={{ background: theme.lightBg }}
              >
                <span className="text-xl font-bold" style={{ color: theme.heading }}>
                  Preview heading
                </span>
                <span style={{ color: theme.text }}>
                  Body copy on the tinted band
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 bg-white px-5 py-4">
                <span
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{
                    background: theme.accent,
                    color: themeCssVars(theme)["--on-accent"],
                  }}
                >
                  Primary button
                </span>
                <span className="text-sm font-medium" style={{ color: theme.accent }}>
                  Accent link
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: theme.accent, color: themeCssVars(theme)["--on-accent"] }}
                >
                  Badge
                </span>
                {preview ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setSettings({
                        ...settings,
                        theme: sanitizeTheme(initialSettings.theme),
                      });
                    }}
                    className="ml-auto text-xs font-semibold text-[rgba(33,37,41,0.55)] underline transition hover:text-accent"
                  >
                    Discard preview
                  </button>
                ) : (
                  <span className="ml-auto text-xs text-[rgba(33,37,41,0.55)]">
                    Showing saved colors
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  accentFailsAa
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <i className={`bi ${accentFailsAa ? "bi-exclamation-triangle" : "bi-check-circle"}`}></i>
                Accent on white: {accentOnWhite.toFixed(2)}:1
                {accentFailsAa ? " — below WCAG AA for small text" : " — passes AA"}
              </span>

              <Button
                variant="secondary"
                disabled={busy}
                onClick={resetTheme}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset palette
              </Button>

              {isDefaultTheme(theme) ? null : (
                <span className="text-xs text-[rgba(33,37,41,0.6)]">
                  Previewing — hit Save settings to keep it.
                </span>
              )}
            </div>
          </FormSection>

          <FormSection
            title="Brand identity"
            description="Shown in the header, footer, page titles and social previews."
            icon="bi-badge-ad"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Site name" hint="Used in the header, titles and schema.">
                <TextInput
                  value={draft.siteName}
                  onChange={(v) => patch({ siteName: v })}
                  placeholder="UNOVA"
                />
              </Field>

              <Field label="Tagline" hint="One line describing what you do.">
                <TextInput
                  value={draft.tagline}
                  onChange={(v) => patch({ tagline: v })}
                  placeholder="UI/UX design, web development & marketing"
                />
              </Field>

              <Field
                className="md:col-span-2"
                label="Meta description"
                hint="Shown by Google under the page title. Aim for 140–160 characters."
              >
                <TextArea
                  value={draft.description}
                  onChange={(v) => patch({ description: v })}
                  rows={3}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Logos & icons"
            description="Upload a logo, favicon and social share image."
            icon="bi-image"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <ImageField
                label="Site logo"
                value={draft.logo}
                onChange={(v) => patch({ logo: v })}
                hint="Displayed in the header and footer. Wide logos work best."
                aspect="aspect-[3/1]"
                fit="object-contain"
              />

              <ImageField
                label="Favicon"
                value={draft.favicon}
                onChange={(v) => patch({ favicon: v })}
                hint="Square image, 512×512 px or larger."
                aspect="aspect-square"
                fit="object-contain"
              />

              <ImageField
                label="Apple touch icon"
                value={draft.appleIcon}
                onChange={(v) => patch({ appleIcon: v })}
                hint="Used on iOS home screens, 180×180 px."
                aspect="aspect-square"
                fit="object-contain"
              />

              <ImageField
                label="Social share image"
                value={draft.ogImage}
                onChange={(v) => patch({ ogImage: v })}
                hint="Shown when the site is shared. Keep it 1200×630 px."
                aspect="aspect-[1200/630]"
                fit="object-cover"
              />
            </div>
          </FormSection>

          <FormSection
            title="Contact details"
            description="Shown in the footer and the contact section."
            icon="bi-telephone"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Contact person"
                hint="Name shown on the homepage WhatsApp card, e.g. Umer."
              >
                <TextInput
                  value={draft.contactName}
                  onChange={(v) => patch({ contactName: v })}
                  placeholder="Umer"
                />
              </Field>

              <Field label="Phone number" hint="Display format, e.g. +92 309 4785572.">
                <TextInput
                  value={draft.phone}
                  onChange={(v) => patch({ phone: v })}
                  placeholder="+92 309 4785572"
                />
              </Field>

              <Field
                label="WhatsApp number"
                hint="Country code and digits only, e.g. 923094785572."
              >
                <TextInput
                  value={draft.whatsapp}
                  onChange={(v) => patch({ whatsapp: v })}
                  placeholder="923094785572"
                />
              </Field>

              <Field label="Email address">
                <TextInput
                  type="email"
                  value={draft.email}
                  onChange={(v) => patch({ email: v })}
                  placeholder="hello@yourdomain.com"
                />
              </Field>

              <Field label="Business hours">
                <TextInput
                  value={draft.businessHours}
                  onChange={(v) => patch({ businessHours: v })}
                  placeholder="Mon – Sat, 10:00 AM – 7:00 PM"
                />
              </Field>

              <Field
                className="md:col-span-2"
                label="Google Maps link"
                hint="Optional. The address becomes clickable when set."
              >
                <TextInput
                  value={draft.mapUrl}
                  onChange={(v) => patch({ mapUrl: v })}
                  placeholder="https://maps.app.goo.gl/..."
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Office address"
            description="Used for the footer, contact card and local SEO schema."
            icon="bi-geo-alt"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field className="md:col-span-2" label="Street address">
                <TextInput
                  value={draft.address.street}
                  onChange={(v) => patchAddress({ street: v })}
                  placeholder="Arooj Center, Fareed Kot Road"
                />
              </Field>

              <Field label="City">
                <TextInput
                  value={draft.address.city}
                  onChange={(v) => patchAddress({ city: v })}
                  placeholder="Lahore"
                />
              </Field>

              <Field label="Region / province">
                <TextInput
                  value={draft.address.region}
                  onChange={(v) => patchAddress({ region: v })}
                  placeholder="Punjab"
                />
              </Field>

              <Field label="Postal code">
                <TextInput
                  value={draft.address.postalCode}
                  onChange={(v) => patchAddress({ postalCode: v })}
                  placeholder="54660"
                />
              </Field>

              <Field label="Country">
                <TextInput
                  value={draft.address.country}
                  onChange={(v) => patchAddress({ country: v })}
                  placeholder="Pakistan"
                />
              </Field>

              <Field
                label="Country code"
                hint="Two letters, used for schema and geo tags (PK)."
              >
                <TextInput
                  value={draft.address.countryCode}
                  onChange={(v) =>
                    patchAddress({ countryCode: v.toUpperCase().slice(0, 2) })
                  }
                  placeholder="PK"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Social profiles"
            description="Leave a field empty to hide that icon. Filled links appear in the footer."
            icon="bi-share"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {SOCIAL_FIELDS.map((field) => (
                <Field key={field.key} label={field.label}>
                  <div className="relative">
                    <i
                      className={`bi ${field.icon} pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(33,37,41,0.4)]`}
                    ></i>
                    <input
                      value={draft.socials[field.key]}
                      onChange={(e) => patchSocial(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
              ))}
            </div>
          </FormSection>

          <FormSection
            title="Live preview"
            description="How these values appear on the public site."
            icon="bi-eye"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-black/[.07] bg-[#fbfcfd] p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[.12em] text-[rgba(33,37,41,0.45)]">
                  Header & footer
                </p>
                <div className="flex items-center gap-2 border-b border-black/[.07] pb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={draft.logo}
                    alt=""
                    className="h-7 w-auto max-w-[120px] object-contain"
                  />
                  <span className="text-xs text-[rgba(33,37,41,0.5)]">
                    {draft.siteName}
                  </span>
                </div>
                <ul className="m-0 mt-4 list-none space-y-1.5 p-0 text-sm text-[rgba(33,37,41,0.8)]">
                  <li>
                    <i className="bi bi-geo-alt mr-2 text-accent"></i>
                    {[
                      draft.address.street,
                      draft.address.city,
                      draft.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </li>
                  <li>
                    <i className="bi bi-telephone mr-2 text-accent"></i>
                    {draft.phone || "No phone set"}
                  </li>
                  <li>
                    <i className="bi bi-envelope mr-2 text-accent"></i>
                    {draft.email || "No email set"}
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-black/[.07] bg-[#fbfcfd] p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[.12em] text-[rgba(33,37,41,0.45)]">
                  Google result
                </p>
                <p className="mb-1 truncate text-xs text-[#202124]">
                  {draft.siteName} | UI/UX, Web Development &amp; Marketing in
                  Lahore
                </p>
                <p className="mb-1 truncate text-xs text-[#5f6368]">
                  {draft.siteName.toLowerCase().replace(/\s+/g, "")}.com
                </p>
                <p className="mb-0 line-clamp-3 text-xs leading-relaxed text-[#4d5156]">
                  {draft.description}
                </p>
              </div>
            </div>
          </FormSection>
        </div>
      </Panel>
    </div>
  );
}
