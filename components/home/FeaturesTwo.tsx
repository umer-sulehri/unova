const leftFeatures = [
  {
    icon: "bi-display",
    title: "Accessible on All Devices",
    text: "Our platform works flawlessly across desktops, tablets, and mobile devices to ensure a smooth experience anywhere, anytime.",
    delay: 200,
    last: false,
  },
  {
    icon: "bi-feather",
    title: "Modern Icon Design",
    text: "We use elegant and lightweight icons that enhance visual appeal while keeping the interface clean and user-friendly.",
    delay: 300,
    last: false,
  },
  {
    icon: "bi-eye",
    title: "Retina-Ready Display",
    text: "All visual elements are optimized for high-resolution screens, ensuring sharp and vibrant visuals on any device.",
    delay: 400,
    last: true,
  },
];

const rightFeatures = [
  {
    icon: "bi-code-square",
    title: "Valid & Clean Code",
    text: "Built with modern standards, our code is structured, W3C-compliant, and easy to maintain for long-term scalability.",
    delay: 200,
    last: false,
  },
  {
    icon: "bi-phone",
    title: "Fully Responsive Layout",
    text: "The design automatically adapts to different screen sizes, providing an optimal user experience across all devices.",
    delay: 300,
    last: false,
  },
  {
    icon: "bi-browser-chrome",
    title: "Browser Compatibility",
    text: "Our website is thoroughly tested to work smoothly across all major browsers including Chrome, Firefox, Safari, and Edge.",
    delay: 400,
    last: true,
  },
];

function FeatureItem({
  icon,
  title,
  text,
  align,
}: {
  icon: string;
  title: string;
  text: string;
  align: "left" | "right";
}) {
  const iconBox = (
    <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-accent/[.08]">
      <i className={`bi ${icon} text-2xl text-accent`}></i>
    </div>
  );

  return (
    <div className={align === "right" ? "text-right" : ""}>
      <div
        className={`flex items-center gap-4 max-lg:flex-col max-lg:justify-center max-lg:text-center ${
          align === "right" ? "justify-end" : ""
        }`}
      >
        {align === "right" && (
          <>
            <div className="feature-content">
              <h3 className="mb-2.5 text-xl font-semibold">{title}</h3>
              <p className="mb-0 text-[15px] text-[rgba(33,37,41,0.75)]">
                {text}
              </p>
            </div>
            {iconBox}
          </>
        )}
        {align === "left" && (
          <>
            {iconBox}
            <div className="feature-content">
              <h3 className="mb-2.5 text-xl font-semibold">{title}</h3>
              <p className="mb-0 text-[15px] text-[rgba(33,37,41,0.75)]">
                {text}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FeaturesTwo() {
  return (
    <section id="features-2" className="section">
      <div className="bt-container" data-aos="fade-up" data-aos-delay="100">
        <div className="grid items-center gap-x-6 lg:grid-cols-3">
          {/* Left column */}
          <div>
            {leftFeatures.map((f) => (
              <div
                key={f.title}
                className={`${f.last ? "" : "mb-10"} max-lg:mb-8`}
                data-aos="fade-right"
                data-aos-delay={f.delay}
              >
                <FeatureItem {...f} align="right" />
              </div>
            ))}
          </div>

          {/* Phone mockup */}
          <div data-aos="zoom-in" data-aos-delay="200">
            <div className="relative py-[30px] text-center max-lg:my-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/unova-mobile-view.png"
                alt="Phone Mockup"
                className="mx-auto h-auto max-w-[300px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>

          {/* Right column */}
          <div>
            {rightFeatures.map((f) => (
              <div
                key={f.title}
                className={`${f.last ? "" : "mb-10"} max-lg:mb-8`}
                data-aos="fade-left"
                data-aos-delay={f.delay}
              >
                <FeatureItem {...f} align="left" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
