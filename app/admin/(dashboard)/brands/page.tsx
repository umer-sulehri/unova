import BrandsManager from "@/components/admin/BrandsManager";
import { readCollection } from "@/lib/content";
import type { Brand } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const items = (await readCollection("brands")) as Brand[];
  return <BrandsManager initialItems={items} />;
}
