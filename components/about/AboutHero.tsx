import Link from "next/link";
import { getSiteSettings } from "@/lib/site";

const pillars = [
  {
    icon: "bi-palette",
    title: "Design",
    text: "Interfaces and identities built around real user behaviour, not guesswork.",
  },
  {
    icon: "bi-code-slash",
    title: "Technology",
    text: "Modern, maintainable builds that stay fast long after launch day.",
  },
  {
    icon: "bi-megaphone",
    title: "Marketing",
    text: "Campaigns and content that move the numbers that matter to you.",
  },
];

export default async function AboutHero() {
  const { siteName } = await getSiteSettings();

  return (
    <section
      id="about-hero"
      className="section relative"
      style={{
        paddingTop: "160px",
        background:
          "linear-gradient(135deg, rgba(13,131,253,0.06) 50%, rgba(13,131,253,0.02) 25%, transparent 50%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(13,131,253,0.1), transparent 45%)",
        }}
      ></div>

      <div className="bt-container relative z-[1]">
        <nav aria-label="breadcrumb" className="mb-6" data-aos="fade-up">
          <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm text-[rgba(33,37,41,0.6)]">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <i className="bi bi-chevron-right text-xs"></i>
            </li>
            <li className="font-medium text-accent">About</li>
          </ol>
        </nav>

        <div className="grid items-center gap-y-10 lg:grid-cols-2">
          <div data-aos="fade-up" data-aos-delay="100">
            <span className="mb-4 inline-flex items-center rounded-full bg-accent/[.08] px-4 py-2 font-medium text-accent">
              <i className="bi bi-building mr-2 text-xl"></i>
              An independent digital agency
            </span>

            <h1 className="mb-4 text-[2rem] font-bold leading-[1.2] sm:text-[2.5rem] lg:text-[3rem]">
              The team behind the <span className="text-accent">work</span>
            </h1>

            <p className="mb-6 text-[17px] leading-[1.7] text-[rgba(33,37,41,0.75)]">
              {siteName} is a Lahore-based creative studio founded on a simple
              belief: great brands are built when design, technology, and
              marketing sit at the same table. We bring all three in-house,
              so nothing gets lost between agencies.
            </p>

            <p className="mb-8 text-[17px] leading-[1.7] text-[rgba(33,37,41,0.75)]">
              From the first sketch to the final deploy, we work as an
              extension of your team — clear timelines, honest communication,
              and craft we refuse to compromise on.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-full border border-accent bg-accent px-8 py-3 font-medium text-white transition-all duration-300 hover:border-[var(--brand-accent-deep)] hover:bg-[var(--brand-accent-deep)]"
              >
                Explore Our Services
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-accent px-8 py-3 font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-white"
              >
                Talk to Us
              </Link>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/about-5.webp"
                  alt={`The ${siteName} team working together`}
                  className="h-auto w-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 hidden w-[220px] rounded-2xl bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.12)] animate-[experience-float_4s_ease-in-out_infinite] max-lg:static max-lg:mt-6 max-lg:w-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/[.08]">
                    <i className="bi bi-people-fill text-xl text-accent"></i>
                  </div>
                  <div>
                    <h2 className="m-0 text-lg font-bold">One Team</h2>
                    <p className="m-0 text-sm text-[rgba(33,37,41,0.6)]">
                      Design, dev &amp; marketing in-house
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-16 grid gap-6 md:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group flex items-start gap-4 rounded-2xl border border-black/[.06] bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/[.08] transition-colors duration-300 group-hover:bg-accent">
                <i
                  className={`bi ${pillar.icon} text-2xl text-accent transition-colors duration-300 group-hover:text-white`}
                ></i>
              </div>
              <div>
                <h2 className="mb-1 text-xl font-bold">{pillar.title}</h2>
                <p className="m-0 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                  {pillar.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}