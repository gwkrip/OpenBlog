"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Eye, EyeOff, Wand2, X, PenSquare, Bold, Italic,
  Heading2, Heading3, List, ListOrdered, Quote, Code, Link2,
  Image as ImageIcon, Columns, Monitor, Smartphone, CheckCircle2,
  Clock, Hash, FileText, ChevronDown, Globe, Lock, Layers
} from "lucide-react";
import { generateSlug, parseTagsInput, calculateReadingTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";

interface Props {
  post?: any;
  categories: { id: string; name: string; slug: string; color: string }[];
}

type ViewMode = "write" | "preview" | "split";
type StatusType = "idle" | "saving" | "saved" | "error";

// --- Markdown Toolbar ---
interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  prefix?: string;
  suffix?: string;
  block?: boolean;
  wrap?: string;
}

const toolbarActions: ToolbarAction[] = [
  { icon: <Bold size={14} />, label: "Bold", wrap: "**" },
  { icon: <Italic size={14} />, label: "Italic", wrap: "_" },
  { icon: <Heading2 size={14} />, label: "Heading 2", prefix: "## ", block: true },
  { icon: <Heading3 size={14} />, label: "Heading 3", prefix: "### ", block: true },
  { icon: <Quote size={14} />, label: "Blockquote", prefix: "> ", block: true },
  { icon: <Code size={14} />, label: "Inline Code", wrap: "`" },
  { icon: <List size={14} />, label: "Bullet List", prefix: "- ", block: true },
  { icon: <ListOrdered size={14} />, label: "Numbered List", prefix: "1. ", block: true },
  { icon: <Link2 size={14} />, label: "Link", prefix: "[", suffix: "](url)" },
  { icon: <ImageIcon size={14} />, label: "Image", prefix: "![alt](", suffix: ")" },
];

