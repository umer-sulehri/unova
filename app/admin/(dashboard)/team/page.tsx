import TeamManager from "@/components/admin/TeamManager";
import { readCollection } from "@/lib/content";
import { getSiteSettings } from "@/lib/site";
import type { TeamMember } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const [items, settings] = await Promise.all([
    readCollection("team") as Promise<TeamMember[]>,
    getSiteSettings(),
  ]);
  return (
    <TeamManager
      initialItems={items}
      initialVisible={settings.showTeamSection}
    />
  );
}
