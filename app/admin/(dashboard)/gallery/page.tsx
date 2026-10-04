import GalleryManager from "@/components/admin/GalleryManager";
import { readCollection } from "@/lib/content";
import type { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = (await readCollection("gallery")) as GalleryItem[];
  return <GalleryManager initialItems={items} />;
}
