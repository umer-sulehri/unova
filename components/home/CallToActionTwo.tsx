import Link from "next/link";

const highlights = [
  { value: "48h", label: "Typical reply time" },
  { value: "120+", label: "Projects delivered" },
  { value: "99%", label: "Client retention" },
];

export default function CallToActionTwo() {
  return (
    <section id="call-to-action-2" className="relative overflow-hidden bg-accent py-20">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute -top-24 -right-16 h-[320px] w-[320px] rounded-full border-[40px] border-white/[.07]"></span>
        <span className="absolute -bottom-28 -left-20 h-[280px] w-[280px] rounded-full bg-white/[.04]"></span>
        <span className="absolute top-[18%] left-[8%] h-[120px] w-[120px] rounded-full bg-white/[.04]"></span>
        <span className="absolute right-[14%] bottom-[12%] h-[70px] w-[70px] rounded-full border-[14px] border-white/[.07]"></span>
      </div>

      <div className="bt-container relative z-[3]">
        <div className="text-center" data-aos="zoom-in" data-aos-delay="100">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
            <i className="bi bi-lightning-charge-fill"></i>
            Free 30-minute discovery call
          </span>

          <h2 className="mx-auto mb-4 max-w-[760px] text-[2.25rem] font-bold leading-[1.2] text-white lg:text-[2.5rem]">
            Ready to take the next step?
          </h2>

          <p className="mx-auto mb-8 max-w-[620px] text-[17px] leading-[1.7] text-white/85">
            Join countless others who are making smarter moves with our
            solutions. Whether you&rsquo;re starting out or scaling up, we&rsquo;re
            here to support your journey to success.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-3.5 font-heading text-base font-semibold text-accent shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
            >
              Get Started Now
              <i className="bi bi-arrow-right"></i>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-9 py-3.5 font-heading text-base font-medium text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              See our work
            </Link>
          </div>
        </div>

        <div
          className="mx-auto mt-14 grid max-w-[720px] gap-4 sm:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-2xl bg-white/10 px-5 py-6 text-center backdrop-blur-sm"
            >
              <h3 className="mb-1 text-[2rem] font-bold leading-none text-white">
                {h.value}
              </h3>
              <p className="m-0 text-sm text-white/80">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}