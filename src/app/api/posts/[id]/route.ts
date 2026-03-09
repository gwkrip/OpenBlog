import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug, calculateReadingTime } from "@/lib/utils";

interface Params { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true } },
      categories: true,
      tags: true,
      _count: { select: { comments: true } },
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const readingTime = body.content ? calculateReadingTime(body.content) : existing.readingTime;

  const tagConnectOrCreate = (body.tags || []).map((name: string) => ({
    where: { slug: generateSlug(name) },
    create: { name, slug: generateSlug(name) },
  }));

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: body.title ?? existing.title,
      slug: body.slug ?? existing.slug,
      excerpt: body.excerpt,
      content: body.content ?? existing.content,
      coverImage: body.coverImage,
      published: body.published ?? existing.published,
      featured: body.featured ?? existing.featured,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc,
      readingTime,
      publishedAt: body.published && !existing.publishedAt ? new Date() : existing.publishedAt,
      categories: { set: (body.categoryIds || []).map((id: string) => ({ id })) },
      tags: { set: [], connectOrCreate: tagConnectOrCreate },
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
