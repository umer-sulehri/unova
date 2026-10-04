import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readCollection } from "@/lib/content";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  serviceJsonLd,
  truncate,
} from "@/lib/seo";
import type { Project, Service } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [services, { siteName }] = await Promise.all([
    readCollection("services") as Promise<Service[]>,
    getSiteSettings(),
  ]);
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: `This service is no longer available. Browse ${siteName}'s current services.`,
      robots: { index: false, follow: true },
    };
  }

  const summary = truncate(service.heroSubtitle || service.tagline, 120);

  return pageMetadata({
    title: `${service.title} Services in Lahore`,
    description: `${summary} In-house delivery from ${siteName}, Lahore.`,
    path: `/services/${service.slug}`,
    keywords: [
      `${service.title.toLowerCase()} services`,
      `${service.title.toLowerCase()} Lahore`,
      `${service.title.toLowerCase()} Pakistan`,
      `affordable ${service.title.toLowerCase()}`,
      ...service.tools.slice(0, 4).map((tool) => tool.toLowerCase()),
    ],
    image: service.heroImage ? absoluteUrl(service.heroImage) : undefined,
    type: "article",
    siteName,
  });
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-6 text-center">
      <span
        className="mb-2 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest"
        style={{ backgroundColor: "rgba(13,131,253,0.08)", color: "#0d83fd" }}
      >
        {eyebrow}
      </span>
      <h2 className="relative mb-0 pb-4 text-[2rem] font-bold text-heading after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-[60px] after:-translate-x-1/2 after:bg-accent after:content-['']">
        {title}
      </h2>
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [services, projects] = (await Promise.all([
    readCollection("services"),
    readCollection("projects"),
  ])) as [Service[], Project[]];

  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related =
    service.relatedProjects.length > 0
      ? service.relatedProjects
          .map((s) => projects.find((p) => p.slug === s))
          .filter((p): p is Project => Boolean(p))
      : projects.slice(0, 3);

  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 4);

  const schema = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
    serviceJsonLd(service),
    faqJsonLd(service.faq),
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={schema} />
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-light-bg pb-16 pt-[150px]">
        <div className="bt-container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div data-aos="fade-right">
              <nav className="mb-4 flex items-center gap-2 text-sm text-[rgba(33,37,41,0.5)]">
                <Link href="/" className="hover:text-accent">Home</Link>
                <i className="bi bi-chevron-right text-[10px]"></i>
                <Link href="/services" className="hover:text-accent">Services</Link>
                <i className="bi bi-chevron-right text-[10px]"></i>
                <span>{service.title}</span>
              </nav>
              <h1
                className="mb-4 text-[36px] font-bold leading-[1.2]"
                style={{ color: service.color }}
              >
                {service.heroTitle || service.title}
              </h1>
              <p className="mb-6 text-lg leading-[1.7] text-[#555]">
                {service.heroSubtitle || service.tagline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-85"
                  style={{ backgroundColor: service.color }}
                >
                  Get a Free Consultation
                </Link>
                {service.packages.length > 0 && (
                  <a
                    href="#packages"
                    className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:bg-black/[.03]"
                    style={{ borderColor: service.color, color: service.color }}
                  >
                    View Packages
                  </a>
                )}
              </div>
            </div>
            {service.heroImage && (
              <div className="text-center" data-aos="fade-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="mx-auto max-h-[380px] w-auto rounded-2xl object-contain shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      {service.overview.length > 0 && (
        <section className="section py-14">
          <div className="bt-container">
            <SectionHeading eyebrow="Overview" title={`Why ${service.title}?`} />
            <div className="mx-auto max-w-[860px]" data-aos="fade-up">
              {service.overview.map((paragraph, i) => (
                <p key={i} className="text-[17px] leading-[1.8] text-[rgba(33,37,41,0.75)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Grid */}
      {service.benefits.length > 0 && (
        <section className="bg-light-bg py-14">
          <div className="bt-container">
            <SectionHeading eyebrow="Benefits" title="What You Gain" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.benefits.map((benefit, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="rounded-xl bg-white p-6 text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className="mb-4 mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full"
                    style={{ backgroundColor: `${service.color}18`, color: service.color }}
                  >
                    <i className={`bi ${benefit.icon} text-2xl`}></i>
                  </div>
                  <h3 className="mb-2 text-base font-bold">{benefit.title}</h3>
                  <p className="mb-0 text-sm leading-relaxed text-[rgba(33,37,41,0.65)]">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Process — numbered steps */}
      {service.process.length > 0 && (
        <section className="py-14">
          <div className="bt-container">
            <SectionHeading eyebrow="Our Process" title="How We Work" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="relative rounded-xl bg-white p-6 pt-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)]"
                >
                  <span
                    className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: service.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mb-2 text-base font-bold">{step.title}</h3>
                  <p className="mb-0 text-sm leading-relaxed text-[rgba(33,37,41,0.65)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deliverables checklist + Tools/tech badges */}
      {(service.deliverables.length > 0 || service.tools.length > 0) && (
        <section className="bg-light-bg py-14">
          <div className="bt-container grid gap-10 lg:grid-cols-2" data-aos="fade-up">
            {service.deliverables.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">What&apos;s Included</h2>
                <ul className="m-0 list-none p-0">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="mb-3 flex items-start">
                      <i
                        className="bi bi-check-circle-fill mr-3 mt-1 shrink-0"
                        style={{ color: service.color }}
                      ></i>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {service.tools.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-3">
                  {service.tools.map((tool) => (
                    <span
                      key={tool}
                      className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                      style={{ color: service.color }}
                    >
                      <i className="bi bi-gear-fill text-xs opacity-60"></i>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Package Cards */}
      {service.packages.length > 0 && (
        <section id="packages" className="py-14">
          <div className="bt-container">
            <SectionHeading eyebrow="Pricing" title="Choose Your Package" />
            <div className={`grid gap-6 md:grid-cols-2 ${service.packages.length > 2 ? "lg:grid-cols-3" : ""}`}>
              {service.packages.map((pkg, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className={`relative flex flex-col rounded-xl bg-white p-7 shadow-[0_5px_15px_rgba(0,0,0,0.05)] ${
                    pkg.highlighted ? "ring-2 lg:scale-[1.02]" : ""
                  }`}
                  style={pkg.highlighted ? ({ "--tw-ring-color": service.color } as React.CSSProperties) : undefined}
                >
                  {pkg.highlighted && (
                    <span
                      className="absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-bold text-white"
                      style={{ backgroundColor: service.color }}
                    >
                      Most Popular
                    </span>
                  )}
                  <h3 className="mb-1 text-xl font-bold">{pkg.name}</h3>
                  <p className="mb-5 text-sm text-[rgba(33,37,41,0.55)]">{pkg.tagline}</p>
                  <ul className="mb-6 list-none flex-1 p-0">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="mb-2.5 flex items-start text-[15px]">
                        <i
                          className="bi bi-check-lg mr-2 mt-0.5 shrink-0 font-bold"
                          style={{ color: service.color }}
                        ></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`block rounded-full py-3 text-center text-sm font-semibold transition ${
                      pkg.highlighted
                        ? "text-white hover:opacity-85"
                        : "border hover:bg-black/[.03]"
                    }`}
                    style={
                      pkg.highlighted
                        ? { backgroundColor: service.color }
                        : { borderColor: service.color, color: service.color }
                    }
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mini FAQ */}
      {service.faq.length > 0 && (
        <section className="bg-light-bg py-14">
          <div className="bt-container">
            <SectionHeading eyebrow="FAQ" title="Common Questions" />
            <div className="mx-auto max-w-[800px]" data-aos="fade-up">
              {service.faq.map((item, i) => (
                <details
                  key={i}
                  open={i === 0}
                  className="group mb-3 overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-heading [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <i className="bi bi-chevron-down shrink-0 text-xs transition-transform duration-300 group-open:rotate-180"></i>
                  </summary>
                  <p className="mb-0 border-t border-black/[.06] px-5 py-4 leading-relaxed text-[rgba(33,37,41,0.7)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="py-14">
          <div className="bt-container">
            <SectionHeading eyebrow="Our Work" title="Related Projects" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((project, i) => (
                <div
                  key={project.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="group overflow-hidden rounded-[15px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-[180px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-bold">{project.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[rgba(33,37,41,0.65)]">
                      {project.description}
                    </p>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
                    >
                      <i className="bi bi-box-arrow-up-right"></i> Live Demo
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/projects" className="btn btn-outline-primary rounded-full px-6 py-2.5">
                View All Projects <i className="bi bi-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="pb-20 pt-6">
        <div className="bt-container">
          <div
            className="overflow-hidden rounded-2xl px-8 py-12 text-center text-white"
            style={{
              background: `linear-gradient(135deg, ${service.color}, ${service.color}cc)`,
            }}
            data-aos="zoom-in"
          >
            <h2 className="mb-3 text-white">Ready to Get Started?</h2>
            <p className="mx-auto mb-7 max-w-[600px] text-white/85">
              Tell us about your project and we&apos;ll get back to you with a
              plan and a free consultation.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-default transition hover:scale-105"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="pb-16">
          <div className="bt-container">
            <h2 className="mb-6 text-center text-xl font-bold">Other Services</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherServices.map((other) => (
                <Link
                  key={other.id}
                  href={`/services/${other.slug}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition hover:-translate-y-1"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: other.color }}
                  >
                    <i className={`bi ${other.icon}`}></i>
                  </span>
                  <span className="text-sm font-semibold text-default">{other.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
