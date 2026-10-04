import type { Metadata } from "next";
import Link from "next/link";
import { readCollection } from "@/lib/content";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/site";
import { absoluteUrl, itemListJsonLd, pageMetadata } from "@/lib/seo";
import type { Service } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return pageMetadata({
    title: "Services — UI/UX, Web Development, SEO & Marketing",
    description: `${siteName} services: UI/UX design, web development, graphic design, brand identity, SEO and social media. Fixed scopes, fixed timelines, one Lahore team.`,
    path: "/services",
    keywords: [
      "UI UX design services",
      "web development services Pakistan",
      "graphic design agency Lahore",
      "brand identity services",
      "SEO services Pakistan",
      "social media management agency",
      "custom CMS development",
    ],
    siteName,
  });
}

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, { siteName }] = await Promise.all([
    readCollection("services") as Promise<Service[]>,
    getSiteSettings(),
  ]);

  const schema = itemListJsonLd({
    name: `${siteName} digital agency services`,
    path: "/services",
    items: services.map((service) => ({
      name: service.title,
      url: absoluteUrl(`/services/${service.slug}`),
      image: service.heroImage ? absoluteUrl(service.heroImage) : undefined,
    })),
  });

  return (
    <>
      <JsonLd data={schema} />
      {/* Page Title */}
      <div className="border-b border-[#e0e0e0] bg-[#f8f9fa] pb-[30px] pt-[140px] text-center">
        <div className="bt-container">
          <h1 className="mb-5 text-[36px] font-bold leading-[1.2] text-[#222]">
            Our Services
          </h1>
          <p className="mx-auto mb-0 max-w-[760px] text-[18px] leading-[1.7] text-[#555]">
            {siteName} is a Lahore-based digital agency delivering UI/UX
            design, web development, graphic design, brand identity, SEO and
            social media marketing. Every engagement is scoped in writing,
            priced up front, and built by the same in-house team from kickoff
            to launch.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section id="service-details" className="service-details section">
        <div className="bt-container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
                className="group flex flex-col rounded-[15px] bg-white p-7 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                style={{ borderTop: `3px solid ${service.color}` }}
              >
                <div
                  className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: service.color }}
                >
                  <i className={`bi ${service.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mb-6 flex-1 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                  {service.tagline}
                </p>
                {service.tools.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {service.tools.slice(0, 4).map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${service.color}14`,
                          color: service.color,
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
                <span
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: service.color }}
                >
                  Explore Service
                  <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
