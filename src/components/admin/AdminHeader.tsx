"use client";

import { signOut } from "next-auth/react";
import { LogOut, Bell } from "lucide-react";

interface Props {
  user: any;
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="h-14 bg-white border-b border-[var(--border)] flex items-center justify-between px-6">
      <div className="lg:hidden font-serif font-black text-xl">OpenBlog</div>
      <div className="flex items-center gap-4 ml-auto">
        <button className="p-2 text-ink-subtle hover:text-ink transition-colors relative">
          <Bell size={18} />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-sm text-ink-subtle hover:text-accent transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
