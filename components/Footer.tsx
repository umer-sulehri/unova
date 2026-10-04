"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import {
  SOCIAL_FIELDS,
  formatAddress,
  telHref,
  whatsappHref,
} from "@/lib/site-shared";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block leading-none text-[rgba(33,37,41,0.7)] transition duration-300 hover:text-accent"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="inline-block leading-none text-[rgba(33,37,41,0.7)] transition duration-300 hover:text-accent"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  // The original web-projects page ships a footer with fully resolved links
  // and a dynamic copyright year; the other two pages keep placeholder links.
  const isProjects = pathname === "/projects";
  const year = new Date().getFullYear();

  const socials = SOCIAL_FIELDS.map((field) => ({
    key: field.key,
    label: field.label,
    icon: field.icon,
    url: settings.socials[field.key],
  })).filter((social) => Boolean(social.url));

  // The dashboard renders its own sidebar chrome, not the public footer.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer id="footer" className="relative bg-white text-sm text-[#212529]">
      <div className="bt-container pt-[50px]">
        <div className="grid gap-y-6 md:grid-cols-6 lg:grid-cols-12">
          {/* Company Info */}
          <div className="md:col-span-3 lg:col-span-4">
            <Link href="/" className="unova flex items-center leading-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.logo}
                alt={settings.siteName}
                className="mr-1.5 max-h-[40px] w-[100px]"
              />
            </Link>
            <div className="pt-3">
              <p className="mb-[5px] font-heading text-sm">
                {formatAddress(settings)}
              </p>
              <p className={`mb-[5px] font-heading text-sm ${isProjects ? "" : "mt-3"}`}>
                <strong>Phone:</strong>{" "}
                <a href={telHref(settings.phone)} className="hover:text-accent">
                  {settings.phone}
                </a>
              </p>
              <p className="mb-[5px] font-heading text-sm">
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-accent"
                >
                  {settings.email}
                </a>
              </p>

              {socials.length > 0 && (
                <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                  {socials.map((social) => (
                    <li key={social.key}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label={social.label}
                        title={social.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f3f5] text-[#212529] transition hover:bg-accent hover:text-white"
                      >
                        <i className={`bi ${social.icon} text-base`}></i>
                      </a>
                    </li>
                  ))}
                  {whatsappHref(settings) && (
                    <li>
                      <a
                        href={whatsappHref(settings)}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label="WhatsApp"
                        title="WhatsApp"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f3f5] text-[#212529] transition hover:bg-[#25d366] hover:text-white"
                      >
                        <i className="bi bi-whatsapp text-base"></i>
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Useful Links */}
          <div className="mb-[30px] md:col-span-3 lg:col-span-2 lg:mb-0">
            <h4 className="relative pb-3 text-base font-bold">Quick Links</h4>
            <ul className="m-0 list-none p-0">
              {isProjects ? (
                <>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/">Home</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/about">About Us</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/projects">Projects</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/gallery">Gallery</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/brands">Brands</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/contact">Contact</FooterLink></li>
                </>
              ) : (
                <>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/">Home</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/about">About Us</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/#services">Services</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/gallery">Gallery</FooterLink></li>
                  <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/brands">Brands</FooterLink></li>
                </>
              )}
            </ul>
          </div>

          {/* Services */}
          <div className="mb-[30px] md:col-span-3 lg:col-span-2 lg:mb-0">
            <h4 className="relative pb-3 text-base font-bold">Our Services</h4>
            <ul className="m-0 list-none p-0">
              {(isProjects
                ? [
                    ["/services/ui-ux", "UI/UX Design"],
                    ["/services/web-development", "Web Development"],
                    ["/services/graphic-design", "Graphic Design"],
                    ["/services/social-media", "Social Media"],
                    ["/services/branding", "Brand Identity"],
                  ]
                : [
                    ["/services/ui-ux", "UI/UX"],
                    ["/services/graphic-design", "Graphic Design"],
                    ["/services/web-development", "Web Development"],
                    ["/services/cms", "Custom CMS"],
                    ["/services/seo", "SEO & Optimization"],
                    ["/services/branding", "Brand Identity"],
                  ]
              ).map(([href, label]) => (
                <li key={label} className="flex items-center py-2.5 first:pt-0">
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="mb-[30px] md:col-span-3 lg:col-span-2 lg:mb-0">
            <h4 className="relative pb-3 text-base font-bold">Support</h4>
            <ul className="m-0 list-none p-0">
              <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/contact">Contact Us</FooterLink></li>
              <li className="flex items-center py-2.5 first:pt-0"><FooterLink href="/#faq">FAQs</FooterLink></li>
            </ul>
          </div>

          {/* Why Us */}
          <div className="mb-[30px] md:col-span-3 lg:col-span-2 lg:mb-0">
            <h4 className="relative pb-3 text-base font-bold">Why Us</h4>
            <ul className="m-0 list-none p-0">
              {(isProjects
                ? [
                    "Experienced Team",
                    "Result-Driven",
                    "End-to-End Services",
                    "Creative Solutions",
                    "Client Satisfaction",
                  ]
                : [
                    "Experienced Team",
                    "Result-Driven Strategies",
                    "End-to-End Services",
                    "Creative & Innovative",
                    "Client Satisfaction First",
                  ]
              ).map((label) => (
                <li key={label} className="flex items-center py-2.5 first:pt-0">
                  <i className="bi bi-check pr-[2px] text-xs leading-none"></i>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bt-container mt-4 border-t border-black/10 py-[25px] text-center">
        {isProjects ? (
          <p className="mb-0">
            <strong className="px-1">
              <Link href="/" className="text-accent hover:text-accent/75">
                {settings.siteName}
              </Link>
            </strong>{" "}
            All Rights Reserved &copy; {year}
          </p>
        ) : (
          <p className="mb-0">
            <strong className="px-1">
              <Link href="/" className="text-accent hover:text-accent/75">
                {settings.siteName}
              </Link>
            </strong>{" "}
            All Rights CopyRight &copy; Reserved
          </p>
        )}
      </div>
    </footer>
  );
}
