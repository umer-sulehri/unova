import Link from "next/link";
import { readCollection } from "@/lib/content";
import type { Service } from "@/lib/types";

export default async function ServicesSection() {
  const services = (await readCollection("services")) as Service[];

  return (
    <section id="about-services" className="section">
      <div className="bt-container relative pb-[60px] text-center" data-aos="fade-up">
        <h2 className="relative mb-5 pb-5 text-[32px] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent">
          What We Do
        </h2>
        <p className="mx-auto mb-0 max-w-[640px]">
          Seven disciplines, one team. Mix them however your brand needs — a
          logo, a full website, or everything at once.
        </p>
      </div>

      <div className="bt-container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-7 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            >
              <span
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ backgroundColor: service.color }}
              ></span>

              <div
                className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: service.color }}
              >
                <i className={`bi ${service.icon} text-2xl`}></i>
              </div>

              <h3 className="mb-2 text-xl font-bold">{service.title}</h3>
              <p className="mb-5 flex-1 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                {service.tagline}
              </p>

              {service.tools.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {service.tools.slice(0, 3).map((tool) => (
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
                Learn more
                <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center" data-aos="fade-up">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-accent px-8 py-3 font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-white"
          >
            View all services
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}