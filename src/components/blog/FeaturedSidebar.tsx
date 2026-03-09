import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import type { PostWithRelations } from "@/types";

interface Props {
  posts: PostWithRelations[];
}

export function FeaturedSidebar({ posts }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={16} className="text-accent" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-ink-subtle">Most Read</h3>
      </div>

      <ol className="space-y-5">
        {posts.map((post, index) => (
          <li key={post.id} className="flex gap-4 group">
            <span className="font-serif font-black text-3xl text-[var(--border)] leading-none select-none min-w-[2rem]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              {post.categories[0] && (
                <span
                  className="text-[10px] font-medium uppercase tracking-widest mb-1 block"
                  style={{ color: post.categories[0].color }}
                >
                  {post.categories[0].name}
                </span>
              )}
              <Link href={`/blog/${post.slug}`} className="block">
                <h4 className="text-sm font-serif font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </Link>
              <p className="text-xs text-ink-subtle mt-1">
                {post.publishedAt
                  ? formatDate(post.publishedAt, { month: "short", day: "numeric" })
                  : ""}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
