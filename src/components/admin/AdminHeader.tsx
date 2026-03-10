"use client";

import { signOut } from "next-auth/react";
import { LogOut, Bell, Menu, PenSquare } from "lucide-react";
import Link from "next/link";

interface Props { user: any; }

export function AdminHeader({ user }: Props) {
  return (
    <header className="h-14 bg-white border-b border-[var(--border)] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="lg:hidden font-serif font-black text-xl">OpenBlog</div>
        <Link
          href="/admin/new"
          className="lg:hidden btn-primary btn-sm gap-1.5"
        >
          <PenSquare size={13} />
          Write
        </Link>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button
          className="p-2 rounded-md text-ink-subtle hover:text-ink hover:bg-[var(--paper-warm)] transition-all relative"
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>
        <div className="w-px h-5 bg-[var(--border)] mx-1" />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-ink-subtle hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={15} />
          <span className="hidden sm:block font-medium">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
