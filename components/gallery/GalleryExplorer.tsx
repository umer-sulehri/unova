"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/lib/types";

export default function GalleryExplorer({ items }: { items: GalleryItem[] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  // Portal target: null while rendering on the server, resolved on the client.
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    );
    return unique.sort();
  }, [items]);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? items
        : items.filter((item) => item.category === activeFilter),
    [items, activeFilter]
  );

  // Lock body scroll (with scrollbar compensation) while the lightbox is open.
  useEffect(() => {
    if (!selected) return;
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
  }, [selected]);

  // Focus the lightbox on open and restore focus to the thumbnail on close.
  useEffect(() => {
    if (selected) {
      if (!triggerRef.current) triggerRef.current = document.activeElement;
      dialogRef.current?.focus();
      return;
    }
    const trigger = triggerRef.current;
    if (trigger instanceof HTMLElement) trigger.focus();
    triggerRef.current = null;
  }, [selected]);

  // Escape closes and Tab is trapped inside the lightbox.
  useEffect(() => {
    if (!selected) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
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
  }, [selected]);

  return (
    <>
      {/* Category filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-3" data-aos="fade-up" data-aos-delay="100">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`rounded-full border-0 px-5 py-2 font-medium transition-all duration-300 ${
            activeFilter === "all"
              ? "-translate-y-0.5 bg-accent text-white"
              : "bg-accent/[.08] text-accent hover:-translate-y-0.5 hover:bg-accent hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveFilter(category)}
            className={`rounded-full border-0 px-5 py-2 font-medium transition-all duration-300 ${
              activeFilter === category
                ? "-translate-y-0.5 bg-accent text-white"
                : "bg-accent/[.08] text-accent hover:-translate-y-0.5 hover:bg-accent hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] max-md:[grid-template-columns:1fr]">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[rgba(33,37,41,0.6)]">
            <i className="bi bi-images mb-4 block text-[3rem] text-[rgba(33,37,41,0.3)]"></i>
            <h4>No Images Found</h4>
          </div>
        ) : (
          filtered.map((item, index) => (
            <div
              key={item.id}
              data-aos="zoom-in"
              data-aos-delay={(index % 3) * 100}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View ${item.title}`}
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setSelected(item);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                triggerRef.current = e.currentTarget;
                setSelected(item);
              }}
              className="group relative cursor-pointer overflow-hidden rounded-[15px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-5 pt-10 text-white transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="mb-1 text-lg font-bold text-white">{item.title}</h3>
                {item.category && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium">
                    {item.category}
                  </span>
                )}
              </div>
              <i className="bi bi-arrows-angle-expand absolute right-4 top-4 z-[2] rounded-full bg-white/90 px-2.5 py-1.5 text-sm text-default opacity-0 transition duration-300 group-hover:opacity-100"></i>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {selected &&
        portalTarget &&
        createPortal(
        <div className="fixed inset-0 z-[1055] overflow-y-auto overscroll-contain">
          <div
            className="fixed inset-0 animate-[modal-backdrop-in_0.15s_linear] bg-[rgba(33,37,41,0.75)] backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          ></div>

          {/* items-start + my-auto: centred when it fits, scrollable when it does not. */}
          <div className="flex min-h-full items-start justify-center p-4 sm:items-center">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-lightbox-title"
              tabIndex={-1}
              className="animate-[modal-dialog-in_0.25s_ease-out] relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] outline-none"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/10 px-6 py-4">
                <h5
                  id="gallery-lightbox-title"
                  className="m-0 text-lg font-bold leading-snug text-heading"
                >
                  {selected.title}
                </h5>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelected(null)}
                  className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl leading-none text-[rgba(33,37,41,0.55)] transition hover:bg-black/[.06] hover:text-heading"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f8f9fa]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="mx-auto max-h-[75vh] w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>,
          portalTarget
        )}
    </>
  );
}
