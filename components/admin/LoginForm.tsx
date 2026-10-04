"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function LoginForm() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Login failed.");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-2xl text-white shadow-[0_10px_30px_rgba(13,131,253,0.35)]">
          <i className="bi bi-grid-1x2-fill"></i>
        </span>
        <h1 className="mb-1 text-2xl font-bold text-heading">
          {settings.siteName} Admin
        </h1>
        <p className="mb-0 text-sm text-[rgba(33,37,41,0.6)]">
          Sign in to manage your website content.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-2xl border border-black/[.08] bg-white p-7 shadow-[0_16px_45px_rgba(0,0,0,0.08)]"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-heading">
            Password
          </span>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full rounded-lg border border-[rgba(33,37,41,0.2)] bg-white py-3 pr-11 pl-11 text-sm transition focus:border-accent focus:shadow-[0_0_0_3px_rgba(13,131,253,0.15)] focus:outline-none"
            />
            <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(33,37,41,0.4)]"></i>
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[rgba(33,37,41,0.45)] transition hover:text-accent"
            >
              <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>
        </label>

        {error && (
          <p className="mt-4 mb-0 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            <i className="bi bi-exclamation-triangle mt-[2px]"></i>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(13,131,253,0.3)] transition hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" aria-hidden="true"></span>
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="mb-0 mt-4 text-center text-xs text-[rgba(33,37,41,0.45)]">
          Password is set via <code>ADMIN_PASSWORD</code> in .env.local
        </p>
      </form>
    </div>
  );
}