"use client";

import { useState } from "react";
import { Save } from "lucide-react";

interface Props {
  settings: any;
}

export function SettingsForm({ settings }: Props) {
  const [form, setForm] = useState({
    siteName: settings?.siteName || "OpenBlog",
    siteDesc: settings?.siteDesc || "",
    siteUrl: settings?.siteUrl || "http://localhost:3000",
    accentColor: settings?.accentColor || "#e85d04",
    allowComments: settings?.allowComments ?? true,
    requireCommentApproval: settings?.requireCommentApproval ?? true,
    postsPerPage: settings?.postsPerPage || 10,
    footerText: settings?.footerText || "",
    socialTwitter: settings?.socialTwitter || "",
    socialGithub: settings?.socialGithub || "",
    socialLinkedin: settings?.socialLinkedin || "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-white p-6 space-y-4">
          <h2 className="font-medium text-sm border-b border-[var(--border)] pb-3">General</h2>
          <div>
            <label className="label">Site Name</label>
            <input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} className="input" required />
          </div>
          <div>
            <label className="label">Site Description</label>
            <textarea value={form.siteDesc} onChange={(e) => set("siteDesc", e.target.value)} className="input resize-none" rows={3} />
          </div>
          <div>
            <label className="label">Site URL</label>
            <input value={form.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} className="input" type="url" />
          </div>
          <div>
            <label className="label">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-10 w-16 cursor-pointer rounded border border-[var(--border)]" />
              <input value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="input flex-1" />
            </div>
          </div>
          <div>
            <label className="label">Footer Text</label>
            <input value={form.footerText} onChange={(e) => set("footerText", e.target.value)} className="input" placeholder="© 2024 OpenBlog..." />
          </div>
          <div>
            <label className="label">Posts Per Page</label>
            <input type="number" value={form.postsPerPage} onChange={(e) => set("postsPerPage", parseInt(e.target.value))} className="input" min={1} max={50} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-white p-6 space-y-4">
            <h2 className="font-medium text-sm border-b border-[var(--border)] pb-3">Comments</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.allowComments} onChange={(e) => set("allowComments", e.target.checked)} className="accent-accent" />
              <div>
                <p className="text-sm font-medium">Allow Comments</p>
                <p className="text-xs text-ink-subtle">Enable comments on blog posts</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.requireCommentApproval} onChange={(e) => set("requireCommentApproval", e.target.checked)} className="accent-accent" />
              <div>
                <p className="text-sm font-medium">Require Approval</p>
                <p className="text-xs text-ink-subtle">Comments must be approved before showing</p>
              </div>
            </label>
          </div>

          <div className="card bg-white p-6 space-y-4">
            <h2 className="font-medium text-sm border-b border-[var(--border)] pb-3">Social Media</h2>
            <div>
              <label className="label">Twitter Handle</label>
              <input value={form.socialTwitter} onChange={(e) => set("socialTwitter", e.target.value)} className="input" placeholder="username" />
            </div>
            <div>
              <label className="label">GitHub</label>
              <input value={form.socialGithub} onChange={(e) => set("socialGithub", e.target.value)} className="input" placeholder="username" />
            </div>
            <div>
              <label className="label">LinkedIn</label>
              <input value={form.socialLinkedin} onChange={(e) => set("socialLinkedin", e.target.value)} className="input" placeholder="username" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={15} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Settings saved!</span>}
      </div>
    </form>
  );
}
