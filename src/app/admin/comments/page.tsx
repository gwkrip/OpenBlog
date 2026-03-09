import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CommentActions } from "@/components/admin/CommentActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Comments - Admin" };

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      post: { select: { title: true, slug: true } },
      author: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif font-bold text-2xl">Comments</h1>
        {pending.length > 0 && (
          <span className="badge bg-amber-100 text-amber-700">{pending.length} pending</span>
        )}
      </div>

      {pending.length > 0 && (
        <div className="card bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-amber-50">
            <h2 className="text-sm font-medium text-amber-700">Pending Approval</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {pending.map((c) => (
              <div key={c.id} className="p-5 flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm">{c.author?.name || c.guestName || "Guest"}</span>
                    {c.guestEmail && <span className="text-xs text-ink-subtle">{c.guestEmail}</span>}
                    <span className="text-xs text-ink-subtle">· {formatDate(c.createdAt, { month: "short", day: "numeric" })}</span>
                  </div>
                  <p className="text-sm text-ink-muted mb-1">{c.content}</p>
                  <p className="text-xs text-ink-subtle">
                    On: <a href={`/blog/${c.post.slug}`} target="_blank" className="text-accent hover:underline">{c.post.title}</a>
                  </p>
                </div>
                <CommentActions id={c.id} approved={c.approved} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-paper-warm">
          <h2 className="text-sm font-medium text-ink-subtle">Approved ({approved.length})</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {approved.map((c) => (
            <div key={c.id} className="p-5 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-sm">{c.author?.name || c.guestName || "Guest"}</span>
                  <span className="text-xs text-ink-subtle">· {formatDate(c.createdAt, { month: "short", day: "numeric" })}</span>
                </div>
                <p className="text-sm text-ink-muted mb-1">{c.content}</p>
                <p className="text-xs text-ink-subtle">
                  On: <a href={`/blog/${c.post.slug}`} target="_blank" className="text-accent hover:underline">{c.post.title}</a>
                </p>
              </div>
              <CommentActions id={c.id} approved={c.approved} />
            </div>
          ))}
          {approved.length === 0 && (
            <p className="text-center py-12 text-ink-subtle text-sm">No approved comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
