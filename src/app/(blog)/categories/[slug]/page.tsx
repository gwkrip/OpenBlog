import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!cat) return { title: "Category Not Found" };
  return { title: cat.name, description: cat.description || undefined };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const where = { published: true, categories: { some: { slug: params.slug } } };

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
        <div className="w-12 h-1 mb-4 rounded-full" style={{ backgroundColor: category.color }} />
        <h1 className="heading-display text-4xl md:text-5xl mb-3">{category.name}</h1>
        {category.description && <p className="text-ink-muted text-lg mb-2">{category.description}</p>}
        <p className="text-ink-subtle text-sm">{total} posts</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-ink-subtle">
          <p className="text-xl">No posts in this category yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} baseUrl={`/categories/${params.slug}`} />
        </>
      )}
    </div>
  );
}
