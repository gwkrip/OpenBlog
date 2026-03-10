import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import { Search, FileText } from "lucide-react";
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
      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            {query ? (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-1.5">
                  <Search size={11} /> Search Results
                </p>
                <h1 className="heading-display text-3xl md:text-4xl text-balance">
                  &ldquo;{query}&rdquo;
                </h1>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-faint mb-2">
                  The Blog
                </p>
                <h1 className="heading-display text-3xl md:text-5xl">All Posts</h1>
              </>
            )}
            <p className="text-ink-subtle mt-2 text-sm">
              {total} {total === 1 ? "post" : "posts"} {query ? "found" : "published"}
            </p>
          </div>

          {query && (
            <a href="/blog" className="btn-ghost btn-sm text-xs mt-2">
              ← Clear search
            </a>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--paper-warm)] flex items-center justify-center mb-4">
            <FileText size={24} className="text-ink-faint" />
          </div>
          <h2 className="font-serif font-bold text-xl mb-2">
            {query ? "No results found" : "No posts yet"}
          </h2>
          <p className="text-sm text-ink-subtle mb-6 max-w-sm">
            {query
              ? "Try different keywords or browse all posts."
              : "Check back soon — new posts are on the way."}
          </p>
          {query && (
            <a href="/blog" className="btn-outline btn-sm">Browse all posts</a>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-12">
            <Pagination page={page} totalPages={totalPages} baseUrl="/blog" query={query ? `q=${encodeURIComponent(query)}` : undefined} />
          </div>
        </>
      )}
    </div>
  );
}
