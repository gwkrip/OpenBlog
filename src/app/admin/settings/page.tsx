import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings - Admin" };

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });
  return (
    <div className="space-y-6">
      <h1 className="font-serif font-bold text-2xl">Site Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
