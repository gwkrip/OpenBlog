import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, Eye, MessageSquare, Users, TrendingUp, PenSquare, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard - Admin" };

export default async function AdminDashboard() {
  const session = await auth();

  const [totalPosts, publishedPosts, totalComments, pendingComments, totalUsers, recentPosts, topPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { approved: false } }),
      prisma.user.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } }, categories: true },
      }),
      prisma.post.findMany({
        where: { published: true },
        take: 5,
        orderBy: { views: "desc" },
        select: { id: true, title: true, slug: true, views: true },
      }),
    ]);

  const stats = [
    { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-blue-500", bg: "bg-blue-50", sub: `${publishedPosts} published` },
    { label: "Total Views", value: topPosts.reduce((s, p) => s + p.views, 0).toLocaleString(), icon: Eye, color: "text-green-600", bg: "bg-green-50", sub: "All time" },
    { label: "Comments", value: totalComments, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50", sub: `${pendingComments} pending` },
    { label: "Users", value: totalUsers, icon: Users, color: "text-purple-600", bg: "bg-purple-50", sub: "Registered authors" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-3xl text-ink">Dashboard</h1>
          <p className="text-ink-subtle mt-1">Welcome back, {session?.user?.name}.</p>
        </div>
        <Link href="/admin/new" className="btn-primary gap-2">
          <PenSquare size={15} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((s) => (
          <div key={s.label} className="card bg-white p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{s.label}</p>
              <div className={`p-1.5 rounded-lg ${s.bg}`}>
                <s.icon size={15} className={s.color} />
              </div>
            </div>
            <p className="font-serif font-black text-3xl text-ink">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</p>
            <p className="text-xs text-ink-faint mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="card bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif font-bold text-lg">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-1">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-md hover:bg-[var(--paper-warm)] transition-colors group">
                <div className="min-w-0">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="font-medium text-sm hover:text-accent transition-colors line-clamp-1 block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-ink-faint mt-0.5">{formatDate(post.createdAt, { month: "short", day: "numeric" })}</p>
                </div>
                <span className={`badge text-[10px] flex-shrink-0 ${post.published ? "badge-live" : "badge-draft"}`}>
                  {post.published ? "Live" : "Draft"}
                </span>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <p className="text-sm text-ink-faint py-8 text-center">No posts yet.</p>
            )}
          </div>
        </div>

        {/* Top Posts */}
        <div className="card bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-accent" />
            <h2 className="font-serif font-bold text-lg">Top Posts</h2>
          </div>
          <div className="space-y-1">
            {topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-4 py-2.5 px-3 rounded-md hover:bg-[var(--paper-warm)] transition-colors">
                <span className="font-serif font-black text-xl text-[var(--border)] min-w-[2rem] leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="text-sm font-medium hover:text-accent transition-colors line-clamp-1 block"
                  >
                    {post.title}
                  </Link>
                </div>
                <span className="text-xs font-medium text-ink-faint flex items-center gap-1 flex-shrink-0">
                  <Eye size={11} />
                  {post.views.toLocaleString()}
                </span>
              </div>
            ))}
            {topPosts.length === 0 && (
              <p className="text-sm text-ink-faint py-8 text-center">No published posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
