import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatDate, getInitials } from "@/lib/utils";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users - Admin" };

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    include: { _count: { select: { posts: true, comments: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif font-bold text-2xl">Users</h1>

      <div className="card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-paper-warm">
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle">User</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle hidden md:table-cell">Role</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle hidden sm:table-cell">Posts</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-ink-subtle hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-paper transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image src={user.image} alt={user.name || ""} width={32} height={32} className="rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-paper-warm flex items-center justify-center text-xs font-bold text-ink-muted">
                          {getInitials(user.name || "U")}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-ink-subtle">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`badge text-[10px] ${
                      user.role === "admin" ? "bg-purple-100 text-purple-700" :
                      user.role === "author" ? "bg-blue-100 text-blue-700" :
                      "bg-paper-warm text-ink-muted"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-muted hidden sm:table-cell">{user._count.posts}</td>
                  <td className="px-5 py-4 text-ink-subtle hidden lg:table-cell">
                    {formatDate(user.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
