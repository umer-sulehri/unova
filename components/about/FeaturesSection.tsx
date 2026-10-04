const features = [
  {
    icon: "bi-speedometer2",
    title: "Built to be fast",
    text: "Performance budgets from day one, so pages stay quick on a 3G connection and inside a slow WordPress host.",
  },
  {
    icon: "bi-shield-check",
    title: "Secure by default",
    text: "Sanitised inputs, dependency audits, and server-side secrets — the unglamorous work nobody asks about.",
  },
  {
    icon: "bi-search",
    title: "SEO baked in",
    text: "Semantic markup, metadata, and Core Web Vitals handled as part of the build, not bolted on afterwards.",
  },
  {
    icon: "bi-phone",
    title: "Mobile first",
    text: "Most traffic is on a phone. Layouts are designed phone-side up, then widened.",
  },
  {
    icon: "bi-universal-access",
    title: "Accessible",
    text: "Keyboard paths, contrast ratios, and focus states checked before anything reaches production.",
  },
  {
    icon: "bi-arrow-repeat",
    title: "Easy to update",
    text: "CMS setups and clear documentation, so you can change copy months later without calling us.",
  },
];

const images = [
  { src: "/img/features-illustration-1.webp", alt: "Interface design work" },
  { src: "/img/features-illustration-2.webp", alt: "Web application build" },
  { src: "/img/features-illustration-3.webp", alt: "Marketing dashboards" },
];

export default function FeaturesSection() {
  return (
    <section id="about-features" className="section bg-light-bg">
      <div className="bt-container">
        <div className="mb-14 text-center" data-aos="fade-up">
          <span className="mb-3 inline-block font-semibold text-accent">
            THE DETAILS
          </span>
          <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] lg:text-[1.75rem]">
            The unglamorous work that decides everything
          </h2>
          <p className="mx-auto mb-0 max-w-[640px] text-[16px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
            Anyone can make a pretty screenshot. These are the six things we
            refuse to compromise on, on every project.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const image = images[index % images.length];
            return (
              <div
                key={feature.title}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
                className="group overflow-hidden rounded-2xl bg-white shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 shadow-[0_5px_15px_rgba(0,0,0,0.12)]">
                    <i className={`bi ${feature.icon} text-xl text-accent`}></i>
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="m-0 text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                    {feature.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}