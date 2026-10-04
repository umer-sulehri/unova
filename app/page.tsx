import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import VideoShowreel from "@/components/home/VideoShowreel";
import FeaturesTabs from "@/components/home/FeaturesTabs";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesCards from "@/components/home/FeaturesCards";
import FeaturesTwo from "@/components/home/FeaturesTwo";
import CallToAction from "@/components/home/CallToAction";
import Clients from "@/components/home/Clients";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import CallToActionTwo from "@/components/home/CallToActionTwo";
import ContactSection from "@/components/home/ContactSection";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/site";
import { getHomeFaqs } from "@/lib/faq";
import { readCollection } from "@/lib/content";
import {
  SHOWREEL_DURATION,
  SHOWREEL_POSTER,
  SHOWREEL_SRC,
  absoluteUrl,
  faqJsonLd,
  itemListJsonLd,
  pageMetadata,
  videoJsonLd,
} from "@/lib/seo";
import type { Service } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  const title = "Digital Agency Lahore — UI/UX, Web Dev & Marketing";

  const metadata = pageMetadata({
    title,
    description: `${siteName} is a Lahore digital agency building brands with UI/UX design, web development, SEO and social media. 120+ projects delivered.`,
    path: "/",
    keywords: [
      "digital agency Lahore",
      "UI UX design agency Pakistan",
      "web development Lahore",
      "SEO agency Pakistan",
      "social media marketing Lahore",
      "brand identity design Pakistan",
    ],
    siteName,
  });

  // Next does not apply the root layout's `title.template` to the homepage
  // itself, so the admin-managed brand name is appended explicitly here.
  return {
    ...metadata,
    title: { absolute: `${title} | ${siteName}` },
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, settings] = await Promise.all([
    readCollection("services") as Promise<Service[]>,
    getSiteSettings(),
  ]);
  const { siteName } = settings;

  const schema = [
    videoJsonLd({
      name: `${siteName} — Digital Experiences`,
      description: `A four minute look at how ${siteName} designs brands, builds websites and runs marketing campaigns for clients.`,
      thumbnail: SHOWREEL_POSTER,
      duration: SHOWREEL_DURATION,
      contentUrl: SHOWREEL_SRC,
      uploadDate: "2026-10-01",
    }),
    faqJsonLd(
      getHomeFaqs(siteName).map(({ q, a }) => ({ question: q, answer: a }))
    ),
    itemListJsonLd({
      name: `${siteName} digital services`,
      path: "/",
      items: services.map((service) => ({
        name: service.title,
        url: absoluteUrl(`/services/${service.slug}`),
      })),
    }),
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={schema} />
      <Hero />
      <VideoShowreel />
      {/* <About /> — re-enable with: import About from "@/components/home/About"; */}
      <ServicesSection />
      <FeaturesTabs />
      <FeaturesCards />
      <FeaturesTwo />
      <CallToAction />
      <Clients />
      <Testimonials />
      <Faq />
      <CallToActionTwo />
      <ContactSection />
    </>
  );
}
