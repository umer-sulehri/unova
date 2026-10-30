"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/admin/messages", label: "Messages", icon: "bi-chat-dots" },
  { href: "/admin/projects", label: "Projects", icon: "bi-kanban" },
  { href: "/admin/services", label: "Services", icon: "bi-gear" },
  { href: "/admin/gallery", label: "Gallery", icon: "bi-images" },
  { href: "/admin/brands", label: "Brands", icon: "bi-award" },
  { href: "/admin/team", label: "Team", icon: "bi-people" },
];

const siteNavItem = {
  href: "/admin/settings",
  label: "Site Settings",
  icon: "bi-sliders",
};

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { settings } = useSiteSettings();

  const current = navItems.find((item) => isActive(pathname, item.href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link
        href="/admin"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 px-6 py-5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg text-white">
          <i className="bi bi-grid-1x2-fill"></i>
        </span>
        <span>
          <span className="block text-sm font-bold leading-tight text-white">
            {settings.siteName} Admin
          </span>
          <span className="block text-[11px] text-white/50">
            Content Manager
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[.12em] text-white/35">
          Manage
        </p>
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-accent text-white shadow-[0_6px_16px_rgba(13,131,253,0.35)]"
                  : "text-white/65 hover:bg-white/[.07] hover:text-white"
              }`}
            >
              <i className={`bi ${item.icon} text-base`}></i>
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[.12em] text-white/35">
          Configuration
        </p>
        {(() => {
          const active = isActive(pathname, siteNavItem.href);
          return (
            <Link
              href={siteNavItem.href}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-accent text-white shadow-[0_6px_16px_rgba(13,131,253,0.35)]"
                  : "text-white/65 hover:bg-white/[.07] hover:text-white"
              }`}
            >
              <i className={`bi ${siteNavItem.icon} text-base`}></i>
              {siteNavItem.label}
            </Link>
          );
        })()}

        <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[.12em] text-white/35">
          View site
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/[.07] hover:text-white"
        >
          <i className="bi bi-box-arrow-up-right text-base"></i>
          Public site
        </a>
      </nav>

      <div className="border-t border-white/10 p-4">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-light-bg">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 bg-default lg:block">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-[9998] lg:hidden">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50"
            ></button>
            <aside className="absolute inset-y-0 left-0 w-[270px] bg-default shadow-2xl">
              {sidebar}
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-[999] flex items-center gap-3 border-b border-black/[.07] bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-lg text-default transition hover:border-accent/40 hover:text-accent lg:hidden"
            >
              <i className="bi bi-list"></i>
            </button>

            <div className="min-w-0">
              <p className="mb-0 truncate text-base font-bold text-heading">
                {current?.label ?? "Admin"}
              </p>
              <p className="mb-0 hidden text-xs text-[rgba(33,37,41,0.5)] sm:block">
                Manage everything the public site displays.
              </p>
            </div>

            <span className="ml-auto hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
              <i className="bi bi-shield-check"></i>
              Signed in
            </span>
          </header>

          <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}