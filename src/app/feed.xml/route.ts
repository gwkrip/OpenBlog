import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });
  const base = settings?.siteUrl || "http://localhost:3000";

  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${settings?.siteName || "OpenBlog"}</title>
    <link>${base}</link>
    <description>${settings?.siteDesc || ""}</description>
    <language>en-US</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (p) => `<item>
      <title><![CDATA[${p.title}]]></title>
      <link>${base}/blog/${p.slug}</link>
      <guid>${base}/blog/${p.slug}</guid>
      <pubDate>${p.publishedAt?.toUTCString() || p.createdAt.toUTCString()}</pubDate>
      <author>${p.author.name}</author>
      ${p.excerpt ? `<description><![CDATA[${p.excerpt}]]></description>` : ""}
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600",
    },
  });
}
