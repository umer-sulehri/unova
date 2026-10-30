"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { formatAddress, telHref, whatsappHref } from "@/lib/site-shared";

export default function ContactSection() {
  const { settings } = useSiteSettings();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not send your message.");
      form.reset();
      setStatus({
        type: "success",
        text: "Message sent. We will get back to you within one business day.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not send your message. Please try WhatsApp instead.",
      });
    } finally {
      setSending(false);
    }
  };

  const infoItems = [
    {
      icon: "bi-geo-alt",
      title: "Office Address",
      text: formatAddress(settings),
      href:
        settings.mapUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          formatAddress(settings)
        )}`,
      external: true,
      delay: 300,
    },
    {
      icon: "bi-telephone",
      title: "Phone",
      text: settings.phone,
      href: telHref(settings.phone),
      external: false,
      delay: 400,
    },
    {
      icon: "bi-envelope",
      title: "Email",
      text: settings.email,
      href: `mailto:${settings.email}`,
      external: false,
      delay: 500,
    },
  ].filter((item) => item.text);

  return (
    <section id="contact" className="section bg-light-bg">
      {/* Section Title */}
      <div className="bt-container relative pb-[60px]" data-aos="fade-up">
        <h2 className="relative mb-5 pb-5 text-center text-[32px] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:block after:h-[3px] after:w-[50px] after:bg-accent">
          Contact
        </h2>
        <p className="mb-6 text-center">
          Have a project in mind or just want to say hello? Reach out to us
          &mdash; we&rsquo;re always happy to connect.
        </p>
        <div className="flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-2.5 font-medium text-accent transition duration-300 hover:bg-accent hover:text-white"
          >
            <i className="bi bi-grid"></i>
            Open the full contact page
          </Link>
        </div>
      </div>

      <div className="bt-container" data-aos="fade-up" data-aos-delay="100">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-5">
            <div
              className="h-full rounded-2xl bg-accent p-12 text-white max-lg:p-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="mb-4 text-[2rem] leading-[1.2] text-white max-md:text-[1.75rem]">
                Contact Information
              </h3>
              <p className="mb-8 opacity-80">
                We&rsquo;re here to help. Connect with us via phone, email, or
                visit our office &mdash; let&rsquo;s build something amazing
                together.
              </p>

              {whatsappHref(settings) && (
                <a
                  href={whatsappHref(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-8 flex items-center gap-4 rounded-2xl bg-white p-4 text-[#128c4b] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-0.5"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-2xl text-white">
                    <i className="bi bi-whatsapp"></i>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-[#128c4b]/70">
                      WhatsApp {settings.contactName}
                    </span>
                    <span className="block text-lg font-bold text-[#128c4b]">
                      {settings.contactName}
                    </span>
                    <span className="block text-sm font-semibold text-[rgba(33,37,41,0.7)]">
                      {settings.phone || settings.whatsapp}
                    </span>
                  </span>
                  <i className="bi bi-arrow-up-right ml-auto text-lg"></i>
                </a>
              )}

              {infoItems.map((item) => (
                <div
                  key={item.title}
                  className={`group flex gap-6 ${item.delay === 500 ? "mb-0" : "mb-8"}`}
                  data-aos="fade-up"
                  data-aos-delay={item.delay}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 transition duration-300 group-hover:bg-white/30">
                    <i className={`bi ${item.icon} text-2xl text-white`}></i>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mb-1 text-[0.95rem] last:mb-0">
                      <a
                        href={item.href}
                        {...(item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="transition hover:underline"
                      >
                        {item.text}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div
              className="h-full rounded-2xl bg-white p-12 shadow-[0_0_25px_rgba(0,0,0,0.05)] max-lg:p-6"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h3 className="mb-4 text-[2rem] leading-[1.2] max-md:text-[1.75rem]">
                Get In Touch
              </h3>
              <p className="mb-8 text-[rgba(33,37,41,0.75)]">
                Have a question, idea, or opportunity? Fill out the form below
                and we&rsquo;ll get back to you as soon as possible.
              </p>

              <form onSubmit={submit}>
                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  <div>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your Name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Your Email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Phone / WhatsApp"
                      autoComplete="tel"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="Subject"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <textarea
                      name="message"
                      rows={6}
                      className="form-control"
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>

                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  {status && (
                    <p
                      role="status"
                      className={`mb-0 rounded-xl px-4 py-3 text-sm md:col-span-2 ${
                        status.type === "success"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <i
                        className={`bi ${
                          status.type === "success"
                            ? "bi-check-circle"
                            : "bi-exclamation-triangle"
                        } mr-2`}
                      ></i>
                      {status.text}
                    </p>
                  )}

                  <div className="text-center md:col-span-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center gap-2 rounded-[2rem] border-0 bg-accent px-8 py-4 text-base text-white transition duration-300 hover:bg-[#3d9cfd] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <i className={`bi ${sending ? "bi-hourglass-split" : "bi-send-fill"}`}></i>
                      {sending ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
