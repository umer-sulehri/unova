const testimonials = [
  {
    name: "Fasil Javeed",
    role: "CEO, Renkli Paints",
    quote:
      "The team was incredibly professional and delivered high-quality results on time. I couldn’t be more satisfied with their work ethic and attention to detail.",
    avatar: "/img/avatar-1.webp",
  },
  {
    name: "Zia Asad",
    role: "CEO, Moon Grill Resturant",
    quote:
      "I was impressed by their creative approach and dedication to the project. They truly understood our brand vision and delivered exactly what we needed.",
    avatar: "/img/avatar-5.webp",
  },
  {
    name: "Hamza Tariq",
    role: "Founder, CV Toolscase",
    quote:
      "From the first call to launch they were transparent about timelines and tradeoffs. The product shipped fast and it still performs well a year later.",
    avatar: "/img/avatar-2.webp",
  },
  {
    name: "Ayesha Noor",
    role: "Marketing Lead, Unique Hair",
    quote:
      "Our bookings doubled within two months of the new site going live. They handled design, development and our social media — all under one roof.",
    avatar: "/img/avatar-4.webp",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section bg-light-bg">
      <div className="bt-container relative pb-[60px]" data-aos="fade-up">
        <span className="mb-3 inline-block font-semibold text-accent">
          CLIENT STORIES
        </span>
        <h2 className="relative mb-5 pb-5 text-center text-[32px] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent">
          What Our Clients Say
        </h2>
        <p className="mx-auto mb-0 max-w-[620px] text-center">
          We take pride in our commitment to excellence. Here&rsquo;s what some of
          our clients have to say about working with us.
        </p>
      </div>

      <div className="bt-container">
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((t, idx) => (
            <div
              key={t.name}
              data-aos="fade-up"
              data-aos-delay={(idx % 2) * 150}
              className="group relative h-full overflow-hidden rounded-2xl bg-white p-8 shadow-[0_4px_18px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            >
              <i className="bi bi-quote absolute top-4 right-6 text-[64px] leading-none text-accent/[.08] transition-transform duration-500 group-hover:scale-110"></i>

              <div className="relative">
                <div className="mb-5 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <i
                      key={n}
                      className="bi bi-star-fill text-sm"
                      style={{ color: "#ffc107" }}
                    ></i>
                  ))}
                </div>

                <p className="relative mb-6 text-[16px] leading-[1.8] text-[rgba(33,37,41,0.8)] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 border-t border-black/[.06] pt-5">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span>
                    <span className="block text-base font-bold">{t.name}</span>
                    <span className="block text-sm text-accent">{t.role}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}