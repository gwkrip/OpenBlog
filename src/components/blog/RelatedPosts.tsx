import { PostCard } from "./PostCard";
import type { PostWithRelations } from "@/types";

interface Props {
  posts: PostWithRelations[];
}

export function RelatedPosts({ posts }: Props) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="heading-display text-2xl">Related Stories</h2>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
