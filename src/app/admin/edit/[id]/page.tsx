import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/PostEditor";
import type { Metadata } from "next";

interface Props { params: { id: string } }

export const metadata: Metadata = { title: "Edit Post - Admin" };

export default async function EditPostPage({ params }: Props) {
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id: params.id },
      include: { categories: true, tags: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div className="h-full">
      <PostEditor post={post} categories={categories} />
    </div>
  );
}
