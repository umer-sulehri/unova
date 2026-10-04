import SettingsManager from "@/components/admin/SettingsManager";
import { getSiteSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsManager initialSettings={settings} />;
}
