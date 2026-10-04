const steps = [
  {
    icon: "bi-chat-square-text",
    title: "Discovery call",
    text: "Thirty minutes on your goals, your audience, and what success looks like. Free, and genuinely useful even if you hire someone else.",
  },
  {
    icon: "bi-pencil-square",
    title: "Scope & proposal",
    text: "A written plan with deliverables, timeline, and fixed price. You see exactly what you're paying for before anything starts.",
  },
  {
    icon: "bi-dash-lg",
    title: "Design & build",
    text: "Roughs first, polish second. Weekly previews so there are no surprises when the final deadline lands.",
  },
  {
    icon: "bi-rocket-takeoff",
    title: "Launch & support",
    text: "We ship, we monitor, and we stick around for the questions that show up a month later.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="section">
      <div className="bt-container">
        <div className="mb-14 text-center" data-aos="fade-up">
          <span className="mb-3 inline-block font-semibold text-accent">
            HOW WE WORK
          </span>
          <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] lg:text-[1.75rem]">
            Four steps, no mystery
          </h2>
          <p className="mx-auto mb-0 max-w-[640px] text-[16px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
            The same process for a logo as for a full website build. You always
            know which step you&rsquo;re on and what happens next.
          </p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[38px] hidden border-t-2 border-dashed border-accent/20 lg:block"
            aria-hidden="true"
          ></div>

          <div className="grid gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className="relative text-center lg:text-left"
              >
                <div className="relative z-[1] mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-white shadow-[0_8px_25px_rgba(13,131,253,0.15)] lg:mx-0">
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <i className={`bi ${step.icon} text-2xl text-accent`}></i>
                </div>

                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="m-0 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}