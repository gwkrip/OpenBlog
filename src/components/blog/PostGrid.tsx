import { PostCard } from "./PostCard";
import type { PostWithRelations } from "@/types";

export function PostGrid({ posts }: { posts: PostWithRelations[] }) {
  return (
    <div className="grid grid-cols-1 gap-10">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
