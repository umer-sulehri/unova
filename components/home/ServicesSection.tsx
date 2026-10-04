import Link from "next/link";
import { readCollection } from "@/lib/content";
import type { Service } from "@/lib/types";

export default async function ServicesSection() {
  const services = (await readCollection("services")) as Service[];
  const featured = services.slice(0, 6);

  return (
    <section id="services" className="section bg-light-bg">
      <div className="bt-container relative pb-[60px] text-center" data-aos="fade-up">
        <span className="mb-3 inline-block font-semibold text-accent">
          WHAT WE OFFER
        </span>
        <h2 className="relative mb-5 pb-5 text-[32px] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent">
          Services Built Around Your Goals
        </h2>
        <p className="mx-auto mb-0 max-w-[640px]">
          Pick a single discipline or let us handle the whole journey — every
          service below is delivered by the same in-house team.
        </p>
      </div>

      <div className="bt-container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-7 shadow-[0_4px_18px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(0,0,0,0.12)]"
            >
              <span
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ backgroundColor: service.color }}
              ></span>

              <div className="mb-5 flex items-center justify-between">
                <div
                  className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl text-[26px] text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
                  style={{ backgroundColor: service.color }}
                >
                  <i className={`bi ${service.icon}`}></i>
                </div>
                <span
                  className="text-5xl font-bold leading-none opacity-[.07] transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: service.color }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mb-2 text-[22px] font-bold">{service.title}</h3>
              <p className="mb-5 flex-1 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.72)]">
                {service.tagline}
              </p>

              {service.tools.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {service.tools.slice(0, 4).map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
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
                Explore service
                <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1.5"></i>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center" data-aos="fade-up">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-medium text-white shadow-[0_10px_25px_rgba(13,131,253,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
          >
            View all services
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}