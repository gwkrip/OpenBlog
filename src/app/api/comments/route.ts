import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(2000),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional().or(z.literal("")),
  parentId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = commentSchema.parse(body);
  const session = await auth();

  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });
  if (!settings?.allowComments) {
    return NextResponse.json({ error: "Comments are disabled" }, { status: 403 });
  }

  const post = await prisma.post.findUnique({ where: { id: data.postId, published: true } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      postId: data.postId,
      parentId: data.parentId,
      approved: !settings.requireCommentApproval || !!session?.user,
      authorId: session?.user?.id || null,
      guestName: !session?.user ? data.guestName : null,
      guestEmail: !session?.user ? data.guestEmail : null,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
