import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Edit, Eye, Trash2, PenSquare } from "lucide-react";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Posts - Admin" };

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { name: true } },
      categories: true,
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif font-bold text-2xl">Posts</h1>
        <Link href="/admin/new" className="btn-primary text-sm">
          <PenSquare size={15} />
          New Post
        </Link>
      </div>

      <div className="card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-paper-warm">
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle">Title</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle hidden md:table-cell">Author</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle hidden lg:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle hidden sm:table-cell">Views</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle hidden md:table-cell">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-paper transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/edit/${post.id}`} className="font-medium hover:text-accent transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-ink-muted hidden md:table-cell">{post.author.name}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    {post.categories[0] ? (
                      <span className="badge text-[10px] bg-paper-warm text-ink-muted">{post.categories[0].name}</span>
                    ) : (
                      <span className="text-ink-subtle">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge text-[10px] ${post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {post.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-muted hidden sm:table-cell">{post.views.toLocaleString()}</td>
                  <td className="px-5 py-4 text-ink-subtle hidden md:table-cell">
                    {formatDate(post.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/edit/${post.id}`} className="p-1.5 text-ink-subtle hover:text-accent transition-colors rounded">
                        <Edit size={14} />
                      </Link>
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-ink-subtle hover:text-accent transition-colors rounded">
                          <Eye size={14} />
                        </Link>
                      )}
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <div className="text-center py-16 text-ink-subtle">
              <p>No posts yet.</p>
              <Link href="/admin/new" className="btn-primary mt-4 inline-flex">Create your first post</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
