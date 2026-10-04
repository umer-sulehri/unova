import { getSiteSettings } from "@/lib/site";
import {
  SOCIAL_FIELDS,
  formatAddress,
  telHref,
  whatsappHref,
} from "@/lib/site-shared";

export default async function ContactDetails() {
  const settings = await getSiteSettings();
  const address = formatAddress(settings);
  const mapsUrl =
    settings.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

  const socials = SOCIAL_FIELDS.map((field) => ({
    label: field.label,
    icon: field.icon,
    href: settings.socials[field.key] ?? "",
  })).filter((social) => social.href.trim().length > 0);

  const details = [
    {
      icon: "bi-geo-alt-fill",
      label: "Studio address",
      value: address,
      href: mapsUrl,
      external: true,
    },
    {
      icon: "bi-telephone-fill",
      label: "Phone",
      value: settings.phone,
      href: telHref(settings.phone),
      external: false,
    },
    {
      icon: "bi-envelope-fill",
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      external: false,
    },
  ].filter((item) => item.value);

  return (
    <div
      className="relative h-full overflow-hidden rounded-3xl p-8 text-white shadow-[0_25px_60px_color-mix(in_srgb,var(--brand-accent)_38%,transparent)] lg:p-10"
      style={{
        background:
          "linear-gradient(155deg, var(--brand-accent) 0%, var(--brand-accent-deep) 45%, var(--brand-accent-deepest) 100%)",
      }}
      data-aos="fade-up"
      data-aos-delay="200"
    >
      {/* Subtle texture + glow so the panel does not read as a flat block */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[.18]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl"
      ></div>

      <div className="relative z-[1]">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[.12em] text-white">
          <i className="bi bi-headset"></i>
          Talk to a human
        </span>

        <h2 className="mb-3 text-[1.75rem] font-bold leading-[1.2] text-white max-md:text-[1.5rem]">
          Contact Information
        </h2>
        <p className="mb-8 max-w-[380px] text-[15px] leading-[1.7] text-white/85">
          Call, email or swing by. Every channel reaches the same small team, so
          nothing gets lost in a shared inbox.
        </p>

        <ul className="m-0 mb-8 list-none space-y-3 p-0">
          {details.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-start gap-4 rounded-2xl bg-white/10 p-4 transition-all duration-300 hover:bg-white/20"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg transition-colors duration-300 group-hover:bg-white group-hover:text-[var(--brand-accent-deep)]">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <span className="min-w-0">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-[.14em] text-white/85">
                    {item.label}
                  </span>
                  <span className="block text-[15px] font-semibold leading-snug text-white">
                    {item.value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {settings.businessHours ? (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
            <i className="bi bi-clock text-lg"></i>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-white/85">
                Office hours
              </span>
              <span className="block text-sm font-medium">
                {settings.businessHours}
              </span>
            </span>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {whatsappHref(settings) && (
            <a
              href={whatsappHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-accent-deep)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <i className="bi bi-whatsapp text-lg"></i>
              WhatsApp
            </a>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            <i className="bi bi-signpost-2"></i>
            Get directions
          </a>
        </div>

        {socials.length > 0 && (
          <div className="mt-8 border-t border-white/20 pt-6">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[.14em] text-white/85">
              Follow {settings.siteName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={
                    /^https?:\/\//i.test(social.href)
                      ? social.href
                      : `https://${social.href}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--brand-accent-deep)]"
                >
                  <i className={`bi ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}