import Link from "next/link";

export default function CtaSection() {
  return (
    <section id="about-cta" className="section">
      <div className="bt-container">
        <div
          className="relative overflow-hidden rounded-[20px] bg-accent px-8 py-14 text-center"
          data-aos="zoom-in"
        >
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute -right-16 -top-16 h-[220px] w-[220px] rounded-full border-[30px] border-white/10"></span>
            <span className="absolute -bottom-20 -left-12 h-[180px] w-[180px] rounded-full bg-white/5"></span>
            <span className="absolute right-[20%] top-[15%] h-[90px] w-[90px] rounded-full bg-white/5"></span>
          </div>

          <div className="relative z-[1] mx-auto max-w-[720px]">
            <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] text-white">
              Got a project in mind?
            </h2>
            <p className="mb-8 text-[17px] text-white/90">
              Tell us where you are and where you want to be. We&rsquo;ll reply
              within one business day with honest thoughts — even if we&rsquo;re
              not the right fit.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-full border-2 border-white bg-white px-8 py-3 font-medium text-accent transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                Start a Conversation
              </Link>
              <Link
                href="/projects"
                className="rounded-full border-2 border-white/70 px-8 py-3 font-medium text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}