"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  MessageSquare,
  Users,
  Settings,
  ExternalLink,
  PenSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  user: any;
}

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/new", label: "New Post", icon: PenSquare },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 bg-ink text-paper flex flex-col flex-shrink-0 hidden lg:flex">
      <div className="p-6 border-b border-paper/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif font-black text-xl">OpenBlog</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        </Link>
        <p className="text-xs text-paper/40 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors",
              isActive(href, exact)
                ? "bg-accent text-white"
                : "text-paper/60 hover:bg-paper/10 hover:text-paper"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-paper/10">
        <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-paper/40 hover:text-accent transition-colors mb-4">
          <ExternalLink size={12} />
          View site
        </Link>
        <div className="flex items-center gap-3">
          {user?.image ? (
            <Image src={user.image} alt={user.name || ""} width={32} height={32} className="rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-paper/20 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-paper/40 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
