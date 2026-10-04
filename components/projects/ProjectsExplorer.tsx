"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Project } from "@/lib/types";

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl leading-none text-[rgba(33,37,41,0.55)] transition hover:bg-black/[.06] hover:text-heading"
    >
      <i className="bi bi-x-lg"></i>
    </button>
  );
}

export default function ProjectsExplorer({
  projects,
}: {
  projects: Project[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  // Portal target: null while rendering on the server, resolved on the client.
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  const filterOptions = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((project) =>
      project.technologies.forEach((tech) => techs.add(tech))
    );
    return Array.from(techs).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(term)
        );
      const matchesFilter =
        activeFilter === "all" ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(activeFilter)
        );
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, activeFilter]);

  // Lock body scroll while the modal is open and compensate for the scrollbar so
  // the page behind does not shift sideways.
  useEffect(() => {
    if (!selectedProject) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [selectedProject]);

  // Move focus into the dialog on open and back to the card on close.
  useEffect(() => {
    if (selectedProject) {
      if (!triggerRef.current) triggerRef.current = document.activeElement;
      dialogRef.current?.focus();
      return;
    }
    const trigger = triggerRef.current;
    if (trigger instanceof HTMLElement) trigger.focus();
    triggerRef.current = null;
  }, [selectedProject]);

  // Escape closes the modal and Tab is trapped inside it.
  useEffect(() => {
    if (!selectedProject) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && dialogRef.current?.contains(active);

      // Focus was on the dialog itself: send it to an edge so Tab keeps working.
      if (!inside) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedProject]);

  return (
    <>
      {/* Search and Filter */}
      <div className="mx-auto my-12 max-w-[800px]" data-aos="fade-up" data-aos-delay="100">
        <div className="relative mb-8">
          <input
            type="text"
            id="project-search"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-[rgba(33,37,41,0.2)] bg-white px-5 py-3 text-base text-default shadow-[0_2px_15px_rgba(0,0,0,0.05)] transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(13,131,253,0.2)] focus:outline-none"
          />
          <i className="bi bi-search absolute right-5 top-1/2 -translate-y-1/2 text-[rgba(33,37,41,0.5)]"></i>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            data-filter="all"
            onClick={() => setActiveFilter("all")}
            className={`rounded-full border-0 px-5 py-2 font-medium transition-all duration-300 ${
              activeFilter === "all"
                ? "-translate-y-0.5 bg-accent text-white"
                : "bg-accent/[.08] text-accent hover:-translate-y-0.5 hover:bg-accent hover:text-white"
            }`}
          >
            All Projects
          </button>
          {filterOptions.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setActiveFilter(activeFilter === tech ? "all" : tech)}
              className={`rounded-full border-0 px-5 py-2 font-medium transition-all duration-300 ${
                activeFilter === tech
                  ? "-translate-y-0.5 bg-accent text-white"
                  : "bg-accent/[.08] text-accent hover:-translate-y-0.5 hover:bg-accent hover:text-white"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-8 grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(350px,1fr))] max-md:[grid-template-columns:1fr]">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[rgba(33,37,41,0.6)]">
            <i className="bi bi-folder-x mb-4 block text-[3rem] text-[rgba(33,37,41,0.3)]"></i>
            <h4>No Projects Found</h4>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <div
              key={project.id}
              data-tech={project.technologies.map((t) => t.toLowerCase()).join(" ")}
              data-title={project.title.toLowerCase()}
              data-id={project.id}
              style={
                {
                  "--delay": index + 1,
                  animationDelay: "calc(var(--delay) * 0.1s)",
                } as React.CSSProperties
              }
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View details for ${project.title}`}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) return;
                triggerRef.current = e.currentTarget;
                setSelectedProject(project);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                triggerRef.current = e.currentTarget;
                setSelectedProject(project);
              }}
              className="group cursor-pointer overflow-hidden rounded-[15px] bg-white opacity-0 shadow-[0_5px_15px_rgba(0,0,0,0.05)] [transform:translateY(30px)] transition-all duration-300 animate-[fade-in-up_0.5s_forwards] hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <div className="relative h-[220px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-[15px] top-[15px] z-[2] rounded-full bg-accent px-[15px] py-[5px] text-[0.8rem] font-medium text-white">
                  Featured
                </span>
              </div>
              <div className="p-[25px]">
                <h3 className="mb-3 text-[1.5rem] font-bold leading-tight text-heading">
                  {project.title}
                </h3>
                <p className="mb-6 leading-[1.6] text-[rgba(33,37,41,0.7)]">
                  {project.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-accent/[.08] px-3 py-[5px] text-[0.8rem] font-medium text-accent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded bg-accent p-2.5 text-center font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b6fd7]"
                  >
                    <i className="bi bi-box-arrow-up-right"></i> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Project Modal */}
      {selectedProject &&
        portalTarget &&
        createPortal(
        <div className="fixed inset-0 z-[1055] overflow-y-auto overscroll-contain">
          <div
            className="fixed inset-0 animate-[modal-backdrop-in_0.15s_linear] bg-[rgba(33,37,41,0.6)] backdrop-blur-[2px]"
            onClick={() => setSelectedProject(null)}
          ></div>

          {/*
            items-start + my-auto keeps the dialog centred when it fits and fully
            reachable when it is taller than the viewport (plain items-center
            clips the top and cannot be scrolled to).
          */}
          <div className="flex min-h-full items-start justify-center p-4 sm:items-center">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              className="animate-[modal-dialog-in_0.25s_ease-out] relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-[820px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] outline-none"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/10 px-6 py-4">
                <h5
                  id="project-modal-title"
                  className="m-0 text-lg font-bold leading-snug text-heading"
                >
                  {selectedProject.title}
                </h5>
                <CloseButton onClick={() => setSelectedProject(null)} />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="bg-[#f8f9fa]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="mx-auto max-h-[42vh] w-full object-contain"
                  />
                </div>

                <div className="px-6 py-5">
                  <h6 className="mb-2 text-sm font-bold uppercase tracking-[.08em] text-[rgba(33,37,41,0.5)]">
                    Project Description
                  </h6>
                  <p className="mb-0 leading-[1.7] text-[rgba(33,37,41,0.8)]">
                    {selectedProject.description}
                  </p>

                  <h6 className="mb-3 mt-5 text-sm font-bold uppercase tracking-[.08em] text-[rgba(33,37,41,0.5)]">
                    Tech Stack
                  </h6>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-1.5 rounded-full bg-accent/[.08] px-3 py-1.5 text-[0.8rem] font-medium text-accent"
                      >
                        <i className="bi bi-check-circle"></i> {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-center font-medium text-white transition hover:bg-[#0b6fd7]"
                    >
                      <i className="bi bi-box-arrow-up-right"></i> Live Demo
                    </a>
                    <Link
                      href="/contact"
                      onClick={() => setSelectedProject(null)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[rgba(33,37,41,0.2)] bg-[rgba(33,37,41,0.04)] px-4 py-2.5 text-center font-medium text-default transition hover:border-accent/40 hover:bg-accent/[.06] hover:text-accent"
                    >
                      <i className="bi bi-chat-dots"></i> Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
          portalTarget
        )}
    </>
  );
}
