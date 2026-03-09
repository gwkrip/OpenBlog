import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } }).catch(() => null);
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={settings} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
    </div>
  );
}
