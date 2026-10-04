"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 120, suffix: "+", label: "Projects Delivered" },
  { value: 80, suffix: "+", label: "Happy Clients" },
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 99, suffix: "%", label: "Client Retention" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;

        const duration = 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  return (
    <section className="relative bg-accent py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4), transparent 45%)",
        }}
      ></div>

      <div className="bt-container relative z-[1]">
        <div className="grid gap-y-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h2 className="mb-1 text-[2.75rem] font-bold leading-none text-white">
                <Counter value={stat.value} suffix={stat.suffix} />
              </h2>
              <p className="m-0 text-[15px] text-white/85">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}