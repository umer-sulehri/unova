import { cache } from "react";
import { readCollection } from "./content";
import type { TeamMember } from "./types";

/**
 * Team members rendered by the About page, managed from /admin/team.
 * Cached per request and ordered by the admin-set `order` field.
 */
export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const rows = (await readCollection("team")) as TeamMember[];

  return rows
    .filter((member) => member && member.name)
    .map((member) => ({
      ...member,
      role: member.role ?? "",
      image: member.image ?? "",
      bio: member.bio ?? "",
      order: Number.isFinite(member.order)
        ? member.order
        : Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.order - b.order || a.id - b.id);
});
