import MessagesManager from "@/components/admin/MessagesManager";
import { readContactMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const items = await readContactMessages();
  return <MessagesManager initialItems={items} />;
}
