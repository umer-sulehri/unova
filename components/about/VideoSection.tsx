"use client";

import { useRef, useState } from "react";
import { SHOWREEL_POSTER, SHOWREEL_SRC } from "@/lib/seo";

const chapters = [
  { time: "00:00", label: "Who we are" },
  { time: "01:15", label: "How we work" },
  { time: "02:30", label: "Recent work" },
];

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    if (video.paused) {
      video.play();
      setPlaying(true);
    }
  };

  return (
    <section id="showreel" className="section">
      <div className="bt-container relative pb-[60px] text-center" data-aos="fade-up">
        <h2 className="relative mb-5 pb-5 text-[32px] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent">
          Watch Our Showreel
        </h2>
        <p className="mx-auto mb-0 max-w-[640px]">
          Four minutes on how we think, what we make, and the kind of results
          we chase for every client.
        </p>
      </div>

      <div className="bt-container" data-aos="fade-up" data-aos-delay="100">
        <div className="relative overflow-hidden rounded-2xl bg-default shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
          <video
            ref={videoRef}
            className="block aspect-video w-full bg-black object-cover"
            poster={SHOWREEL_POSTER}
            preload="none"
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          >
            <source src={SHOWREEL_SRC} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {!playing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play showreel"
              className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors duration-300 hover:bg-black/25"
            >
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_rgba(13,131,253,0.5)] transition-transform duration-300 hover:scale-110">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/40"></span>
                <i className="bi bi-play-fill relative text-4xl leading-none"></i>
              </span>
            </button>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-5">
            <div className="flex flex-wrap gap-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.time}
                  type="button"
                  onClick={() => seek(parseFloat(chapter.time.split(":")[0]) * 60 + parseFloat(chapter.time.split(":")[1]))}
                  className="pointer-events-auto rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors duration-300 hover:bg-accent"
                >
                  {chapter.time} &middot; {chapter.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors duration-300 hover:bg-accent"
            >
              <i className={`bi ${muted ? "bi-volume-mute" : "bi-volume-up"} text-lg`}></i>
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "bi-camera-reels",
              title: "Real Work",
              text: "Footage and screens pulled from live client projects.",
            },
            {
              icon: "bi-mic",
              title: "Straight Talk",
              text: "How we scope, price, and run a project end to end.",
            },
            {
              icon: "bi-clock-history",
              title: "90 Seconds",
              text: "Short enough for a coffee break, useful enough to act on.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl bg-light-bg p-5"
            >
              <i className={`bi ${item.icon} mt-1 text-xl text-accent`}></i>
              <div>
                <h3 className="mb-1 text-base font-semibold">{item.title}</h3>
                <p className="m-0 text-sm text-[rgba(33,37,41,0.7)]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}