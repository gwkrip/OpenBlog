import { prisma } from "@/lib/prisma";
import { HeroPost } from "@/components/blog/HeroPost";
import { PostGrid } from "@/components/blog/PostGrid";
import { CategoryBar } from "@/components/blog/CategoryBar";
import { NewsletterBox } from "@/components/blog/NewsletterBox";
import { FeaturedSidebar } from "@/components/blog/FeaturedSidebar";

async function getPosts() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });
  const perPage = settings?.postsPerPage || 10;

  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true } },
      categories: true,
      tags: true,
      _count: { select: { comments: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: perPage,
  });

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const popular = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { id: true, name: true, image: true, bio: true } }, categories: true, tags: true, _count: { select: { comments: true } } },
    orderBy: { views: "desc" },
    take: 5,
  });

  return { featured, rest, categories, popular };
}

export default async function HomePage() {
  const { featured, rest, categories, popular } = await getPosts();

  return (
    <div className="container-editorial py-8">
      <CategoryBar categories={categories} />

      {featured && (
        <section className="mb-12">
          <HeroPost post={featured} />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="heading-display text-2xl">Latest Stories</h2>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <PostGrid posts={rest} />
        </div>
        <aside className="lg:col-span-1 space-y-8">
          <FeaturedSidebar posts={popular} />
          <NewsletterBox />
        </aside>
      </div>
    </div>
  );
}
