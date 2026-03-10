import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, ArrowRight } from "lucide-react";
import type { PostWithRelations } from "@/types";

interface Props {
  post: PostWithRelations;
}

export function HeroPost({ post }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl">
      {/* Background image */}
      <div className="relative aspect-[21/9] min-h-[380px] max-h-[520px] bg-[var(--paper-warm)]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ink)] via-[var(--ink-muted)] to-[var(--ink-subtle)]" />
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="badge badge-featured text-[10px]">Featured</span>
          {post.categories[0] && (
            <Link
              href={`/categories/${post.categories[0].slug}`}
              className="badge bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition-colors text-[10px]"
            >
              {post.categories[0].name}
            </Link>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h1 className="heading-display text-2xl md:text-4xl lg:text-5xl text-white text-balance leading-tight group-hover:text-accent transition-colors duration-300 max-w-3xl">
            {post.title}
          </h1>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm md:text-base text-white/70 line-clamp-2 max-w-2xl mb-5 leading-relaxed hidden sm:block">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || ""}
                width={36}
                height={36}
                className="rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white border border-white/20">
                {post.author.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white">{post.author.name}</p>
              <p className="text-xs text-white/60">
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {post.readingTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={12} />
                {post.views.toLocaleString()}
              </span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white text-ink text-sm font-semibold rounded-md hover:bg-accent hover:text-white transition-all duration-200"
            >
              Read More
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
