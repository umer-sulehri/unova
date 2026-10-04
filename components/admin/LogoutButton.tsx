"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-red-500/20 hover:text-white disabled:opacity-50"
    >
      <i className="bi bi-box-arrow-right text-base"></i>
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}