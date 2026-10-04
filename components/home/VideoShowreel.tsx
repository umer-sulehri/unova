"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const VIDEO_SRC = "/video/UNOVA__Digital_Experiences.mp4";
const POSTER_SRC = "/img/showreel-poster.jpg";
/** Runtime of the film in seconds, shown in the player caption. */
const VIDEO_LENGTH = "4 minutes";

const highlights = [
  {
    icon: "bi-palette",
    title: "Brand & UI design",
    text: "Identity systems and interfaces built to be remembered.",
  },
  {
    icon: "bi-code-slash",
    title: "Web development",
    text: "Fast, responsive builds that ship clean and rank well.",
  },
  {
    icon: "bi-graph-up-arrow",
    title: "Marketing & SEO",
    text: "Campaigns and content that pull in real enquiries.",
  },
];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function VideoShowreel() {
  const { settings } = useSiteSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Keep the element's mute flag in sync without restarting playback.
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  // `preload="none"` keeps the ~19 MB file untouched until this runs inside a
  // real click, so the film only downloads for visitors who press play.
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = wrapRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      node.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = (value / 100) * duration;
    setProgress(value);
  };

  return (
    <section
      id="showreel"
      aria-labelledby="showreel-heading"
      className="section relative overflow-hidden bg-light-bg"
    >
      {/* Soft brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-accent/10 blur-[100px]"></span>
        <span className="absolute -right-24 -bottom-24 h-[300px] w-[300px] rounded-full bg-accent/[.08] blur-[100px]"></span>
      </div>

      <div className="bt-container relative z-[3]">
        {/* Section heading */}
        <div className="mb-14 text-center" data-aos="fade-up">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/[.08] px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-accent">
            <i className="bi bi-play-circle-fill"></i>
            Watch the showreel
          </span>
          <h2
            id="showreel-heading"
            className="relative mx-auto mb-0 inline-block pb-5 text-[2rem] font-bold leading-[1.2] text-heading after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent lg:text-[2.5rem]"
          >
            See how we turn ideas into{" "}
            <span className="text-accent">real products</span>
          </h2>
          <p className="mx-auto mb-0 mt-5 max-w-[640px] text-[17px] leading-[1.75] text-[rgba(33,37,41,0.7)]">
            Four minutes on the process behind our work — how we scope a
            project, design the interface, build it, and launch it. Real client
            work, no stock footage.
          </p>
        </div>

        <div className="grid items-center gap-x-12 gap-y-12 lg:grid-cols-2">
          {/* Copy */}
          <div data-aos="fade-right">
            <ul className="m-0 mb-9 list-none space-y-4 p-0">
              {highlights.map((item) => (
                <li
                  key={item.title}
                  className="group flex items-start gap-4 rounded-2xl border border-black/[.06] bg-white p-5 shadow-[0_2px_12px_rgba(13,131,253,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[0_14px_30px_rgba(13,131,253,0.12)]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/[.1] text-lg text-accent transition duration-300 group-hover:bg-accent group-hover:text-white">
                    <i className={`bi ${item.icon}`}></i>
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-heading">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[rgba(33,37,41,0.65)]">
                      {item.text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(13,131,253,0.28)] transition hover:-translate-y-0.5 hover:bg-accent/90"
              >
                Start your project
                <i className="bi bi-arrow-right"></i>
              </a>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[rgba(33,37,41,0.6)]">
                <i className="bi bi-clock text-accent"></i>
                {VIDEO_LENGTH}, no sign-up
              </span>
            </div>
          </div>

          {/* Player */}
          <div ref={wrapRef} data-aos="fade-left">
            <div className="overflow-hidden rounded-3xl border border-black/[.07] bg-white p-3 shadow-[0_24px_60px_rgba(13,131,253,0.14)]">
              <div className="relative overflow-hidden rounded-2xl bg-[#0d1526]">
                <video
                  ref={videoRef}
                  className="block aspect-video w-full object-cover"
                  poster={POSTER_SRC}
                  preload="none"
                  playsInline
                  muted={muted}
                  loop
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onCanPlay={() => setPlaying(true)}
                  onLoadedMetadata={(e) =>
                    setDuration(e.currentTarget.duration || 0)
                  }
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    if (!video.duration) return;
                    setProgress((video.currentTime / video.duration) * 100);
                  }}
                  onEnded={() => setPlaying(false)}
                >
                  <source src={VIDEO_SRC} type="video/mp4" />
                  Your browser does not support embedded video.{" "}
                  <a href={VIDEO_SRC}>Download the showreel</a>.
                </video>

                {!playing && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={`Play the ${settings.siteName} showreel`}
                    className="absolute inset-0 flex items-center justify-center bg-[#0d1526]/35 backdrop-blur-[2px] transition-colors duration-300 hover:bg-[#0d1526]/20"
                  >
                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_34px_rgba(13,131,253,0.45)] transition-transform duration-300 hover:scale-110">
                      <span className="absolute inset-0 animate-ping rounded-full bg-accent/40"></span>
                      <i className="bi bi-play-fill relative text-4xl leading-none"></i>
                    </span>
                  </button>
                )}

                {/* Live badge */}
                {playing && (
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-accent shadow-sm backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                    Now playing
                  </span>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 px-2 pt-4 pb-1">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause showreel" : "Play showreel"}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white shadow-[0_6px_16px_rgba(13,131,253,0.3)] transition hover:bg-accent/90"
                >
                  <i className={`bi ${playing ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                </button>

                <span className="shrink-0 font-mono text-xs text-[rgba(33,37,41,0.55)]">
                  {formatTime((progress / 100) * duration)} /{" "}
                  {formatTime(duration)}
                </span>

                <label className="sr-only" htmlFor="showreel-progress">
                  Seek showreel
                </label>
                <input
                  id="showreel-progress"
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={progress}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[#e6eef8] accent-accent"
                  style={{
                    background: `linear-gradient(to right, #0d83fd ${progress}%, #e6eef8 ${progress}%)`,
                  }}
                />

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute showreel" : "Mute showreel"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[.1] text-lg text-[rgba(33,37,41,0.7)] transition hover:border-accent/40 hover:bg-accent/[.06] hover:text-accent"
                >
                  <i className={`bi ${muted ? "bi-volume-mute" : "bi-volume-up"}`}></i>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Play showreel fullscreen"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[.1] text-lg text-[rgba(33,37,41,0.7)] transition hover:border-accent/40 hover:bg-accent/[.06] hover:text-accent"
                >
                  <i className="bi bi-fullscreen"></i>
                </button>
              </div>
            </div>

            <p className="mb-0 mt-4 text-center text-xs text-[rgba(33,37,41,0.5)]">
              Showreel · {VIDEO_LENGTH} · recorded on real client projects
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
