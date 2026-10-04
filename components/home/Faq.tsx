"use client";

import { useMemo, useState } from "react";
import { getHomeFaqs } from "@/lib/faq";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const { settings } = useSiteSettings();
  const faqs = useMemo(() => getHomeFaqs(settings.siteName), [settings.siteName]);

  return (
    <section id="faq" className="faq section bg-light-bg">
      <div className="bt-container">
        <div className="grid gap-x-6 lg:grid-cols-12">
          <div className="lg:col-span-5" data-aos="fade-up">
            <h2 className="mb-4 text-[2.5rem] font-bold leading-[1.2] text-heading">
              Have a question? Check out the FAQ
            </h2>
            <p className="mb-8 text-base text-default">
              Explore the most common questions about our design, development,
              and marketing services.
            </p>
            <div
              className="hidden lg:block"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {/* Keep your SVG arrow here */}
            </div>
          </div>

          <div className="mt-8 lg:col-span-7 lg:mt-0" data-aos="fade-up" data-aos-delay="300">
            <div>
              {faqs.map((faq, idx) => {
                const open = openIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className={`relative mb-[15px] overflow-hidden rounded-[10px] bg-white p-5 last:mb-0`}
                  >
                    <h3
                      onClick={() => setOpenIndex(open ? -1 : idx)}
                      className={`m-0 mr-[30px] flex cursor-pointer items-center text-base font-semibold leading-[24px] transition duration-300 hover:text-accent ${
                        open ? "text-accent" : ""
                      }`}
                    >
                      {faq.q}
                    </h3>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        open
                          ? "visible pt-2.5 opacity-100 [grid-template-rows:1fr]"
                          : "invisible opacity-0 [grid-template-rows:0fr]"
                      }`}
                    >
                      <p className="mb-0 overflow-hidden">{faq.a}</p>
                    </div>
                    <i
                      onClick={() => setOpenIndex(open ? -1 : idx)}
                      className={`bi bi-chevron-right absolute right-5 top-5 cursor-pointer text-base leading-none transition duration-300 hover:text-accent ${
                        open ? "rotate-90 text-accent" : ""
                      }`}
                    ></i>
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
