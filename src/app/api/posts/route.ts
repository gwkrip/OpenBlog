import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug, calculateReadingTime } from "@/lib/utils";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string(),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  categoryIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "10");
  const published = searchParams.get("published");
  const category = searchParams.get("category");
  const search = searchParams.get("q");

  const where: any = {};
  if (published !== null) where.published = published === "true";
  if (category) where.categories = { some: { slug: category } };
  if (search) where.OR = [{ title: { contains: search } }, { content: { contains: search } }];

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
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      hasNext: page * perPage < total,
      hasPrev: page > 1,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = postSchema.parse(body);

  const slug = data.slug || generateSlug(data.title);
  const readingTime = calculateReadingTime(data.content);

  const tagConnectOrCreate = data.tags.map((name) => ({
    where: { slug: generateSlug(name) },
    create: { name, slug: generateSlug(name) },
  }));

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      published: data.published,
      featured: data.featured,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
      readingTime,
      publishedAt: data.published ? new Date() : null,
      authorId: session.user.id!,
      categories: { connect: data.categoryIds.map((id) => ({ id })) },
      tags: { connectOrCreate: tagConnectOrCreate },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
