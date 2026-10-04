"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const featureLinks = [
  { href: "/#designing", label: "Design That Speaks" },
  { href: "/#marketing", label: "Marketing That Works" },
  { href: "/#collaboration", label: "True Partnership" },
];

const workLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/brands", label: "Brands & Clients" },
];

const serviceLinks = [
  { href: "/services/ui-ux", label: "UI/UX Design" },
  { href: "/services/web-development", label: "Web Development" },
  { href: "/services/graphic-design", label: "Graphic Design" },
  { href: "/services/social-media", label: "Social Media" },
  { href: "/services/cms", label: "Custom CMS" },
  { href: "/services/seo", label: "SEO & Optimization" },
  { href: "/services/branding", label: "Brand Identity" },
];

const spyIds = ["about", "designing", "marketing", "collaboration", "contact"];

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <i
      className={`bi bi-chevron-down ml-[5px] text-xs leading-none transition duration-300 ${className}`}
    ></i>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const isIndexPage = pathname === "/";
  // Original HTML hardcodes "active" on Home; its scrollspy then strips it on the
  // index page (no section matches at the top), while other pages keep it.
  const homeActive = !isIndexPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navmenu scrollspy (replicates main.js behaviour on the homepage)
  useEffect(() => {
    if (!isIndexPage) return;
    const spy = () => {
      let current: string | null = null;
      for (const id of spyIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const position = window.scrollY + 200;
        if (
          position >= el.offsetTop &&
          position <= el.offsetTop + el.offsetHeight
        ) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    spy();
    window.addEventListener("scroll", spy);
    return () => window.removeEventListener("scroll", spy);
  }, [isIndexPage]);

  // Menus are closed by the links' own onClick handlers (see closeMobile)

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, []);

  // The dashboard ships its own chrome, so the public header stays off /admin.
  if (pathname?.startsWith("/admin")) return null;

  const desktopLinkClass = (active: boolean) =>
    `flex items-center justify-between whitespace-nowrap px-[15px] py-[18px] font-nav text-base font-normal transition duration-300 ${
      active ? "text-accent" : "text-[#212529] hover:text-accent"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `flex w-full items-center justify-between whitespace-nowrap px-5 py-2.5 font-nav text-[17px] font-medium transition ${
      active ? "text-accent" : "text-[#212529]"
    }`;

  const renderDropdownItems = (links: { href: string; label: string }[]) =>
    links.map((link) => (
      <li key={link.href} className="min-w-[200px]">
        <Link
          href={link.href}
          onClick={closeMobile}
          className="block whitespace-nowrap px-5 py-2.5 text-[15px] text-[#212529] transition duration-300 hover:text-accent"
        >
          {link.label}
        </Link>
      </li>
    ));

  return (
    <header
      id="header"
      className={`fixed inset-x-0 top-0 z-[997] flex items-center pb-5 pt-2.5 transition-all duration-500 xl:pt-5`}
    >
      <div
        className={`bt-container-fluid-xl relative flex items-center justify-between rounded-full shadow-[0px_2px_15px_rgba(0,0,0,0.1)] max-xl:mx-[10px] max-xl:py-2.5 max-xl:pl-[15px] max-xl:pr-[5px] xl:px-[25px] xl:py-[5px] ${
          scrolled ? "bg-white/95" : "bg-white"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="unova flex items-center pl-[5px] leading-none max-xl:order-1 max-xl:me-auto xl:mr-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.logo}
            alt={settings.siteName}
            className="mr-2 w-[100px] max-h-[36px]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          id="navmenu"
          className="max-xl:order-3 max-xl:hidden xl:p-0"
        >
          <ul className="m-0 flex list-none items-center p-0">
            <li className="relative">
              <Link href="/" className={`${desktopLinkClass(homeActive)} xl:pr-0`}>
                Home
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/about"
                className={desktopLinkClass(
                  activeSection === "about" || pathname === "/about"
                )}
              >
                About
              </Link>
            </li>

            {/* Features dropdown */}
            <li className="group relative">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={desktopLinkClass(activeSection === "designing")}
              >
                <span>Features</span>
                <ChevronIcon />
              </a>
              <ul className="invisible absolute left-[14px] top-[130%] z-[99] block rounded bg-white py-2.5 opacity-0 shadow-[0px_0px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:left-[14px] group-hover:top-full group-hover:visible group-hover:opacity-100">
                {renderDropdownItems(featureLinks)}
              </ul>
            </li>

            {/* Services dropdown */}
            <li className="group relative">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={desktopLinkClass(
                  activeSection === "marketing" ||
                    activeSection === "collaboration" ||
                    pathname.startsWith("/services")
                )}
              >
                <span>Services</span>
                <ChevronIcon />
              </a>
              <ul className="invisible absolute left-[14px] top-[130%] z-[99] block rounded bg-white py-2.5 opacity-0 shadow-[0px_0px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:top-full group-hover:visible group-hover:opacity-100">
                {renderDropdownItems(serviceLinks)}
              </ul>
            </li>

            {/* Our Work dropdown */}
            <li className="group relative">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={desktopLinkClass(
                  ["/projects", "/gallery", "/brands"].some((p) =>
                    pathname.startsWith(p)
                  )
                )}
              >
                <span>Our Work</span>
                <ChevronIcon />
              </a>
              <ul className="invisible absolute left-[14px] top-[130%] z-[99] block rounded bg-white py-2.5 opacity-0 shadow-[0px_0px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:top-full group-hover:visible group-hover:opacity-100">
                {renderDropdownItems(workLinks)}
              </ul>
            </li>

            <li className="relative">
              <Link
                href="/contact"
                className={`${desktopLinkClass(
                  activeSection === "contact" || pathname === "/contact"
                )} xl:pr-0`}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Get Started CTA */}
        <Link
          href="/#about"
          className="rounded-full bg-accent px-5 py-2 text-sm text-white transition duration-300 hover:bg-accent/85 max-xl:order-2 max-xl:mr-[10px] max-xl:px-[15px] max-xl:py-1.5"
        >
          Get Started
        </Link>

        {/* Mobile nav toggle */}
        <i
          className={`bi cursor-pointer leading-none transition-colors duration-300 xl:hidden max-xl:order-4 ${
            mobileOpen
              ? `bi-x fixed right-[15px] top-[15px] z-[9999] text-[32px] text-white`
              : `bi-list mr-[10px] text-[28px] text-[#212529]`
          }`}
          onClick={() => setMobileOpen((v) => !v)}
        ></i>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[9997] overflow-hidden bg-[rgba(33,37,41,0.8)] transition duration-300 xl:hidden">
            <ul className="absolute inset-[60px_20px_20px_20px] m-0 list-none overflow-y-auto rounded-md bg-white p-2.5 shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
              <li>
                <Link href="/" onClick={closeMobile} className={mobileLinkClass(homeActive)}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={closeMobile}
                  className={mobileLinkClass(
                    activeSection === "about" || pathname === "/about"
                  )}
                >
                  About
                </Link>
              </li>

              {/* Features dropdown (mobile) */}
              <li className="relative">
                <a
                  href="#"
                  className={mobileLinkClass(activeSection === "designing")}
                  onClick={(e) => e.preventDefault()}
                >
                  <span>Features</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === "features" ? null : "features");
                    }}
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full transition ${
                      openDropdown === "features"
                        ? "rotate-180 bg-accent text-white"
                        : "bg-accent/10"
                    }`}
                  >
                    <i className="bi bi-chevron-down text-xs"></i>
                  </span>
                </a>
                <ul
                  className={`mx-5 my-2.5 list-none border border-black/10 py-2.5 ${
                    openDropdown === "features" ? "block bg-black/[.03]" : "hidden"
                  }`}
                >
                  {renderDropdownItems(featureLinks)}
                </ul>
              </li>

              {/* Services dropdown (mobile) */}
              <li className="relative">
                <a
                  href="#"
                  className={mobileLinkClass(false)}
                  onClick={(e) => e.preventDefault()}
                >
                  <span>Services</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === "services" ? null : "services");
                    }}
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full transition ${
                      openDropdown === "services"
                        ? "rotate-180 bg-accent text-white"
                        : "bg-accent/10"
                    }`}
                  >
                    <i className="bi bi-chevron-down text-xs"></i>
                  </span>
                </a>
                <ul
                  className={`mx-5 my-2.5 list-none border border-black/10 py-2.5 ${
                    openDropdown === "services" ? "block bg-black/[.03]" : "hidden"
                  }`}
                >
                  {renderDropdownItems(serviceLinks)}
                </ul>
              </li>

              {/* Our Work dropdown (mobile) */}
              <li className="relative">
                <a
                  href="#"
                  className={mobileLinkClass(false)}
                  onClick={(e) => e.preventDefault()}
                >
                  <span>Our Work</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === "work" ? null : "work");
                    }}
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full transition ${
                      openDropdown === "work"
                        ? "rotate-180 bg-accent text-white"
                        : "bg-accent/10"
                    }`}
                  >
                    <i className="bi bi-chevron-down text-xs"></i>
                  </span>
                </a>
                <ul
                  className={`mx-5 my-2.5 list-none border border-black/10 py-2.5 ${
                    openDropdown === "work" ? "block bg-black/[.03]" : "hidden"
                  }`}
                >
                  {renderDropdownItems(workLinks)}
                </ul>
              </li>

              <li>
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className={mobileLinkClass(
                    activeSection === "contact" || pathname === "/contact"
                  )}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
