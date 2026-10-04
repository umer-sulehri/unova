import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSettings();

  return {
    title: "Admin Sign In",
    description: `Sign in to manage ${siteName} website content.`,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  };
}

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-light-bg px-4 pt-24 pb-12">
      <LoginForm />
    </section>
  );
}
