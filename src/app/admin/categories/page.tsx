import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories - Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif font-bold text-2xl">Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
