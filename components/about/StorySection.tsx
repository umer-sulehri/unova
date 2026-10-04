import { getSiteSettings } from "@/lib/site";

const milestones = [
  {
    year: "2020",
    title: "The first desk",
    text: "Two designers and a developer working from a shared room in Lahore, taking on projects for local businesses that needed better than a template.",
  },
  {
    year: "2022",
    title: "Social media joins the roster",
    text: "Clients kept asking who would run the accounts after launch. We built an in-house team so design and content finally spoke the same language.",
  },
  {
    year: "2024",
    title: "Custom CMS work",
    text: "We started shipping content systems our clients can actually run — no developer needed for every small update.",
  },
  {
    year: "2026",
    title: "A full-service studio",
    text: "Design, development, marketing, and brand identity under one roof, with a process that keeps every project on schedule.",
  },
];

const principles = [
  {
    icon: "bi-lightbulb-fill",
    title: "Ideas first",
    text: "No template shortcuts. Every project starts with a concept worth building.",
  },
  {
    icon: "bi-check2-circle",
    title: "Ship what we said",
    text: "Scope, timeline, and price agreed up front. No surprise invoices later.",
  },
  {
    icon: "bi-people",
    title: "One point of contact",
    text: "You talk to the people doing the work, not an account manager relaying messages.",
  },
];

export default async function StorySection() {
  const { siteName } = await getSiteSettings();

  return (
    <section id="story" className="section bg-light-bg">
      <div className="bt-container">
        <div className="grid gap-x-6 gap-y-10 lg:grid-cols-2">
          <div data-aos="fade-up">
            <span className="mb-4 inline-block font-semibold text-accent">
              OUR STORY
            </span>
            <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] lg:text-[1.75rem]">
              Built one good project at a time
            </h2>
            <p className="mb-4 text-[16px] leading-[1.7] text-[rgba(33,37,41,0.75)]">
              We didn&rsquo;t set out to build an agency. It grew out of a habit:
              finish the work properly, then go build the next thing well. Clients
              kept coming back for bigger scopes, and the team grew to match.
            </p>
            <p className="mb-6 text-[16px] leading-[1.7] text-[rgba(33,37,41,0.75)]">
              Today {siteName} handles the full lifecycle of a brand online —
              identity, website, content, and the marketing that gives it a
              pulse.
            </p>

            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/illustration-1.webp"
                alt={`${siteName} studio collaboration`}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <ol className="relative m-0 list-none border-l-2 border-accent/[.15] p-0 pl-8">
              {milestones.map((milestone) => (
                <li key={milestone.year} className="relative mb-8 last:mb-0">
                  <span className="absolute top-1 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-accent"></span>
                  <span className="mb-1 inline-block rounded-full bg-accent/[.08] px-3 py-1 text-xs font-semibold text-accent">
                    {milestone.year}
                  </span>
                  <h3 className="mb-1 text-xl font-bold">{milestone.title}</h3>
                  <p className="m-0 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                    {milestone.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div
          className="mt-14 grid gap-6 md:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl bg-white p-7 shadow-[0_5px_20px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/[.08]">
                <i className={`bi ${principle.icon} text-xl text-accent`}></i>
              </div>
              <h3 className="mb-2 text-lg font-bold">{principle.title}</h3>
              <p className="m-0 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                {principle.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}