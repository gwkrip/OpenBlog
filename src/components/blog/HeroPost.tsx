import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Clock, Eye } from "lucide-react";
import type { PostWithRelations } from "@/types";

interface Props {
  post: PostWithRelations;
}

export function HeroPost({ post }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 card overflow-hidden group">
      <div className="relative overflow-hidden bg-paper-warm aspect-[4/3] lg:aspect-auto">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-paper-warm to-[var(--border)] flex items-center justify-center">
            <span className="font-serif text-8xl font-black text-[var(--border)] select-none">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
      </div>

      <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
        <div className="flex items-center gap-3 mb-6">
          <span className="badge bg-accent text-white">Featured</span>
          {post.categories[0] && (
            <Link
              href={`/categories/${post.categories[0].slug}`}
              className="badge text-ink-subtle bg-paper-warm hover:bg-accent hover:text-white transition-colors"
            >
              {post.categories[0].name}
            </Link>
          )}
        </div>

        <Link href={`/blog/${post.slug}`} className="block mb-4 group/title">
          <h1 className="heading-display text-3xl md:text-4xl text-balance group-hover/title:text-accent transition-colors leading-tight">
            {post.title}
          </h1>
        </Link>

        {post.excerpt && (
          <p className="text-ink-muted leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || ""}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-paper-warm flex items-center justify-center text-xs font-bold text-ink-muted">
                {post.author.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-ink">{post.author.name}</p>
              <p className="text-xs text-ink-subtle">
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-ink-subtle">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readingTime} min
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={13} />
              {post.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
