import ProjectsManager from "@/components/admin/ProjectsManager";
import { readCollection } from "@/lib/content";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const items = (await readCollection("projects")) as Project[];
  return <ProjectsManager initialItems={items} />;
}
