"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, FolderOpen, MessageSquare,
  Users, Settings, ExternalLink, PenSquare, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props { user: any; }

const navGroups = [
  {
    label: "Content",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/posts", label: "Posts", icon: FileText },
      { href: "/admin/new", label: "New Post", icon: PenSquare, highlight: true },
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/admin/comments", label: "Comments", icon: MessageSquare },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && href !== "/admin";

  return (
    <aside className="w-60 bg-[#141414] text-[#f0ede8] flex flex-col flex-shrink-0 hidden lg:flex">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif font-black text-xl text-white group-hover:text-accent transition-colors">
            OpenBlog
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        </Link>
        <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-widest">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25 px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, exact, highlight }) => {
                const active = isActive(href, exact) || (exact && pathname === href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150",
                      active
                        ? "bg-accent text-white"
                        : highlight
                        ? "text-accent/80 hover:text-accent hover:bg-accent/10"
                        : "text-white/55 hover:text-white hover:bg-white/8"
                    )}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    <span>{label}</span>
                    {active && <ChevronRight size={12} className="ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/8 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-white/35 hover:text-accent hover:bg-white/5 transition-all"
        >
          <ExternalLink size={13} />
          View public site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/5">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || ""}
              width={30}
              height={30}
              className="rounded-full object-cover border border-white/10 flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[11px] font-bold text-accent flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-white/80 truncate leading-tight">{user?.name}</p>
            <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
