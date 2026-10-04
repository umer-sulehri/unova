import Link from "next/link";
import { getSiteSettings } from "@/lib/site";

const reasons = [
  {
    icon: "bi-patch-check",
    tint: "#20a5f8",
    bg: "#deedfd",
    title: "One team, end to end",
    text: "Design, development, and marketing under one roof — so nothing gets lost in a handover between agencies.",
  },
  {
    icon: "bi-sunrise",
    tint: "#48c88a",
    bg: "#d5f1e4",
    title: "Work that ships",
    text: "No endless revisions on a concept that was never right. We prototype early and lock scope before the build.",
  },
  {
    icon: "bi-shield-check",
    tint: "#f28484",
    bg: "#fdeded",
    title: "Secure & maintainable",
    text: "Clean, documented code with sane dependency choices — safe to run and easy for your team to pick up.",
  },
  {
    icon: "bi-speedometer2",
    tint: "#edb86e",
    bg: "#fff3e2",
    title: "Built for speed",
    text: "Performance budgets from the first sprint, because a beautiful page nobody waits for still fails.",
  },
];

const promises = [
  { icon: "bi-calendar-check", label: "Fixed timelines" },
  { icon: "bi-receipt", label: "Fixed pricing" },
  { icon: "bi-chat-dots", label: "Weekly updates" },
  { icon: "bi-headset", label: "Support after launch" },
];

export default async function WhyUs() {
  const { siteName } = await getSiteSettings();

  return (
    <section id="features-cards" className="section">
      <div className="bt-container">
        <div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
          {/* Left: intro + image */}
          <div className="lg:col-span-5" data-aos="fade-right">
            <span className="mb-3 inline-block font-semibold text-accent">
              WHY {siteName.toUpperCase()}
            </span>
            <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] lg:text-[1.75rem]">
              The reasons clients stay with us
            </h2>
            <p className="mb-8 text-[16px] leading-[1.7] text-[rgba(33,37,41,0.72)]">
              Anyone can promise great work. Here is exactly how we make that
              promise keep — same four standards on every project, from a one
              page site to a full rebrand.
            </p>

            <div className="relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/about-2.webp"
                alt={`${siteName} team collaborating`}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {promises.map((promise) => (
                <div
                  key={promise.label}
                  className="flex items-center gap-2.5 rounded-xl bg-light-bg px-4 py-3 text-sm font-semibold text-heading"
                >
                  <i className={`bi ${promise.icon} text-accent`}></i>
                  {promise.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: reason rows */}
          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <div
                  key={reason.title}
                  data-aos="fade-left"
                  data-aos-delay={index * 100}
                  className="group relative overflow-hidden rounded-2xl border border-black/[.06] bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.09)]"
                >
                  <span
                    className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-40 transition-transform duration-500 group-hover:scale-125"
                    style={{ backgroundColor: reason.bg }}
                  ></span>

                  <div className="relative">
                    <div
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: reason.bg, color: reason.tint }}
                    >
                      <i className={`bi ${reason.icon}`}></i>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{reason.title}</h3>
                    <p className="m-0 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                      {reason.text}
                    </p>
                    <Link
                      href="/about"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:gap-2.5"
                    >
                      How we work
                      <i className="bi bi-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}