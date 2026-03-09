import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MDXContent } from "@/components/blog/MDXContent";
import { PostHeader } from "@/components/blog/PostHeader";
import { PostSidebar } from "@/components/blog/PostSidebar";
import { CommentSection } from "@/components/blog/CommentSection";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: { select: { name: true } }, categories: true },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author.name ? [post.author.name] : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true, website: true, twitter: true } },
      categories: true,
      tags: true,
      comments: {
        where: { approved: true, parentId: null },
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: {
            where: { approved: true },
            include: { author: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { comments: true } },
    },
  });

  if (!post) notFound();

  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  const related = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
      categories: { some: { id: { in: post.categories.map((c) => c.id) } } },
    },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true } },
      categories: true,
      tags: true,
      _count: { select: { comments: true } },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });

  return (
    <article>
      <PostHeader post={post} />
      <div className="container-editorial py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose-editorial post-content">
              <MDXContent source={post.content} />
            </div>

            <div className="mt-12 pt-8 border-t border-[var(--border)]">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="badge bg-paper-warm text-ink-muted hover:bg-accent hover:text-white transition-colors"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            </div>

            {settings?.allowComments && (
              <div className="mt-12">
                <CommentSection
                  postId={post.id}
                  comments={post.comments as any}
                  requireApproval={settings.requireCommentApproval}
                />
              </div>
            )}
          </div>

          <aside>
            <PostSidebar post={post} />
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--border)]">
            <RelatedPosts posts={related as any} />
          </div>
        )}
      </div>
    </article>
  );
}
