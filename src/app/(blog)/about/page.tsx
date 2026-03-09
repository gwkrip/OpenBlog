import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const authors = await prisma.user.findMany({
    where: { role: { in: ["admin", "author"] }, posts: { some: { published: true } } },
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "asc" },
  });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });

  const stats = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.category.count(),
    prisma.comment.count({ where: { approved: true } }),
  ]);

  return (
    <div className="container-editorial py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="heading-display text-5xl md:text-6xl mb-6">{settings?.siteName || "OpenBlog"}</h1>
        <p className="text-xl text-ink-muted leading-relaxed">{settings?.siteDesc}</p>
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-16 text-center">
        {[
          { label: "Published Posts", value: stats[0] },
          { label: "Categories", value: stats[1] },
          { label: "Comments", value: stats[2] },
        ].map((s) => (
          <div key={s.label}>
            <p className="heading-display text-4xl text-accent mb-1">{s.value}</p>
            <p className="text-xs uppercase tracking-widest text-ink-subtle">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="divider mb-16" />

      <div>
        <h2 className="heading-display text-3xl mb-10 text-center">Our Authors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author) => (
            <div key={author.id} className="card p-6 text-center">
              <div className="mb-4 mx-auto">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name || ""}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-paper-warm flex items-center justify-center mx-auto">
                    <span className="heading-display text-xl text-ink-muted">
                      {getInitials(author.name || "U")}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-serif font-bold text-xl mb-1">{author.name}</h3>
              <p className="text-xs uppercase tracking-widest text-ink-subtle mb-3">
                {author._count.posts} posts
              </p>
              {author.bio && <p className="text-sm text-ink-muted line-clamp-3">{author.bio}</p>}
              <div className="flex justify-center gap-4 mt-4">
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener" className="text-xs text-accent hover:underline">
                    Website
                  </a>
                )}
                {author.twitter && (
                  <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener" className="text-xs text-accent hover:underline">
                    Twitter
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
