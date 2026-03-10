import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Edit, Eye, PenSquare, FileText } from "lucide-react";
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

  const published = posts.filter((p) => p.published).length;

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl">Posts</h1>
          <p className="text-ink-subtle text-sm mt-1">{posts.length} total · {published} published</p>
        </div>
        <Link href="/admin/new" className="btn-primary gap-2">
          <PenSquare size={14} />
          New Post
        </Link>
      </div>

      <div className="card bg-white overflow-hidden">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--paper-warm)] flex items-center justify-center mb-4">
              <FileText size={22} className="text-ink-faint" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">No posts yet</h3>
            <p className="text-sm text-ink-subtle mb-5">Create your first post to get started.</p>
            <Link href="/admin/new" className="btn-primary gap-2">
              <PenSquare size={14} />
              Create first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--paper-warm)]">
                  {["Title", "Author", "Category", "Status", "Views", "Date", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-ink-faint ${
                        i === 1 ? "hidden md:table-cell" : i === 2 ? "hidden lg:table-cell" : i === 4 ? "hidden sm:table-cell" : i === 5 ? "hidden md:table-cell" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--paper)] transition-colors group">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="font-medium hover:text-accent transition-colors line-clamp-1 block max-w-xs"
                      >
                        {post.title}
                      </Link>
                      {post.categories[0] && (
                        <span className="text-xs text-ink-faint">{post.categories[0].name}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-ink-subtle text-sm hidden md:table-cell">{post.author.name}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {post.categories[0] ? (
                        <span
                          className="badge text-[10px]"
                          style={{ backgroundColor: `${post.categories[0].color}20`, color: post.categories[0].color }}
                        >
                          {post.categories[0].name}
                        </span>
                      ) : <span className="text-ink-faint">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge text-[10px] ${post.published ? "badge-live" : "badge-draft"}`}>
                        {post.published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink-subtle hidden sm:table-cell">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-ink-faint text-xs hidden md:table-cell">
                      {formatDate(post.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="p-1.5 rounded-md text-ink-subtle hover:text-accent hover:bg-[var(--paper-warm)] transition-all"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </Link>
                        {post.published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-md text-ink-subtle hover:text-accent hover:bg-[var(--paper-warm)] transition-all"
                            title="View live"
                          >
                            <Eye size={13} />
                          </Link>
                        )}
                        <DeletePostButton id={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
