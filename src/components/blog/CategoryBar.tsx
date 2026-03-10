"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  categories: { id: string; name: string; slug: string; color: string }[];
}

export function CategoryBar({ categories }: Props) {
  const pathname = usePathname() ?? "";

  return (
    <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
      <Link
        href="/blog"
        className={`badge transition-colors whitespace-nowrap ${
          pathname === "/blog"
            ? "bg-ink text-paper"
            : "bg-paper-warm text-ink-muted hover:bg-ink hover:text-paper"
        }`}
      >
        All Posts
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          className={`badge whitespace-nowrap transition-colors`}
          style={
            pathname === `/categories/${cat.slug}`
              ? { backgroundColor: cat.color, color: "white" }
              : { backgroundColor: "var(--paper-warm)", color: "var(--ink-muted)" }
          }
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
