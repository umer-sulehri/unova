import Link from "next/link";
import { readCollection } from "@/lib/content";
import { readContactMessages } from "@/lib/messages";
import { formatAddress, getSiteSettings, telHref } from "@/lib/site";
import type {
  AnyContentItem,
  Brand,
  GalleryItem,
  Project,
  Service,
  TeamMember,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function newest<T extends AnyContentItem>(items: T[]) {
  return [...items].sort((a, b) => b.id - a.id).slice(0, 5);
}

export default async function AdminDashboardPage() {
  const [projects, services, gallery, brands, team, site, messages] =
    await Promise.all([
      readCollection("projects"),
      readCollection("services"),
      readCollection("gallery"),
      readCollection("brands"),
      readCollection("team"),
      getSiteSettings(),
      readContactMessages(),
    ]);

  const storageReady = isSupabaseConfigured();

  const newMessages = messages.filter((item) => item.status === "new").length;

  const cards = [
    {
      href: "/admin/messages",
      label: "Messages",
      count: messages.length,
      icon: "bi-chat-dots",
      tone: "#0dcaf0",
      description: newMessages
        ? `${newMessages} new contact ${
            newMessages === 1 ? "query" : "queries"
          } waiting for a reply.`
        : "Contact form queries from the public site.",
    },
    {
      href: "/admin/projects",
      label: "Projects",
      count: projects.length,
      icon: "bi-kanban",
      tone: "#0d83fd",
      description: "Portfolio items on /projects and the home page.",
    },
    {
      href: "/admin/services",
      label: "Services",
      count: services.length,
      icon: "bi-gear",
      tone: "#198754",
      description: "Service detail pages with benefits, process & packages.",
    },
    {
      href: "/admin/gallery",
      label: "Gallery",
      count: gallery.length,
      icon: "bi-images",
      tone: "#6f42c1",
      description: "Images shown on the public /gallery page.",
    },
    {
      href: "/admin/brands",
      label: "Brands",
      count: brands.length,
      icon: "bi-award",
      tone: "#fd7e14",
      description: "Client brands listed on /brands and in the footer.",
    },
    {
      href: "/admin/team",
      label: "Team",
      count: team.length,
      icon: "bi-people",
      tone: "#d63384",
      description: "People shown in the team section of the About page.",
    },
  ];

  const total =
    projects.length +
    services.length +
    gallery.length +
    brands.length +
    team.length;

  const recentProjects = newest(projects as Project[]);
  const recentServices = newest(services as Service[]);
  const recentGallery = newest(gallery as GalleryItem[]);
  const recentBrands = newest(brands as Brand[]);
  const recentTeam = [...(team as TeamMember[])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id - b.id
  );

  return (
    <div className="space-y-6">
      {/* Overview */}
      <section className="relative overflow-hidden rounded-2xl bg-default px-6 py-8 lg:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(13,131,253,0.8), transparent 40%), radial-gradient(circle at 85% 80%, rgba(13,131,253,0.5), transparent 45%)",
          }}
        ></div>
        <div className="relative z-[1] flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
                <i className="bi bi-stars"></i>
                Content overview
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  storageReady
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${storageReady ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                Database: {storageReady ? "Connected" : "Not Connected"}
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white lg:text-3xl">
              {total} items live on your site
            </h1>
            <p className="mb-0 max-w-[520px] text-sm leading-relaxed text-white/65">
              Everything you change here appears on the public website
              immediately. Upload images, pick icons, and edit copy — no files to
              touch.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-default transition hover:bg-white/90"
            >
              <i className="bi bi-sliders"></i>
              Site Settings
            </Link>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <i className="bi bi-plus-lg"></i>
              New Project
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <i className="bi bi-box-arrow-up-right"></i>
              View site
            </a>
          </div>
        </div>
      </section>

      {/* Collection cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-black/[.08] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.09)]"
          >
            <div className="mb-4 flex items-start justify-between">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: `${card.tone}14`, color: card.tone }}
              >
                <i className={`bi ${card.icon}`}></i>
              </span>
              <span className="text-3xl font-bold leading-none text-heading">
                {card.count}
              </span>
            </div>
            <h2 className="mb-1 flex items-center gap-1.5 text-base font-bold text-heading transition group-hover:text-accent">
              {card.label}
              <i className="bi bi-arrow-right text-xs opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"></i>
            </h2>
            <p className="mb-0 text-xs leading-relaxed text-[rgba(33,37,41,0.55)]">
              {card.description}
            </p>
          </Link>
        ))}
      </section>

      {/* Recent contact queries */}
      <section className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
            <i className="bi bi-chat-dots text-accent"></i>
            Latest Contact Queries
            {newMessages > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-white">
                {newMessages} new
              </span>
            )}
          </h2>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-accent hover:text-accent/80"
          >
            Open inbox
          </Link>
        </div>

        <ul className="m-0 divide-y divide-black/[.06] list-none p-0">
          {messages.length === 0 && (
            <li className="py-8 text-center text-sm text-[rgba(33,37,41,0.5)]">
              No contact queries yet. Messages sent from /contact will appear
              here.
            </li>
          )}
          {messages.slice(0, 5).map((item) => (
            <li key={item.id} className="flex items-start gap-3 py-4">
              <span
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  item.status === "new"
                    ? "bg-accent text-white"
                    : "bg-light-bg text-[rgba(33,37,41,0.55)]"
                }`}
              >
                {item.name.charAt(0).toUpperCase() || "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-0 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {item.name}
                  <span className="text-xs font-normal text-[rgba(33,37,41,0.45)]">
                    {item.email}
                  </span>
                  {item.status === "new" && (
                    <span className="rounded-full bg-accent/[.1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-accent">
                      New
                    </span>
                  )}
                </p>
                <p className="mb-0 truncate text-xs text-[rgba(33,37,41,0.6)]">
                  {item.subject ? `${item.subject}: ` : ""}
                  {item.message}
                </p>
              </div>
              <span className="hidden shrink-0 text-[11px] text-[rgba(33,37,41,0.45)] sm:block">
                {new Date(item.createdAt).toLocaleString("en-GB", {
                  timeZone: "Asia/Karachi",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Global site settings summary */}
      <section className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
            <i className="bi bi-sliders text-accent"></i>
            Site Settings
          </h2>
          <Link
            href="/admin/settings"
            className="text-xs font-semibold text-accent hover:text-accent/80"
          >
            Manage all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-black/[.07] bg-[#fbfcfd] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[rgba(33,37,41,0.45)]">
              Brand
            </p>
            <p className="mb-1 truncate text-sm font-bold text-heading">
              {site.siteName}
            </p>
            <p className="mb-0 line-clamp-2 text-xs leading-relaxed text-[rgba(33,37,41,0.6)]">
              {site.tagline}
            </p>
          </div>

          <div className="rounded-xl border border-black/[.07] bg-[#fbfcfd] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[rgba(33,37,41,0.45)]">
              Contact
            </p>
            <p className="mb-1 text-sm font-semibold">
              <a href={telHref(site.phone)} className="hover:text-accent">
                {site.phone || "No phone set"}
              </a>
            </p>
            <p className="mb-0 truncate text-xs text-[rgba(33,37,41,0.6)]">
              {site.email || "No email set"}
            </p>
          </div>

          <div className="rounded-xl border border-black/[.07] bg-[#fbfcfd] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[rgba(33,37,41,0.45)]">
              Office address
            </p>
            <p className="mb-0 text-xs leading-relaxed text-[rgba(33,37,41,0.75)]">
              {formatAddress(site)}
            </p>
          </div>

          <div className="rounded-xl border border-black/[.07] bg-[#fbfcfd] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[rgba(33,37,41,0.45)]">
              Brand assets
            </p>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.logo}
                alt={`${site.siteName} logo`}
                className="h-8 w-auto max-w-[90px] rounded bg-white object-contain"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.favicon}
                alt=""
                className="h-8 w-8 rounded bg-white object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recently updated */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
              <i className="bi bi-kanban text-accent"></i>
              Latest Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-accent hover:text-accent/80"
            >
              Manage all
            </Link>
          </div>
          <ul className="m-0 divide-y divide-black/[.06] list-none p-0">
            {recentProjects.length === 0 && (
              <li className="py-6 text-center text-sm text-[rgba(33,37,41,0.5)]">
                No projects yet.
              </li>
            )}
            {recentProjects.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <span className="h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-light-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {p.title}
                  </span>
                  <span className="block truncate font-mono text-[11px] text-[rgba(33,37,41,0.45)]">
                    /{p.slug}
                  </span>
                </span>
                <span className="rounded-full bg-light-bg px-2.5 py-1 text-[11px] font-semibold text-[rgba(33,37,41,0.6)]">
                  #{p.id}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
              <i className="bi bi-gear text-accent"></i>
              Latest Services
            </h2>
            <Link
              href="/admin/services"
              className="text-xs font-semibold text-accent hover:text-accent/80"
            >
              Manage all
            </Link>
          </div>
          <ul className="m-0 divide-y divide-black/[.06] list-none p-0">
            {recentServices.length === 0 && (
              <li className="py-6 text-center text-sm text-[rgba(33,37,41,0.5)]">
                No services yet.
              </li>
            )}
            {recentServices.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{ backgroundColor: `${s.color}14`, color: s.color }}
                >
                  <i className={`bi ${s.icon}`}></i>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {s.title}
                  </span>
                  <span className="block truncate text-[11px] text-[rgba(33,37,41,0.5)]">
                    {s.tagline}
                  </span>
                </span>
                <a
                  href={`/services/${s.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[rgba(33,37,41,0.4)] transition hover:bg-accent/[.08] hover:text-accent"
                  title="View page"
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery + Brands + Team snapshot */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
              <i className="bi bi-images text-accent"></i>
              Gallery
            </h2>
            <Link
              href="/admin/gallery"
              className="text-xs font-semibold text-accent hover:text-accent/80"
            >
              Manage all
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {recentGallery.length === 0 && (
              <p className="col-span-full py-6 text-center text-sm text-[rgba(33,37,41,0.5)]">
                No gallery images yet.
              </p>
            )}
            {recentGallery.map((g) => (
              <span
                key={g.id}
                title={g.title}
                className="aspect-square overflow-hidden rounded-lg bg-light-bg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.image} alt={g.title} className="h-full w-full object-cover" />
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
              <i className="bi bi-award text-accent"></i>
              Brands
            </h2>
            <Link
              href="/admin/brands"
              className="text-xs font-semibold text-accent hover:text-accent/80"
            >
              Manage all
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {recentBrands.length === 0 && (
              <p className="py-6 text-sm text-[rgba(33,37,41,0.5)]">
                No brands yet.
              </p>
            )}
            {recentBrands.map((b) => (
              <span
                key={b.id}
                title={b.name}
                className="flex h-16 w-24 items-center justify-center rounded-lg border border-black/[.06] bg-white p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.logo}
                  alt={b.name}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mb-0 flex items-center gap-2 text-base font-bold text-heading">
              <i className="bi bi-people text-accent"></i>
              Team
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] ${
                  site.showTeamSection
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
                title={
                  site.showTeamSection
                    ? "The team section is rendered on /about"
                    : "The team section is hidden from /about"
                }
              >
                {site.showTeamSection ? "Live" : "Hidden"}
              </span>
            </h2>
            <Link
              href="/admin/team"
              className="text-xs font-semibold text-accent hover:text-accent/80"
            >
              Manage all
            </Link>
          </div>
          <ul className="m-0 divide-y divide-black/[.06] list-none p-0">
            {recentTeam.length === 0 && (
              <li className="py-6 text-center text-sm text-[rgba(33,37,41,0.5)]">
                No team members yet.
              </li>
            )}
            {recentTeam.slice(0, 5).map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3">
                <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-light-bg">
                  {m.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={m.image}
                      alt={m.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-bold text-[rgba(33,37,41,0.35)]">
                      {m.name.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {m.name}
                  </span>
                  <span className="block truncate text-[11px] text-accent">
                    {m.role || "—"}
                  </span>
                </span>
                <a
                  href={site.showTeamSection ? "/about#team" : "/about"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[rgba(33,37,41,0.4)] transition hover:bg-accent/[.08] hover:text-accent"
                  title={
                    site.showTeamSection
                      ? "View on /about"
                      : "Section hidden — opens /about"
                  }
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Setup notes */}
      {/* Database status */}
      <section
        className={`flex flex-wrap items-center gap-4 rounded-2xl border px-6 py-5 ${
          storageReady
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
            storageReady
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <i
            className={`bi ${
              storageReady ? "bi-database-check" : "bi-database-slash"
            }`}
          ></i>
        </span>
        <div className="min-w-[240px] flex-1">
          <div className="flex items-center gap-2">
            <h2 className="mb-0 text-sm font-bold text-heading">
              Database: {storageReady ? "Connected" : "Not Connected"}
            </h2>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                storageReady
                  ? "bg-emerald-200 text-emerald-800"
                  : "bg-amber-200 text-amber-800"
              }`}
            >
              {storageReady ? "Connected" : "Not Connected"}
            </span>
          </div>
          <p className="mb-0 mt-1 text-xs text-[rgba(33,37,41,0.65)]">
            {storageReady
              ? "Supabase database and media storage are connected. All changes are saved directly to your database."
              : "Supabase database is not connected — running in local JSON mode (data/content/*.json)."}
          </p>
        </div>
        <code className="hidden rounded-lg bg-white px-3 py-2 text-[11px] text-[rgba(33,37,41,0.6)] shadow-sm lg:block">
          ADMIN_PASSWORD → .env.local
        </code>
      </section>
    </div>
  );
}