function MarkdownToolbar({ onAction }: { onAction: (a: ToolbarAction) => void }) {
  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--paper-warm)] flex-wrap">
      {toolbarActions.map((action, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onAction(action)}
          title={action.label}
          className="toolbar-btn"
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

// --- Simple Markdown preview renderer ---
function MarkdownPreview({ content }: { content: string }) {
  // Basic markdown to HTML transform for preview only
  const render = (text: string) => {
    if (!text) return "<p class='text-ink-faint italic'>Nothing to preview yet...</p>";
    let html = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^### (.*)/gm, '<h3 class="font-serif font-bold text-xl mt-8 mb-3 text-ink">$1</h3>')
      .replace(/^## (.*)/gm, '<h2 class="font-serif font-bold text-2xl mt-10 mb-4 text-ink">$1</h2>')
      .replace(/^# (.*)/gm, '<h1 class="font-serif font-bold text-3xl mt-10 mb-4 text-ink">$1</h1>')
      .replace(/^> (.*)/gm, '<blockquote class="border-l-4 border-accent pl-4 my-4 italic text-ink-muted">$1</blockquote>')
      .replace(/^- (.*)/gm, '<li class="ml-4 text-ink-muted list-disc">$1</li>')
      .replace(/^\d+\. (.*)/gm, '<li class="ml-4 text-ink-muted list-decimal">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-[var(--paper-warm)] px-1.5 py-0.5 rounded text-sm font-mono text-ink">$1</code>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-md w-full my-4" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="text-ink-muted leading-relaxed mb-4">')
      .replace(/\n/g, '<br/>');
    return `<p class="text-ink-muted leading-relaxed mb-4">${html}</p>`;
  };

  return (
    <div
      className="prose prose-editorial max-w-none p-6 min-h-full overflow-auto"
      dangerouslySetInnerHTML={{ __html: render(content) }}
    />
  );
}

// --- Main Editor ---
export function PostEditor({ post, categories }: Props) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("write");
  const [saveStatus, setSaveStatus] = useState<StatusType>("idle");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

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

  // Word count & reading time
  useEffect(() => {
    const words = form.content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(calculateReadingTime(form.content));
  }, [form.content]);

  const set = useCallback((key: string, val: any) =>
    setForm((f) => ({ ...f, [key]: val })), []);

  const handleTitleChange = useCallback((title: string) => {
    set("title", title);
    if (!post) set("slug", generateSlug(title));
  }, [post, set]);

  const toggleCategory = useCallback((id: string) => {
    set("categoryIds",
      form.categoryIds.includes(id)
        ? form.categoryIds.filter((c: string) => c !== id)
        : [...form.categoryIds, id]
    );
  }, [form.categoryIds, set]);

  // Toolbar action handler
  const handleToolbarAction = useCallback((action: ToolbarAction) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.content.substring(start, end);
    let newText = form.content;
    let newCursorPos = start;

    if (action.wrap) {
      const wrapped = `${action.wrap}${selected || "text"}${action.wrap}`;
      newText = form.content.substring(0, start) + wrapped + form.content.substring(end);
      newCursorPos = start + action.wrap.length + (selected.length || 4);
    } else if (action.prefix && action.suffix) {
      const inserted = `${action.prefix}${selected || "text"}${action.suffix}`;
      newText = form.content.substring(0, start) + inserted + form.content.substring(end);
      newCursorPos = start + action.prefix.length + (selected.length || 4);
    } else if (action.prefix && action.block) {
      const lineStart = form.content.lastIndexOf("\n", start - 1) + 1;
      newText = form.content.substring(0, lineStart) + action.prefix + form.content.substring(lineStart);
      newCursorPos = start + action.prefix.length;
    }

    set("content", newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [form.content, set]);

  // Tab key in textarea
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const newContent = form.content.substring(0, start) + "  " + form.content.substring(ta.selectionEnd);
      set("content", newContent);
      setTimeout(() => ta.setSelectionRange(start + 2, start + 2), 0);
    }
    // Ctrl+S / Cmd+S to save draft
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave(false);
    }
  }, [form.content, set]);

  const handleSave = async (published?: boolean) => {
    if (!form.title.trim()) {
      toastError("Title required", "Please add a title before saving.");
      return;
    }
    setSaveStatus("saving");
    const payload = {
      ...form,
      published: published ?? form.published,
      tags: parseTagsInput(form.tags),
    };
    try {
      const url = post ? `/api/posts/${post.id}` : "/api/posts";
      const method = post ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSaveStatus("saved");
        set("published", published ?? form.published);
        success(
          published ? "Post published!" : "Draft saved",
          published ? "Your post is now live." : "Changes saved successfully."
        );
        setTimeout(() => setSaveStatus("idle"), 2500);
        if (!post) router.push(`/admin/edit/${data.id}`);
        else router.refresh();
      } else {
        throw new Error("Save failed");
      }
    } catch {
      setSaveStatus("error");
      toastError("Save failed", "Please try again.");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleUnpublish = async () => {
    if (!post) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published: false, tags: parseTagsInput(form.tags) }),
      });
      if (res.ok) {
        set("published", false);
        setSaveStatus("saved");
        success("Post unpublished", "Your post is now a draft.");
        setTimeout(() => setSaveStatus("idle"), 2500);
        router.refresh();
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const handleAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
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
        success("Content generated!", "AI has added content to your post.");
      }
    } catch {
      toastError("AI failed", "Could not generate content.");
    }
    setAiLoading(false);
    setShowAI(false);
    setAiPrompt("");
  };

  const isSaving = saveStatus === "saving";
  const StatusIcon = saveStatus === "saved" ? CheckCircle2 : saveStatus === "saving" ? null : null;

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[var(--border)] sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <PenSquare size={16} className="text-ink-subtle flex-shrink-0" />
          <h1 className="font-serif font-bold text-lg truncate">
            {post ? "Edit Post" : "New Post"}
          </h1>
          {/* Status pill */}
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0",
            form.published
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", form.published ? "bg-green-400" : "bg-amber-400")} />
            {form.published ? "Live" : "Draft"}
          </div>
          {saveStatus === "saving" && (
            <span className="text-xs text-ink-faint flex items-center gap-1.5">
              <Spinner size="sm" className="text-ink-faint" />
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-green-600 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 size={12} />
              Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="hidden md:flex items-center gap-0.5 p-1 bg-[var(--paper-warm)] rounded-md border border-[var(--border)]">
            {[
              { mode: "write" as ViewMode, icon: <PenSquare size={13} />, label: "Write" },
              { mode: "split" as ViewMode, icon: <Columns size={13} />, label: "Split" },
              { mode: "preview" as ViewMode, icon: <Eye size={13} />, label: "Preview" },
            ].map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={label}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all",
                  viewMode === mode
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink-subtle hover:text-ink"
                )}
              >
                {icon}
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* AI Assist */}
          <button
            onClick={() => setShowAI(!showAI)}
            className={cn("btn-ghost btn-sm gap-1.5", showAI && "text-accent bg-[var(--accent-light)]")}
          >
            <Wand2 size={13} />
            <span className="hidden sm:inline">AI</span>
          </button>

          {/* Preview link */}
          {post?.slug && (
            <a href={`/blog/${post.slug}`} target="_blank" className="btn-ghost btn-sm gap-1.5 hidden sm:inline-flex">
              <Globe size={13} />
              <span className="hidden lg:inline">View Live</span>
            </a>
          )}

          {/* Save Draft */}
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="btn-outline btn-sm gap-1.5"
          >
            <Save size={13} />
            <span className="hidden sm:inline">Draft</span>
          </button>

          {/* Publish / Unpublish */}
          {form.published ? (
            <button
              onClick={handleUnpublish}
              disabled={isSaving}
              className="btn-outline btn-sm gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-600 hover:text-white hover:border-amber-600"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">Unpublish</span>
            </button>
          ) : (
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="btn-primary btn-sm gap-1.5"
            >
              {isSaving ? <Spinner size="sm" className="text-white" /> : <Globe size={13} />}
              {isSaving ? "Publishing..." : "Publish"}
            </button>
          )}
        </div>
      </div>

      {/* ── AI Panel ── */}
      {showAI && (
        <div className="border-b border-[var(--border)] bg-[var(--accent-light)] px-5 py-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 size={14} className="text-accent" />
            <span className="font-semibold text-sm text-accent">AI Writing Assistant</span>
            <button onClick={() => setShowAI(false)} className="ml-auto text-ink-subtle hover:text-ink p-1">
              <X size={14} />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Write an introduction about React Server Components..."
              className="input flex-1 text-sm bg-white"
              onKeyDown={(e) => e.key === "Enter" && handleAI()}
            />
            <button onClick={handleAI} disabled={aiLoading} className="btn-primary btn-sm">
              {aiLoading ? <Spinner size="sm" className="text-white" /> : <Wand2 size={13} />}
              {aiLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex flex-1 min-h-0">
        {/* Editor + Preview area */}
        <div className={cn(
          "flex-1 flex flex-col lg:flex-row min-h-0",
          viewMode === "split" ? "divide-x divide-[var(--border)]" : ""
        )}>
          {/* Write Pane */}
          {(viewMode === "write" || viewMode === "split") && (
            <div className={cn(
              "flex flex-col flex-1 min-h-0",
              viewMode === "split" && "max-w-[50%]"
            )}>
              {/* Title + Meta fields */}
              <div className="p-5 border-b border-[var(--border)] bg-white space-y-4">
                <div>
                  <textarea
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Post title..."
                    rows={2}
                    className="w-full font-serif font-bold text-2xl md:text-3xl text-ink placeholder:text-ink-faint bg-transparent border-none outline-none resize-none leading-snug"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-ink-faint font-mono">/{form.slug || "post-slug"}</span>
                  <button
                    type="button"
                    onClick={() => set("slug", generateSlug(form.title))}
                    className="text-[10px] text-accent hover:underline"
                  >
                    Regenerate
                  </button>
                  <div className="ml-auto flex items-center gap-3 text-xs text-ink-faint">
                    <span className="flex items-center gap-1"><FileText size={11} />{wordCount} words</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{readingTime}m read</span>
                  </div>
                </div>
                <div>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => set("excerpt", e.target.value)}
                    placeholder="Brief excerpt shown in listings..."
                    rows={2}
                    className="input resize-none text-sm"
                  />
                </div>
              </div>

              {/* Markdown Toolbar */}
              <MarkdownToolbar onAction={handleToolbarAction} />

              {/* Content area */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={"Write your post in Markdown...\n\nTip: Use ## for headings, **bold**, _italic_, `code`\nPress Ctrl+S to save draft"}
                  className="w-full h-full p-5 font-mono text-sm text-ink bg-white border-none outline-none resize-none leading-relaxed placeholder:text-ink-faint"
                  spellCheck
                />
              </div>
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className={cn(
              "flex-1 bg-white overflow-auto min-h-0",
              viewMode === "split" && "max-w-[50%]"
            )}>
              {viewMode === "split" && (
                <div className="px-6 pt-4 pb-2 border-b border-[var(--border)] flex items-center gap-2">
                  <Eye size={13} className="text-ink-subtle" />
                  <span className="text-xs font-medium text-ink-subtle uppercase tracking-widest">Preview</span>
                </div>
              )}
              {form.coverImage && (
                <div className="w-full">
                  <img src={form.coverImage} alt="Cover" className="w-full h-48 object-cover" />
                </div>
              )}
              <div className="p-6">
                {form.title && (
                  <h1 className="font-serif font-bold text-3xl text-ink mb-2 text-balance">{form.title}</h1>
                )}
                {form.excerpt && (
                  <p className="text-ink-subtle text-base mb-6 leading-relaxed italic border-l-2 border-accent pl-4">{form.excerpt}</p>
                )}
                <MarkdownPreview content={form.content} />
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-[var(--border)] bg-[var(--paper)] overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-4">
            {/* Publish Settings */}
            <div className="card bg-white p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Layers size={14} className="text-ink-subtle" />
                Settings
              </h3>
              <div className="space-y-2">
                {[
                  { key: "published", label: "Published", desc: "Visible to readers" },
                  { key: "featured", label: "Featured", desc: "Show in hero section" },
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-[var(--paper-warm)] transition-colors"
                  >
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={(form as any)[key]}
                        onChange={(e) => set(key, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-9 h-5 rounded-full transition-colors",
                        (form as any)[key] ? "bg-accent" : "bg-[var(--border-strong)]"
                      )}>
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow-sm",
                          (form as any)[key] ? "translate-x-4" : "translate-x-0.5"
                        )} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{label}</p>
                      <p className="text-xs text-ink-faint">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cover Image */}
            <div className="card bg-white p-4">
              <label className="label">Cover Image URL</label>
              <input
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="https://..."
                className="input text-sm mb-2"
              />
              {form.coverImage ? (
                <div className="relative rounded-md overflow-hidden">
                  <img src={form.coverImage} alt="Cover preview" className="w-full h-28 object-cover" />
                  <button
                    onClick={() => set("coverImage", "")}
                    className="absolute top-2 right-2 p-1 bg-ink/60 text-white rounded-full hover:bg-ink transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-full h-20 rounded-md bg-[var(--paper-warm)] border-2 border-dashed border-[var(--border)] flex items-center justify-center">
                  <ImageIcon size={20} className="text-ink-faint" />
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="card bg-white p-4">
              <label className="label">Categories</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "badge text-[10px] transition-all",
                      form.categoryIds.includes(cat.id)
                        ? "text-white"
                        : "bg-[var(--paper-warm)] text-ink-muted border border-[var(--border)] hover:border-accent"
                    )}
                    style={form.categoryIds.includes(cat.id) ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.name}
                  </button>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-ink-faint">No categories yet</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="card bg-white p-4">
              <label className="label flex items-center gap-1.5">
                <Hash size={11} />
                Tags
              </label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="nextjs, react, tutorial"
                className="input text-sm"
              />
              <p className="text-[10px] text-ink-faint mt-1.5">Comma separated</p>
              {form.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {parseTagsInput(form.tags).map((tag) => (
                    <span key={tag} className="badge bg-[var(--paper-warm)] text-ink-muted text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="card bg-white p-4 space-y-3">
              <h3 className="font-semibold text-sm">SEO</h3>
              <div>
                <label className="label">Meta Title</label>
                <input
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  placeholder={form.title || "Meta title..."}
                  className="input text-sm"
                />
              </div>
              <div>
                <label className="label">Meta Description</label>
                <textarea
                  value={form.metaDesc}
                  onChange={(e) => set("metaDesc", e.target.value)}
                  placeholder={form.excerpt || "Meta description..."}
                  className="input text-sm resize-none"
                  rows={3}
                />
                {form.metaDesc && (
                  <p className={cn("text-[10px] mt-1", form.metaDesc.length > 160 ? "text-red-500" : "text-ink-faint")}>
                    {form.metaDesc.length}/160 chars
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
