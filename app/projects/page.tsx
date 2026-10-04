import type { Metadata } from "next";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";
import { readCollection } from "@/lib/content";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/site";
import { absoluteUrl, itemListJsonLd, pageMetadata } from "@/lib/seo";
import type { Project } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return pageMetadata({
    title: "Our Portfolio — Web, App & Design Projects",
    description: `${siteName} portfolio: e-commerce stores, business websites and web apps built for clients in Pakistan. Live demos, tech stacks and outcomes.`,
    path: "/projects",
    keywords: [
      "web design portfolio Pakistan",
      "UI UX agency portfolio",
      "ecommerce website examples",
      "web app development portfolio",
      "Lahore web developer portfolio",
    ],
    siteName,
  });
}

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, { siteName }] = await Promise.all([
    readCollection("projects") as Promise<Project[]>,
    getSiteSettings(),
  ]);

  const schema = itemListJsonLd({
    name: `${siteName} project portfolio`,
    path: "/projects",
    items: projects.map((project) => ({
      name: project.title,
      url: absoluteUrl("/projects"),
      image: absoluteUrl(project.image),
    })),
  });

  return (
    <section id="projects" className="section projects-section mt-20 !py-5">
      <div className="bt-container" data-aos="fade-up">
        {/* Section Header */}
        <div className="relative pb-[60px] text-center">
          <h1 className="relative mb-4 pb-5 text-[2.5rem] font-bold leading-[1.2] text-heading after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-[60px] after:-translate-x-1/2 after:bg-accent after:content-['']">
            Our Portfolio
          </h1>
          <p className="mx-auto mb-0 max-w-[700px] text-[1.1rem] leading-[1.7] text-[rgba(33,37,41,0.7)]">
            Explore our latest web projects showcasing modern design,
            performance optimization, and seamless user experiences
          </p>
        </div>

        <ProjectsExplorer projects={projects} />
      </div>
      <JsonLd data={schema} />
    </section>
  );
}
