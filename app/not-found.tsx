import type { Metadata } from "next";
import Link from "next/link";
import { readCollection } from "@/lib/content";
import { getSiteSettings } from "@/lib/site";
import { absoluteUrl, truncate } from "@/lib/seo";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return {
    title: "Page Not Found (404)",
    description: `The page you are looking for has moved or no longer exists. Browse ${siteName} services, our portfolio and gallery instead.`,
    alternates: { canonical: absoluteUrl("/404") },
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

export default async function NotFound() {
  const services = (await readCollection("services")) as Service[];
  const popular = services.slice(0, 4);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-light-bg pb-24 pt-[150px]">
      <div className="bt-container text-center">
        <span className="mb-4 inline-block font-semibold text-accent">ERROR 404</span>

        <h1 className="mb-4 text-[2.5rem] font-bold leading-[1.15] lg:text-[3.5rem]">
          We couldn&apos;t find that page
        </h1>

        <p className="mx-auto mb-8 max-w-[620px] text-[17px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
          The link may be broken or the page may have moved. Try one of the
          shortcuts below, or head back to the homepage.
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-[rgba(33,37,41,0.2)] px-8 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            View Our Work
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[rgba(33,37,41,0.2)] px-8 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            Contact Us
          </Link>
        </div>

        {popular.length > 0 && (
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-5 text-lg font-semibold">Popular services</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group rounded-xl bg-white p-5 text-left shadow-[0_4px_18px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)]"
                >
                  <span
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white"
                    style={{ backgroundColor: service.color }}
                  >
                    <i className={`bi ${service.icon}`}></i>
                  </span>
                  <span className="mb-1 block text-[15px] font-bold text-heading">
                    {service.title}
                  </span>
                  <span className="m-0 block text-[13px] leading-relaxed text-[rgba(33,37,41,0.65)]">
                    {truncate(service.tagline, 90)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
