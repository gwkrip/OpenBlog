import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: true } },
      posts: {
        where: { published: true },
        take: 1,
        orderBy: { publishedAt: "desc" },
        select: { coverImage: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-editorial py-12">
      <div className="mb-12">
        <h1 className="heading-display text-4xl md:text-5xl mb-3">Categories</h1>
        <p className="text-ink-muted">Browse posts by topic</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group card p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className="w-10 h-1 mb-4 rounded-full transition-all group-hover:w-16"
              style={{ backgroundColor: cat.color }}
            />
            <h2 className="font-serif font-bold text-xl mb-1 group-hover:text-accent transition-colors">
              {cat.name}
            </h2>
            {cat.description && (
              <p className="text-ink-subtle text-sm mb-3 line-clamp-2">{cat.description}</p>
            )}
            <span className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
              {cat._count.posts} {cat._count.posts === 1 ? "Post" : "Posts"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
