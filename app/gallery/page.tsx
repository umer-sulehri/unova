import type { Metadata } from "next";
import GalleryExplorer from "@/components/gallery/GalleryExplorer";
import { readCollection } from "@/lib/content";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/site";
import { absoluteUrl, itemListJsonLd, pageMetadata } from "@/lib/seo";
import type { GalleryItem } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return pageMetadata({
    title: "Design Gallery — Websites, Branding & Digital Products",
    description: `A visual showcase of ${siteName}'s design and development work: websites, brand identities, packaging and digital products crafted for clients across Pakistan.`,
    path: "/gallery",
    keywords: [
      "design gallery Pakistan",
      "graphic design portfolio Lahore",
      "brand identity examples",
      "web design showcase",
      "creative agency gallery",
    ],
    siteName,
  });
}

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [items, { siteName }] = await Promise.all([
    readCollection("gallery") as Promise<GalleryItem[]>,
    getSiteSettings(),
  ]);

  const schema = itemListJsonLd({
    name: `${siteName} design gallery`,
    path: "/gallery",
    items: items.map((item) => ({
      name: `${item.title} — ${item.category}`,
      url: absoluteUrl("/gallery"),
      image: absoluteUrl(item.image),
    })),
  });

  return (
    <>
      <JsonLd data={schema} />
      {/* Page Title */}
      <div className="border-b border-[#e0e0e0] bg-[#f8f9fa] pb-[30px] pt-[140px] text-center">
        <div className="bt-container">
          <h1 className="mb-5 text-[36px] font-bold leading-[1.2] text-[#222]">
            Our Gallery
          </h1>
          <p className="mx-auto mb-0 max-w-[700px] text-[18px] leading-[1.7] text-[#555]">
            A visual showcase of the work we&apos;re proud of — websites,
            brands, and digital experiences crafted for our clients.
          </p>
        </div>
      </div>

      <section id="gallery" className="section mt-10 !py-5">
        <div className="bt-container" data-aos="fade-up">
          <GalleryExplorer items={items} />
        </div>
      </section>
    </>
  );
}
