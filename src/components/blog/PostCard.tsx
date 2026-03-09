import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Clock, MessageSquare } from "lucide-react";
import type { PostWithRelations } from "@/types";

interface Props {
  post: PostWithRelations;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: Props) {
  return (
    <article className="group flex flex-col h-full">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-sm mb-4">
        <div className="relative aspect-[16/9] bg-paper-warm overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-paper-warm to-[var(--border)]">
              <span className="font-serif text-6xl font-black text-[var(--border)] select-none">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1">
        {post.categories[0] && (
          <Link
            href={`/categories/${post.categories[0].slug}`}
            className="text-xs font-medium uppercase tracking-widest mb-2 transition-colors"
            style={{ color: post.categories[0].color }}
          >
            {post.categories[0].name}
          </Link>
        )}

        <Link href={`/blog/${post.slug}`} className="block mb-3 flex-1">
          <h2
            className={`font-serif font-bold group-hover:text-accent transition-colors text-balance leading-snug ${
              compact ? "text-base" : "text-xl"
            }`}
          >
            {post.title}
          </h2>
        </Link>

        {!compact && post.excerpt && (
          <p className="text-sm text-ink-muted line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || ""}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-paper-warm flex items-center justify-center text-[10px] font-bold text-ink-muted">
                {post.author.name?.charAt(0)}
              </div>
            )}
            <span className="text-xs text-ink-subtle">
              {post.publishedAt ? formatDate(post.publishedAt, { month: "short", day: "numeric", year: "numeric" }) : ""}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-subtle">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readingTime}m
            </span>
            {post._count && (
              <span className="flex items-center gap-1">
                <MessageSquare size={11} />
                {post._count.comments}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
