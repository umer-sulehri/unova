import ServicesManager from "@/components/admin/ServicesManager";
import { readCollection } from "@/lib/content";
import type { Project, Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const [services, projects] = await Promise.all([
    readCollection("services") as Promise<Service[]>,
    readCollection("projects") as Promise<Project[]>,
  ]);
  return <ServicesManager initialItems={services} projects={projects} />;
}
