import type { ContactMessageInput } from "./messages";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function formatMessage(
  input: ContactMessageInput,
  siteName: string
): string {
  const lines = [
    `New website enquiry for ${siteName}`,
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : "",
    input.subject ? `Topic: ${input.subject}` : "",
    input.budget ? `Budget: ${input.budget}` : "",
    "",
    "Message:",
    input.message,
  ];
  return lines.filter((line, index) => line !== "" || index < 2).join("\n");
}

export function isWhatsAppNotificationConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_WEBHOOK_URL ||
      (process.env.CALLMEBOT_API_KEY && process.env.WHATSAPP_NOTIFY_PHONE)
  );
}

/**
 * Sends the owner a WhatsApp alert for a new contact query.
 *
 * Two options are supported:
 * 1. WHATSAPP_WEBHOOK_URL - POST a JSON payload to Zapier / Make / n8n /
 *    your own endpoint. This is the most flexible option.
 * 2. CALLMEBOT_API_KEY + WHATSAPP_NOTIFY_PHONE - quick personal WhatsApp
 *    alerts via callmebot.com.
 *
 * Failures never block the contact form: the message is already stored and
 * visible in the admin dashboard.
 */
export async function sendContactWhatsAppNotification(
  input: ContactMessageInput,
  options: { siteName: string; fallbackPhone: string }
): Promise<boolean> {
  const text = formatMessage(input, options.siteName);
  const phone =
    digitsOnly(process.env.WHATSAPP_NOTIFY_PHONE ?? "") ||
    digitsOnly(options.fallbackPhone);

  try {
    if (process.env.WHATSAPP_WEBHOOK_URL) {
      const res = await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact_message",
          siteName: options.siteName,
          to: phone,
          text,
          message: input,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        console.error(
          "[whatsapp] Webhook notification failed:",
          res.status,
          res.statusText
        );
        return false;
      }
      return true;
    }

    const apiKey = process.env.CALLMEBOT_API_KEY;
    if (apiKey && phone) {
      const url = new URL("https://api.callmebot.com/whatsapp.php");
      url.searchParams.set("phone", phone);
      url.searchParams.set("text", text);
      url.searchParams.set("apikey", apiKey);

      const res = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        console.error(
          "[whatsapp] CallMeBot notification failed:",
          res.status,
          res.statusText
        );
        return false;
      }
      return true;
    }

    console.warn(
      "[whatsapp] Notification skipped: set WHATSAPP_WEBHOOK_URL or " +
        "CALLMEBOT_API_KEY + WHATSAPP_NOTIFY_PHONE in .env.local."
    );
    return false;
  } catch (err) {
    console.error("[whatsapp] Notification failed:", err);
    return false;
  }
}
