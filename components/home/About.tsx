import { getSiteSettings } from "@/lib/site";

const featuresLeft = [
  "Creative UI/UX Design",
  "Responsive Web Development",
  "Custom Web Solutions",
];

const featuresRight = [
  "Social Media Marketing",
  "Scalable Digital Strategies",
  "Dedicated Support Team",
];

export default async function About() {
  const { siteName } = await getSiteSettings();

  return (
    <section id="about" className="section">
      <div className="bt-container" data-aos="fade-up" data-aos-delay="100">
        <div className="grid items-center justify-between gap-y-6 xl:grid-cols-12">
          <div className="xl:col-span-5" data-aos="fade-up" data-aos-delay="200">
            <p className="m-0">
              <span className="about-meta mb-4 inline-block font-semibold text-accent">
                MORE ABOUT US
              </span>
            </p>
            <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] lg:text-[1.75rem]">
              We Craft Digital Experiences That Drive Results
            </h2>
            <p className="mb-8 text-[rgba(33,37,41,0.8)]">
              At {siteName}, we bring together creativity, code, and strategy
              to build brands that stand out. From seamless UI/UX design to
              robust web development and result-driven social media marketing,
              we empower businesses to thrive in the digital age.
            </p>

            <div className="mb-8 grid gap-x-6 md:grid-cols-2">
              {[featuresLeft, featuresRight].map((list, idx) => (
                <ul key={idx} className="m-0 list-none p-0">
                  {list.map((item) => (
                    <li
                      key={item}
                      className="mb-4 flex items-center gap-3 text-base"
                    >
                      <i className="bi bi-check-circle-fill text-xl text-accent"></i>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <div>
              <div className="grid gap-y-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 rounded-lg bg-white p-4 px-6 shadow-[0_0_15px_rgba(0,0,0,0.06)]">
                    <i className="bi bi-telephone-fill text-2xl text-accent"></i>
                    <div>
                      <p className="m-0 text-sm text-[rgba(33,37,41,0.7)]">
                        Call us anytime
                      </p>
                      <p className="m-0 font-semibold">+92 309 4785572</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-6" data-aos="fade-up" data-aos-delay="300">
            <div className="relative max-lg:mt-12 max-lg:flex max-lg:flex-col max-lg:gap-8">
              <div
                className="relative max-lg:flex max-lg:flex-col max-lg:gap-6"
                data-aos="zoom-out"
                data-aos-delay="400"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/about-5.webp"
                  alt="Business Meeting"
                  className="max-w-full h-auto rounded-2xl"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/about-2.webp"
                  alt="Team Discussion"
                  className="absolute -left-[10%] top-[20%] w-[45%] rounded-2xl border-8 border-white max-lg:static max-lg:mx-auto max-lg:w-full max-lg:border-0"
                />
              </div>
              <div className="absolute bottom-[5%] right-[5%] min-w-[200px] animate-[experience-float_3s_ease-in-out_infinite] rounded-lg bg-accent p-6 text-center text-white max-lg:static max-lg:mx-auto max-lg:w-fit">
                <h3 className="m-0 inline-block text-[2.5rem] leading-[0.5] text-white">
                  5+ <span className="ml-1 inline-block text-base">Years</span>
                </h3>
                <p className="mt-2 mb-0 text-sm">Of experience in digital solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
