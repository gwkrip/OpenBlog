import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, MessageSquare } from "lucide-react";
import type { PostWithRelations } from "@/types";

interface Props {
  post: PostWithRelations & { _count?: { comments: number } };
}

export function PostHeader({ post }: Props) {
  return (
    <div>
      <div className="bg-paper-warm border-b border-[var(--border)]">
        <div className="container-editorial py-12 md:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              {post.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="badge text-white text-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-balance mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg md:text-xl text-ink-muted leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || ""}
                    width={44}
                    height={44}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center text-paper font-bold">
                    {post.author.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-ink">{post.author.name}</p>
                  <p className="text-xs text-ink-subtle">
                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-sm text-ink-subtle">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.readingTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {post.views} views
                </span>
                {post._count && (
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={14} />
                    {post._count.comments} comments
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="relative w-full aspect-[21/9] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </div>
  );
}
