import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Posts",
  description: "Browse all blog posts",
};

interface Props {
  searchParams: { page?: string; q?: string };
}

export default async function BlogPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const query = searchParams.q || "";
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const where = {
    published: true,
    ...(query && {
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, image: true, bio: true } },
        categories: true,
        tags: true,
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="container-editorial py-12">
      <div className="mb-10">
        <h1 className="heading-display text-4xl md:text-5xl mb-3">
          {query ? `Search: "${query}"` : "All Posts"}
        </h1>
        <p className="text-ink-muted">
          {total} {total === 1 ? "post" : "posts"} {query ? "found" : "published"}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-ink-subtle">
          <p className="text-xl">No posts found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} baseUrl="/blog" />
        </>
      )}
    </div>
  );
}
