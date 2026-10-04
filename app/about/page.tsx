import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import StatsStrip from "@/components/about/StatsStrip";
import VideoSection from "@/components/about/VideoSection";
import StorySection from "@/components/about/StorySection";
import ServicesSection from "@/components/about/ServicesSection";
import FeaturesSection from "@/components/about/FeaturesSection";
import ProcessSection from "@/components/about/ProcessSection";
import TeamSection from "@/components/about/TeamSection";
import CtaSection from "@/components/about/CtaSection";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/site";
import {
  SHOWREEL_DURATION,
  SHOWREEL_POSTER,
  SHOWREEL_SRC,
  breadcrumbJsonLd,
  pageMetadata,
  videoJsonLd,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return pageMetadata({
    title: "About Us — Digital Agency in Lahore, Pakistan",
    description: `${siteName} is an independent Lahore digital agency working with brands since 2020 on UI/UX design, web development, SEO and social media.`,
    path: "/about",
    keywords: [
      `about ${siteName}`,
      "digital agency Lahore",
      "creative studio Pakistan",
      "UI UX agency Lahore",
      "web development team Lahore",
      "creative agency Pakistan",
    ],
    siteName,
  });
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { siteName } = await getSiteSettings();

  const schema = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
    videoJsonLd({
      name: `${siteName} — Digital Experiences`,
      description: `Four minutes on how ${siteName} thinks, what the team makes, and the results the agency chases for every client.`,
      thumbnail: SHOWREEL_POSTER,
      duration: SHOWREEL_DURATION,
      contentUrl: SHOWREEL_SRC,
      uploadDate: "2026-10-01",
    }),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <AboutHero />
      <StatsStrip />
      <VideoSection />
      <StorySection />
      <ServicesSection />
      <FeaturesSection />
      <ProcessSection />
      <TeamSection />
      <CtaSection />
    </>
  );
}
