import Link from "next/link";
import { getSiteSettings } from "@/lib/site";
import { formatAddress, telHref, whatsappHref } from "@/lib/site-shared";

export default async function ContactHero() {
  const settings = await getSiteSettings();
  const address = formatAddress(settings);

  const quickActions = [
    {
      icon: "bi-telephone-fill",
      label: "Call the studio",
      value: settings.phone,
      href: telHref(settings.phone),
      external: false,
      tint: "text-accent bg-accent/[.08]",
    },
    {
      icon: "bi-envelope-fill",
      label: "Send an email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      external: false,
      tint: "text-[#198754] bg-[#198754]/[.1]",
    },
    {
      icon: "bi-geo-alt-fill",
      label: "Visit us",
      value: address || settings.siteName,
      href:
        settings.mapUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address
        )}`,
      external: true,
      tint: "text-[#d63384] bg-[#d63384]/[.1]",
    },
  ].filter((action) => action.value);

  return (
    <section
      id="contact-hero"
      className="section relative overflow-hidden"
      style={{ paddingTop: "170px", paddingBottom: "70px" }}
    >
      {/* Soft brand backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,131,253,0.09) 45%, rgba(13,131,253,0.03) 20%, transparent 55%)",
        }}
      ></div>
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(13,131,253,0.22), transparent 70%)",
        }}
      ></div>
      <div
        className="pointer-events-none absolute -bottom-32 left-0 h-[320px] w-[320px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(214,51,132,0.14), transparent 70%)",
        }}
      ></div>

      <div className="bt-container relative z-[1]">
        <nav aria-label="breadcrumb" className="mb-7" data-aos="fade-up">
          <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm text-[rgba(33,37,41,0.6)]">
            <li>
              <Link
                href="/"
                className="text-[var(--brand-accent-deep)] transition hover:text-[var(--brand-accent-deepest)]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <i className="bi bi-chevron-right text-xs"></i>
            </li>
            <li className="font-medium text-[var(--brand-accent-deep)]">Contact</li>
          </ol>
        </nav>

        <div className="grid items-center gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7" data-aos="fade-up" data-aos-delay="100">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent-deep)]/[.08] px-4 py-2 text-sm font-medium text-[var(--brand-accent-deep)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-accent-deep)] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              Replies within one business day
            </span>

            <h1 className="mb-5 text-[2.25rem] font-bold leading-[1.15] sm:text-[3rem] lg:text-[3.5rem]">
              Let&rsquo;s talk about
              {" "}
              <span className="relative inline-block text-accent">
                your project
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="10"
                  viewBox="0 0 200 10"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8c60-6 136-6 196 0"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                </svg>
              </span>
            </h1>

            <p className="mb-8 max-w-[560px] text-[17px] leading-[1.75] text-[rgba(33,37,41,0.75)]">
              Whether you need a website, a brand refresh or someone to run your
              campaigns, you&rsquo;ll talk directly to the people doing the
              work. Tell us what you need and we&rsquo;ll come back with
              honest feedback, a clear scope and a realistic timeline.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact-form"
                className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-white shadow-[0_10px_25px_color-mix(in_srgb,var(--brand-accent)_35%,transparent)] transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, var(--brand-accent) 0%, var(--brand-accent-deep) 100%)" }}
              >
                <i className="bi bi-send-fill"></i>
                Send a message
                <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(33,37,41,0.15)] bg-white px-7 py-3.5 font-medium text-default transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-accent-deep)] hover:text-[var(--brand-accent-deep)]"
              >
                <i className="bi bi-collection-play"></i>
                See our work
              </Link>
            </div>

            {settings.businessHours ? (
              <p className="mt-7 mb-0 inline-flex items-center gap-2 rounded-lg bg-white/70 px-4 py-2 text-sm text-[rgba(33,37,41,0.7)] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                <i className="bi bi-clock-history text-[var(--brand-accent-deep)]"></i>
                Office hours: {settings.businessHours}
              </p>
            ) : null}
          </div>

          {/* Quick contact cards */}
          <div className="lg:col-span-5" data-aos="fade-up" data-aos-delay="200">
            <div className="space-y-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  {...(action.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-black/[.06] bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--brand-accent)_14%,transparent)]"
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl transition-colors duration-300 group-hover:bg-[var(--brand-accent-deep)] group-hover:text-white ${action.tint}`}
                  >
                    <i className={`bi ${action.icon}`}></i>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[.14em] text-[rgba(33,37,41,0.65)]">
                      {action.label}
                    </span>
                    <span className="block truncate text-[15px] font-semibold text-heading">
                      {action.value}
                    </span>
                  </span>
                  <i className="bi bi-arrow-up-right text-lg text-[rgba(33,37,41,0.25)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--brand-accent-deep)]"></i>
                </a>
              ))}

              {whatsappHref(settings) && (
                <a
                  href={whatsappHref(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl p-4 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(10,122,61,0.35)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #0f7a3d 0%, var(--brand-accent-deep) 100%)",
                  }}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                    <i className="bi bi-whatsapp"></i>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[.14em] text-white/90">
                      Fastest reply
                    </span>
                    <span className="block text-[15px] font-semibold">
                      Chat on WhatsApp
                    </span>
                  </span>
                  <i className="bi bi-arrow-up-right text-lg text-white/80 transition-all duration-300 group-hover:translate-x-0.5"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}