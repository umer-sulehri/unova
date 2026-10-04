import type { Metadata } from "next";
import Link from "next/link";
import ContactDetails from "@/components/contact/ContactDetails";
import ContactFaq from "@/components/contact/ContactFaq";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import JsonLd from "@/components/seo/JsonLd";
import { getContactFaqs } from "@/lib/faq";
import { getSiteSettings } from "@/lib/site";
import { formatAddress, whatsappHref } from "@/lib/site-shared";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  truncate,
} from "@/lib/seo";
import type { SiteSettings } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return pageMetadata({
    title: "Contact Us",
    description: `Get in touch with ${siteName} — call, WhatsApp or email our Lahore studio about UI/UX design, web development, SEO and digital marketing projects.`,
    path: "/contact",
    keywords: [
      "contact digital agency Lahore",
      "contact web designer Pakistan",
      "hire UI UX designer Lahore",
      "web development agency contact",
      "free consultation Pakistan",
    ],
    siteName,
  });
}

export const dynamic = "force-dynamic";

/** ContactPage schema so the page can surface a Google contact panel. */
function contactPageJsonLd(settings: SiteSettings) {
  const email = settings.email.trim();
  const phone = settings.phone.trim();

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/contact")}#contactpage`,
    url: absoluteUrl("/contact"),
    name: `Contact ${settings.siteName}`,
    description: truncate(
      `Contact ${settings.siteName} for UI/UX design, web development, SEO and digital marketing projects.`,
      160
    ),
    mainEntity: {
      "@type": "Organization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: settings.siteName,
      email: email || undefined,
      telephone: phone ? phone.replace(/[^\d+]/g, "") : undefined,
      ...(whatsappHref(settings) ? { sameAs: [whatsappHref(settings)] } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address.street,
        addressLocality: settings.address.city,
        addressRegion: settings.address.region,
        postalCode: settings.address.postalCode,
        addressCountry: settings.address.countryCode,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email } : {}),
        availableLanguage: ["en", "ur"],
        areaServed: settings.address.countryCode,
      },
    },
  };
}

const steps = [
  {
    icon: "bi-chat-square-text",
    title: "You write to us",
    text: "A short brief is enough — what you need, when you need it and who it is for.",
  },
  {
    icon: "bi-clipboard2-check",
    title: "We reply within a day",
    text: "Real answers from the people who would do the work, plus questions if anything is unclear.",
  },
  {
    icon: "bi-rocket-takeoff",
    title: "We agree a plan",
    text: "Scope, timeline and price in writing. If it isn't a fit, we will tell you who to talk to instead.",
  },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const mapEmbed = settings.mapUrl.trim();
  const address = formatAddress(settings) || settings.siteName;

  return (
    <>
      <ContactHero />

      {/* Split layout: accent details panel + form card */}
      <section id="contact-details" className="section relative bg-light-bg">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(13,131,253,0.25), transparent)",
          }}
        ></div>
        <div className="bt-container relative z-[1]">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ContactDetails />
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Process band */}
      <section
        className="relative overflow-hidden py-16 text-white lg:py-20"
        style={{
          background:
            "linear-gradient(155deg, #0a5fb8 0%, #0a4fa0 45%, #073b73 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[.14]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div className="bt-container relative z-[1]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4" data-aos="fade-up">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[.12em] text-white">
                <i className="bi bi-signpost-split"></i>
                What happens next
              </span>
              <h2 className="mb-3 text-[2rem] font-bold leading-[1.2] text-white max-md:text-[1.75rem]">
                No bots, no ticket numbers
              </h2>
              <p className="m-0 text-[15px] leading-[1.7] text-white/85">
                Here is exactly what happens after you hit send — and the same
                whether you write to us at 9am or 9pm.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="group relative rounded-2xl bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-4 text-4xl font-bold text-white/15"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-[#0a69ca] transition-transform duration-300 group-hover:scale-110">
                      <i className={`bi ${step.icon}`}></i>
                    </span>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="m-0 text-sm leading-[1.65] text-white/85">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-10 flex flex-wrap items-center gap-3"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <span className="mr-2 text-sm text-white/85">
                  Would rather browse first?
                </span>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0a5fb8] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <i className="bi bi-collection-play"></i>
                  View our projects
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <i className="bi bi-grid-3x3-gap"></i>
                  Browse services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactFaq />

      {/* Optional map, only rendered when the admin saved one */}
      {mapEmbed ? (
        <section className="section bg-light-bg">
          <div className="bt-container">
            <div className="mb-8 text-center" data-aos="fade-up">
              <h2 className="relative mb-5 inline-block pb-5 text-[2rem] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent after:content-['']">
                Find Us
              </h2>
              <p className="mx-auto mb-0 max-w-[620px] text-[16px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                {address}
              </p>
            </div>

            <div
              className="relative overflow-hidden rounded-3xl border border-black/[.06] shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
              data-aos="fade-up"
            >
              <iframe
                src={mapEmbed}
                title={`${settings.siteName} location`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full border-0 lg:h-[460px]"
              ></iframe>
              <a
                href={
                  settings.mapUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    address
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-accent shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <i className="bi bi-geo-alt-fill"></i>
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <JsonLd data={contactPageJsonLd(settings)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <JsonLd
        data={faqJsonLd(
          getContactFaqs(settings.siteName).map((faq) => ({
            question: faq.q,
            answer: faq.a,
          }))
        )}
      />
    </>
  );
}