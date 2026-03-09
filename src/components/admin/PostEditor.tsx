"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Wand2, X, Upload, Plus } from "lucide-react";
import { generateSlug, parseTagsInput } from "@/lib/utils";

interface Props {
  post?: any;
  categories: { id: string; name: string; slug: string; color: string }[];
}

export function PostEditor({ post, categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAI, setShowAI] = useState(false);

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    featured: post?.featured || false,
    metaTitle: post?.metaTitle || "",
    metaDesc: post?.metaDesc || "",
    categoryIds: post?.categories?.map((c: any) => c.id) || [],
    tags: post?.tags?.map((t: any) => t.name).join(", ") || "",
  });

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (!post) set("slug", generateSlug(title));
  };

  const toggleCategory = (id: string) => {
    set(
      "categoryIds",
      form.categoryIds.includes(id)
        ? form.categoryIds.filter((c: string) => c !== id)
        : [...form.categoryIds, id]
    );
  };

  const handleSave = async (published?: boolean) => {
    setSaving(true);
    const payload = {
      ...form,
      published: published ?? form.published,
      tags: parseTagsInput(form.tags),
    };
    const url = post ? `/api/posts/${post.id}` : "/api/posts";
    const method = post ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/edit/${data.id}`);
      router.refresh();
    }
    setSaving(false);
  };

  const handleAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: aiPrompt, title: form.title, context: "blog_post" }),
    });
    if (res.ok) {
      const { content, title, excerpt, tags } = await res.json();
      if (content) set("content", (form.content ? form.content + "\n\n" : "") + content);
      if (title && !form.title) handleTitleChange(title);
      if (excerpt && !form.excerpt) set("excerpt", excerpt);
      if (tags && !form.tags) set("tags", tags);
    }
    setAiLoading(false);
    setShowAI(false);
    setAiPrompt("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif font-bold text-2xl">{post ? "Edit Post" : "New Post"}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAI(!showAI)} className="btn-ghost text-sm">
            <Wand2 size={15} className="text-accent" />
            AI Assist
          </button>
          {post?.slug && (
            <a href={`/blog/${post.slug}`} target="_blank" className="btn-ghost text-sm">
              <Eye size={15} />
              Preview
            </a>
          )}
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline text-sm">
            <Save size={15} />
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary text-sm">
            {saving ? "Saving..." : form.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {showAI && (
        <div className="card bg-white p-5 border-l-4 border-accent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wand2 size={15} className="text-accent" />
              <span className="font-medium text-sm">AI Writing Assistant</span>
            </div>
            <button onClick={() => setShowAI(false)} className="text-ink-subtle hover:text-ink">
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g: Write an introduction about React Server Components..."
              className="input flex-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAI()}
            />
            <button onClick={handleAI} disabled={aiLoading} className="btn-primary text-sm">
              {aiLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card bg-white p-5">
            <div className="mb-4">
              <label className="label">Title *</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title..."
                className="input text-lg font-serif"
              />
            </div>
            <div>
              <label className="label">Slug</label>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="input text-sm font-mono" />
            </div>
          </div>

          <div className="card bg-white p-5">
            <label className="label">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Brief description shown in listings..."
              className="input resize-none"
              rows={3}
            />
          </div>

          <div className="card bg-white p-5">
            <label className="label">Content (Markdown)</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write your post in Markdown..."
              className="input resize-none font-mono text-sm"
              rows={24}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="card bg-white p-5">
            <h3 className="font-medium text-sm mb-4">Publish Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="accent-accent" />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-accent" />
                <span className="text-sm">Featured Post</span>
              </label>
            </div>
          </div>

          <div className="card bg-white p-5">
            <label className="label">Cover Image URL</label>
            <input
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://..."
              className="input text-sm"
            />
            {form.coverImage && (
              <img src={form.coverImage} alt="Preview" className="w-full h-32 object-cover rounded-sm mt-3" />
            )}
          </div>

          <div className="card bg-white p-5">
            <label className="label">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`badge text-xs transition-colors ${
                    form.categoryIds.includes(cat.id)
                      ? "text-white"
                      : "bg-paper-warm text-ink-muted"
                  }`}
                  style={form.categoryIds.includes(cat.id) ? { backgroundColor: cat.color } : {}}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-white p-5">
            <label className="label">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="nextjs, react, tutorial"
              className="input text-sm"
            />
          </div>

          <div className="card bg-white p-5 space-y-3">
            <h3 className="font-medium text-sm">SEO</h3>
            <div>
              <label className="label">Meta Title</label>
              <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder={form.title} className="input text-sm" />
            </div>
            <div>
              <label className="label">Meta Description</label>
              <textarea value={form.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} placeholder={form.excerpt} className="input text-sm resize-none" rows={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
