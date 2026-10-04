"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sanitizeTheme, themeCssVars } from "@/lib/theme";
import type { SiteSettings } from "@/lib/types";

type SiteSettingsContextValue = {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

/**
 * Seeded on the server by the root layout so the header, footer and contact
 * blocks render admin-managed brand data in the very first HTML response.
 */
export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: SiteSettings;
  children: ReactNode;
}) {
  const [settings, setSettings] = useState(initialSettings);

  // Repaint the document whenever the theme changes, so saving in the dashboard
  // (or refreshing settings on the client) restyles the open page instantly.
  useEffect(() => {
    const root = document.documentElement;
    const vars = themeCssVars(sanitizeTheme(settings.theme));
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  }, [settings.theme]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/site/settings", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { settings?: SiteSettings };
      if (data.settings) setSettings(data.settings);
    } catch {
      // Keep the server-rendered values when the refresh fails.
    }
  }, []);

  const value = useMemo(
    () => ({ settings, setSettings, refresh }),
    [settings, refresh],
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used inside SiteSettingsProvider");
  }
  return context;
}
