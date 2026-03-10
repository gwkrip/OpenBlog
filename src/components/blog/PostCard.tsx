import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Clock, MessageSquare, ArrowUpRight } from "lucide-react";
import type { PostWithRelations } from "@/types";

interface Props {
  post: PostWithRelations;
  compact?: boolean;
  featured?: boolean;
}

export function PostCard({ post, compact = false, featured = false }: Props) {
  const category = post.categories[0];

  return (
    <article className="group flex flex-col h-full">
      {/* Thumbnail */}
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden rounded-md mb-4 flex-shrink-0"
        tabIndex={-1}
        aria-hidden
      >
        <div className={`relative bg-[var(--paper-warm)] overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--paper-warm)] to-[var(--paper-mid)]">
              <span
                className="font-serif text-5xl font-black select-none"
                style={{
                  color: category?.color ? `${category.color}30` : "var(--border)",
                }}
              >
                {post.title.charAt(0)}
              </span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/8 transition-all duration-300" />
        </div>
      </Link>

      <div className="flex flex-col flex-1">
        {/* Category */}
        {category && (
          <Link
            href={`/categories/${category.slug}`}
            className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest mb-2 transition-opacity hover:opacity-70"
            style={{ color: category.color }}
          >
            {category.name}
          </Link>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="block mb-3 flex-1">
          <h2
            className={`font-serif font-bold group-hover:text-accent transition-colors duration-200 text-balance leading-snug ${
              compact ? "text-base" : featured ? "text-2xl" : "text-[1.1rem]"
            }`}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {!compact && post.excerpt && (
          <p className="text-sm text-ink-subtle line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || ""}
                width={22}
                height={22}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-5.5 h-5.5 rounded-full bg-[var(--paper-warm)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-ink-subtle flex-shrink-0">
                {post.author.name?.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-ink-muted leading-none">{post.author.name}</span>
              <span className="text-[10px] text-ink-faint mt-0.5">
                {post.publishedAt
                  ? formatDate(post.publishedAt, { month: "short", day: "numeric", year: "numeric" })
                  : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-ink-faint">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {post.readingTime}m
            </span>
            {post._count && post._count.comments > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare size={10} />
                {post._count.comments}
              </span>
            )}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={13} className="text-accent" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
