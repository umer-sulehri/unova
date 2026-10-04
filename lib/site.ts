import { cache } from "react";
import { readCollection } from "./content";
import { withDefaults } from "./site-shared";
import type { SiteSettings } from "./types";

// The reader stays here; every pure helper a client component needs is
// re-exported from lib/site-shared.ts so bundlers never pull Node APIs into the
// browser build.
export {
  SOCIAL_FIELDS,
  defaultSiteSettings,
  formatAddress,
  telHref,
  whatsappHref,
  withDefaults,
} from "./site-shared";

/**
 * Reads the single settings record. Cached per request so the layout, metadata
 * and every client component share one lookup.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await readCollection("site");
  const stored = (rows[0] as Partial<SiteSettings> | undefined) ?? null;
  return withDefaults(stored);
});
