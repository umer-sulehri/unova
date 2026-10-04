import { getSiteSettings } from "@/lib/site";

const avatars = [1, 2, 3, 4, 5];

export default async function Hero() {
  const { siteName } = await getSiteSettings();

  const stats = [
    {
      icon: "bi-trophy",
      title: "Certified Experts",
      text: "Skilled in design, development & digital strategy",
    },
    {
      icon: "bi-briefcase",
      title: "50+ Projects",
      text: "Delivered across industries with creativity & precision",
    },
    {
      icon: "bi-graph-up",
      title: "99% Client Retention",
      text: "Thanks to consistent results and trusted partnerships",
    },
    {
      icon: "bi-award",
      title: "100% Satisfaction",
      text: `Clients love working with ${siteName} and keep coming back`,
    },
  ];

  return (
    <section
      id="hero"
      className="section relative"
      style={{
        background:
          "linear-gradient(135deg, rgba(13,131,253,0.05) 50%, rgba(13,131,253,0.02) 25%, transparent 50%)",
        paddingTop: "160px",
      }}
    >
      {/* ::before radial highlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 90% 10%, rgba(13,131,253,0.08), transparent 40%)",
        }}
      ></div>

      <div className="bt-container" data-aos="fade-up" data-aos-delay="100">
        <div className="grid items-center gap-x-6 lg:grid-cols-2">
          <div>
            <div
              className="relative z-[1] max-lg:mb-12 max-lg:text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="mb-4 inline-flex items-center rounded-full bg-accent/[.08] px-4 py-2 font-medium text-accent">
                <i className="bi bi-gear-fill mr-2 text-xl"></i>
                Building digital experiences that inspire
              </div>

              <h1 className="mb-4 text-[2rem] font-bold leading-[1.2] sm:text-[2.5rem] lg:text-[3.5rem]">
                Elevate Your Brand <br />
                Through Design &amp; <br />
                <span className="text-accent">Digital Innovation</span>
              </h1>

              <p className="mb-4 md:mb-10">
                At {siteName}, we blend creativity with technology to deliver
                stunning UI/UX designs, robust websites, and impactful social
                media strategies. Partner with us to unlock your brand&rsquo;s
                full digital potential.
              </p>

              <div className="flex flex-wrap">
                <a
                  href="/contact"
                  className="mx-1 rounded-full border border-accent bg-accent px-10 py-3 font-medium text-white transition-all duration-300 hover:border-[#0a69ca] hover:bg-[#0a69ca] sm:mr-2"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>

          <div>
            <div
              className="relative z-[1] text-center"
              data-aos="zoom-out"
              data-aos-delay="300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/illustration-1.webp"
                alt="Hero Image"
                className="max-w-full h-auto"
              />

              <div className="absolute bottom-[10px] right-[30px] max-w-[300px] animate-[float-badge_3s_ease-in-out_infinite] rounded-[10px] bg-white p-4 shadow-[0_5px_20px_rgba(0,0,0,0.1)] will-change-transform max-lg:static max-lg:mx-auto max-lg:mt-4 max-lg:max-w-[250px]">
                <div className="mb-2 flex items-center">
                  {avatars.map((n) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={n}
                      src={`/img/avatar-${n}.webp`}
                      alt={`Customer ${n}`}
                      className="-ml-2 h-[35px] w-[35px] rounded-full border-2 border-white first:ml-0"
                    />
                  ))}
                  <span className="-ml-2 flex h-[35px] w-[35px] items-center justify-center rounded-full border-2 border-white bg-accent text-[0.75rem] font-semibold text-white">
                    50+
                  </span>
                </div>
                <p className="mb-0 mt-2 text-sm text-[rgba(33,37,41,0.6)]">
                  200+ happy clients worldwide trust {siteName}&rsquo;s
                  creative solutions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-[1] mt-20 grid gap-y-4 rounded-[20px] bg-white pb-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] md:grid-cols-2 lg:grid-cols-4"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="group flex items-center gap-4 p-8 max-sm:p-6"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[50px] bg-accent/[.08] transition duration-300 group-hover:bg-accent">
                <i
                  className={`bi ${stat.icon} text-2xl text-accent transition group-hover:text-white`}
                ></i>
              </div>
              <div className="grow">
                <h2 className="mb-1 text-xl font-semibold">{stat.title}</h2>
                <p className="m-0 text-sm text-[rgba(33,37,41,0.6)]">
                  {stat.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
