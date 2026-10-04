import type { Metadata } from "next";
import { readCollection } from "@/lib/content";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/site";
import { absoluteUrl, itemListJsonLd, pageMetadata } from "@/lib/seo";
import type { Brand } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return pageMetadata({
    title: "Brands & Clients We Have Worked With",
    description: `The brands and clients who trust ${siteName} with their digital presence — from Lahore startups to established Pakistani businesses.`,
    path: "/brands",
    keywords: [
      `${siteName} clients`,
      "brands we have worked with",
      "digital agency Pakistan clients",
      "trusted web design agency",
    ],
    siteName,
  });
}

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const [brands, { siteName }] = await Promise.all([
    readCollection("brands") as Promise<Brand[]>,
    getSiteSettings(),
  ]);

  const schema = itemListJsonLd({
    name: `Brands that trust ${siteName}`,
    path: "/brands",
    items: brands.map((brand) => ({
      name: brand.name,
      url: brand.website && brand.website !== "#" ? brand.website : absoluteUrl("/brands"),
      image: absoluteUrl(brand.logo),
    })),
  });

  return (
    <>
      <JsonLd data={schema} />
      {/* Page Title */}
      <div className="border-b border-[#e0e0e0] bg-[#f8f9fa] pb-[30px] pt-[140px] text-center">
        <div className="bt-container">
          <h1 className="mb-5 text-[36px] font-bold leading-[1.2] text-[#222]">
            Brands We&apos;ve Worked With
          </h1>
          <p className="mx-auto mb-0 max-w-[700px] text-[18px] leading-[1.7] text-[#555]">
            From startups to established names, we&apos;re proud to partner
            with brands that trust us to bring their vision to life.
          </p>
        </div>
      </div>

      <section id="brands" className="section mt-10 !py-5">
        <div className="bt-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brands.length === 0 ? (
              <p className="col-span-full py-12 text-center text-[rgba(33,37,41,0.6)]">
                No brands added yet.
              </p>
            ) : (
              brands.map((brand, index) => {
                const hasSite = Boolean(brand.website && brand.website !== "#");
                const Wrapper = hasSite ? "a" : "div";
                return (
                <Wrapper
                  key={brand.id}
                  {...(hasSite
                    ? { href: brand.website, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  data-aos="fade-up"
                  data-aos-delay={(index % 4) * 100}
                  className={`group rounded-xl bg-white p-7 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]`}
                >
                  <div className="mb-5 flex h-20 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain grayscale transition duration-300 group-hover:grayscale-0"
                    />
                  </div>
                  <h3 className="mb-2 text-center text-lg font-bold">{brand.name}</h3>
                  {brand.description && (
                    <p className="mb-0 text-center text-sm leading-relaxed text-[rgba(33,37,41,0.65)]">
                      {brand.description}
                    </p>
                  )}
                  {hasSite && (
                    <p className="mb-0 mt-4 text-center text-xs font-semibold text-accent opacity-0 transition duration-300 group-hover:opacity-100">
                      Visit Website <i className="bi bi-box-arrow-up-right"></i>
                    </p>
                  )}
                </Wrapper>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}
