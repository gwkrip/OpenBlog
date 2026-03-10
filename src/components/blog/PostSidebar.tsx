import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { ShareButtons } from "./ShareButtons";
import type { PostWithRelations } from "@/types";

interface Props {
  post: PostWithRelations;
}

export function PostSidebar({ post }: Props) {
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;

  return (
    <div className="space-y-8 sticky top-24">
      <div className="card p-6">
        <h3 className="text-xs font-medium uppercase tracking-widest text-ink-subtle mb-4">Author</h3>
        <div className="flex items-start gap-3">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name || ""}
              width={48}
              height={48}
              className="rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-paper-warm flex items-center justify-center font-bold text-ink-muted flex-shrink-0">
              {post.author.name?.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-ink">{post.author.name}</p>
            {post.author.bio && (
              <p className="text-sm text-ink-subtle mt-1 leading-relaxed">{post.author.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 size={14} className="text-ink-subtle" />
          <h3 className="text-xs font-medium uppercase tracking-widest text-ink-subtle">Share</h3>
        </div>
        <ShareButtons url={postUrl} title={post.title} />
      </div>

      {post.tags.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xs font-medium uppercase tracking-widest text-ink-subtle mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="badge bg-paper-warm text-ink-muted hover:bg-accent hover:text-white transition-colors text-xs"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
