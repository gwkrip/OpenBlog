import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/PostEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Post - Admin" };

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <PostEditor categories={categories} />;
}
