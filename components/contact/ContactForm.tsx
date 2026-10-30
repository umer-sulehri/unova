"use client";

import { useState, type FormEvent } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { telHref, whatsappHref } from "@/lib/site-shared";

const inputClass =
  "form-control !rounded-xl !border-[rgba(33,37,41,0.14)] !bg-[#fbfcfd] !px-4 !py-3 text-[15px] transition focus:!border-[var(--brand-accent-deep)] focus:!bg-white";

const labelClass =
  "mb-2 block text-[13px] font-semibold text-[rgba(33,37,41,0.75)]";

const topics = [
  "New project enquiry",
  "UI/UX design",
  "Web development",
  "Graphic design",
  "SEO",
  "Social media management",
  "Custom CMS",
  "Something else",
];

const budgets = [
  "Not sure yet",
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000+",
  "Retainer / ongoing",
];

type Status = { type: "success" | "error"; text: string } | null;

export default function ContactForm() {
  const { settings } = useSiteSettings();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

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
        text: "Thanks! Your message has been received. We will reply within one business day.",
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

  return (
    <div
      id="contact-form"
      className="h-full scroll-mt-32 rounded-3xl border border-black/[.06] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.07)] lg:p-10"
      data-aos="fade-up"
      data-aos-delay="300"
    >
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="mb-2 text-[1.75rem] font-bold leading-[1.2] max-md:text-[1.5rem]">
            Get In Touch
          </h2>
          <p className="m-0 max-w-[420px] text-[15px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
            Tell us about the project and we&rsquo;ll reply within one business
            day with next steps.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#198754]/[.08] px-3.5 py-2 text-xs font-semibold text-[#198754]">
          <i className="bi bi-lightning-charge-fill"></i>
          1-day response
        </span>
      </div>

      <form onSubmit={submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Your name <span className="text-[var(--brand-accent-deep)]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              className={inputClass}
              placeholder="Jane Cooper"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email address <span className="text-[var(--brand-accent-deep)]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              className={inputClass}
              placeholder="jane@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone / WhatsApp
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              className={inputClass}
              placeholder="+92 300 0000000"
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="contact-topic" className={labelClass}>
              What do you need?
            </label>
            <select
              id="contact-topic"
              name="subject"
              className={`${inputClass} cursor-pointer`}
              defaultValue={topics[0]}
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="contact-budget" className={labelClass}>
              Budget range
            </label>
            <select
              id="contact-budget"
              name="budget"
              className={`${inputClass} cursor-pointer`}
              defaultValue={budgets[0]}
            >
              {budgets.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="contact-message" className={labelClass}>
              Project details <span className="text-[var(--brand-accent-deep)]">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              className={`${inputClass} resize-y`}
              placeholder="What are you building, who is it for, and when do you need it live?"
              required
            ></textarea>
          </div>

          {/* Honeypot: real people never fill this in. */}
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
              className={`mb-0 flex items-start gap-2 rounded-xl px-4 py-3 text-sm sm:col-span-2 ${
                status.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <i
                className={`bi ${
                  status.type === "success"
                    ? "bi-check-circle"
                    : "bi-exclamation-triangle"
                } mt-[2px]`}
              ></i>
              {status.text}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button
              type="submit"
              disabled={sending}
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-medium text-white shadow-[0_10px_25px_color-mix(in_srgb,var(--brand-accent)_35%,transparent)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--brand-accent) 0%, var(--brand-accent-deep) 100%)" }}
            >
              <i className={`bi ${sending ? "bi-hourglass-split" : "bi-send-fill"}`}></i>
              {sending ? "Sending…" : "Send Message"}
              <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
            </button>
            <span className="inline-flex items-center gap-2 text-sm text-[rgba(33,37,41,0.7)]">
              <i className="bi bi-shield-check text-[#198754]"></i>
              Your details stay private.
            </span>
          </div>
        </div>
      </form>

      {(settings.phone || whatsappHref(settings)) && (
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-black/[.07] pt-6 text-sm">
          <span className="font-semibold text-heading">Prefer to chat?</span>
          {settings.phone && (
            <a
              href={telHref(settings.phone)}
              className="inline-flex items-center gap-2 text-[rgba(33,37,41,0.7)] transition hover:text-[var(--brand-accent-deep)]"
            >
              <i className="bi bi-telephone-fill text-accent"></i>
              {settings.phone}
            </a>
          )}
          {whatsappHref(settings) && (
            <a
              href={whatsappHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[rgba(33,37,41,0.7)] transition hover:text-[#128c4b]"
            >
              <i className="bi bi-whatsapp text-[#25d366]"></i>
              WhatsApp {settings.contactName}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
