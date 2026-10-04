"use client";

import { useState } from "react";

const tabs = [
  {
    id: 1,
    label: "Design That Speaks",
    heading: "Designs That Actually Speak",
    text: "We don’t just make things look pretty — we design with purpose to help your brand connect and stand out.",
    items: [
      "Unique logo & visual identity for your brand",
      "Scroll-stopping social media and ad graphics",
      "User-friendly web & app interfaces",
      "Consistent design that reflects your brand's voice",
    ],
    stat: { value: "120+", label: "brands styled" },
    image: "/img/features-illustration-2.webp",
    alt: "Creative Design Illustration",
  },
  {
    id: 2,
    label: "Marketing That Works",
    heading: "Marketing That Brings You Results",
    text: "From strategy to execution, we create marketing campaigns that actually grow your business — not just your follower count.",
    items: [
      "Paid ads (Meta, Google, YouTube) that convert",
      "SEO-friendly blogs & content creation",
      "Email marketing that builds loyal audiences",
      "Data-backed decisions that lead to growth",
    ],
    stat: { value: "2×", label: "average engagement lift" },
    image: "/img/features-illustration-1.webp",
    alt: "Marketing Strategy Illustration",
  },
  {
    id: 3,
    label: "True Partnership",
    heading: "We’re Not Just a Team — We’re Your Partner",
    text: "We believe in honest communication, creative collaboration, and always putting your goals first.",
    items: [
      "Fast responses & ongoing communication",
      "Easy feedback & revision cycles",
      "No confusion — just clear, transparent workflows",
      "Continued support, even after launch",
    ],
    stat: { value: "99%", label: "clients return" },
    image: "/img/features-illustration-3.webp",
    alt: "Collaboration Illustration",
  },
];

export default function FeaturesTabs() {
  const [activeTab, setActiveTab] = useState(1);
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="features" className="section">
      <div className="bt-container relative pb-[60px] text-center" data-aos="fade-up">
        <span className="mb-3 inline-block font-semibold text-accent">
          HOW WE CREATE IMPACT
        </span>
        <h2 className="relative  pb-5 text-[32px] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent">
          Features
        </h2>
        {/* <p className="mx-auto mb-0 max-w-[620px]">
          We combine creativity, strategy, and collaboration to give your brand a
          digital edge that actually works.
        </p> */}
      </div>

      <div className="bt-container">
        <div className="flex justify-center" data-aos="fade-up" data-aos-delay="100">
          <ul className="m-0 inline-flex list-none flex-wrap items-center justify-center gap-1.5 rounded-full bg-[rgba(33,37,41,0.04)] p-1.5">
            {tabs.map((tab) => (
              <li key={tab.id} className="m-0 p-0">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-7 py-2.5 text-sm font-medium transition duration-300 max-[468px]:px-4 max-[468px]:py-2 ${activeTab === tab.id
                    ? "bg-accent text-white shadow-[0_8px_20px_rgba(13,131,253,0.3)]"
                    : "text-heading hover:bg-white hover:text-accent"
                    }`}
                >
                  <span
                    className={`hidden h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold sm:flex ${activeTab === tab.id ? "bg-white/20" : "bg-accent/10 text-accent"
                      }`}
                  >
                    {tab.id}
                  </span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[30px]" data-aos="fade-up" data-aos-delay="200">
          <div
            key={active.id}
            className="animate-[fade-in_0.4s_ease-in-out] rounded-2xl bg-light-bg p-7 lg:p-10"
          >
            <div className="grid gap-x-8 items-center lg:grid-cols-2">
              <div className="order-2 flex flex-col justify-center lg:order-1">
                <h3 className="relative mb-4 pb-4 text-[28px] font-bold after:absolute after:bottom-0 after:left-0 after:block after:h-[3px] after:w-[60px] after:bg-accent">
                  {active.heading}
                </h3>
                <p className="mb-6 text-[17px] leading-[1.7] text-[rgba(33,37,41,0.75)]">
                  {active.text}
                </p>

                <ul className="m-0 mb-6 list-none p-0">
                  {active.items.map((item) => (
                    <li key={item} className="mb-3 flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/[.12]">
                        <i className="bi bi-check-lg text-sm leading-none text-accent"></i>
                      </span>
                      <span className="text-[16px] text-[rgba(33,37,41,0.8)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="inline-flex w-fit items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                  <span className="text-[2rem] font-bold leading-none text-accent">
                    {active.stat.value}
                  </span>
                  <span className="text-sm text-[rgba(33,37,41,0.65)]">
                    {active.stat.label}
                  </span>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={active.alt}
                  className="mx-auto h-auto max-w-full rounded-2xl object-cover shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}