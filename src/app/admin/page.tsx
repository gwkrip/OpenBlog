import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, Eye, MessageSquare, Users, TrendingUp, PenSquare } from "lucide-react";
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
    { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-blue-500", sub: `${publishedPosts} published` },
    { label: "Total Views", value: topPosts.reduce((s, p) => s + p.views, 0), icon: Eye, color: "text-green-500", sub: "All time" },
    { label: "Comments", value: totalComments, icon: MessageSquare, color: "text-amber-500", sub: `${pendingComments} pending` },
    { label: "Users", value: totalUsers, icon: Users, color: "text-purple-500", sub: "Registered authors" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-3xl">Dashboard</h1>
          <p className="text-ink-subtle mt-1">Welcome back, {session?.user?.name}.</p>
        </div>
        <Link href="/admin/new" className="btn-primary">
          <PenSquare size={16} />
          New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 bg-white">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-subtle">{s.label}</p>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="font-serif font-black text-3xl">{s.value.toLocaleString()}</p>
            <p className="text-xs text-ink-subtle mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif font-bold text-xl">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                <div className="min-w-0">
                  <Link href={`/admin/edit/${post.id}`} className="font-medium text-sm hover:text-accent transition-colors line-clamp-1">
                    {post.title}
                  </Link>
                  <p className="text-xs text-ink-subtle mt-0.5">{formatDate(post.createdAt, { month: "short", day: "numeric" })}</p>
                </div>
                <span className={`badge text-[10px] flex-shrink-0 ${post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {post.published ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-white p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-accent" />
            <h2 className="font-serif font-bold text-xl">Top Posts</h2>
          </div>
          <div className="space-y-4">
            {topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-4">
                <span className="font-serif font-black text-2xl text-[var(--border)] min-w-[2rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/edit/${post.id}`} className="text-sm font-medium hover:text-accent transition-colors line-clamp-1">
                    {post.title}
                  </Link>
                </div>
                <span className="text-xs font-medium text-ink-subtle flex items-center gap-1">
                  <Eye size={11} />
                  {post.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
