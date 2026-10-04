"use client";

import { useMemo, useState } from "react";
import { getContactFaqs } from "@/lib/faq";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { settings } = useSiteSettings();
  const faqs = useMemo(() => getContactFaqs(settings.siteName), [settings.siteName]);

  return (
    <section className="section" data-aos="fade-up">
      <div className="bt-container">
        <div className="grid items-start gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent-deep)]/[.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--brand-accent-deep)]">
              <i className="bi bi-question-circle"></i>
              FAQ
            </span>
            <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] max-md:text-[1.75rem]">
              Answers before you even ask
            </h2>
            <p className="mb-6 max-w-[420px] text-[16px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
              The questions we get most often. Anything else, just ask in the
              form and we&rsquo;ll answer it directly.
            </p>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-accent-deep)] px-6 py-2.5 font-medium text-[var(--brand-accent-deep)] transition-all duration-300 hover:bg-[var(--brand-accent-deep)] hover:text-white"
            >
              <i className="bi bi-chat-square-text"></i>
              Ask your question
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-black/[.06] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.04)]">
              {faqs.map((faq, idx) => {
                const open = openIndex === idx;
                const isLast = idx === faqs.length - 1;
                return (
                  <div key={faq.q} className={isLast ? "" : "border-b border-black/[.06]"}>
                    <h3 className="m-0">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(open ? null : idx)}
                        aria-expanded={open}
                        className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[16px] font-semibold transition-colors duration-300 hover:text-[var(--brand-accent-deep)] max-md:px-5 ${
                          open ? "text-[var(--brand-accent-deep)]" : "text-heading"
                        }`}
                      >
                        {faq.q}
                        <i
                          className={`bi bi-chevron-right shrink-0 text-base transition-transform duration-300 ${
                            open ? "rotate-90 text-[var(--brand-accent-deep)]" : ""
                          }`}
                        ></i>
                      </button>
                    </h3>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        open
                          ? "visible pb-5 opacity-100 [grid-template-rows:1fr]"
                          : "invisible opacity-0 [grid-template-rows:0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="m-0 px-6 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)] max-md:px-5">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}