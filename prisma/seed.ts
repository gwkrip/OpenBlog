import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@openblog.dev" },
    update: {},
    create: {
      email: "admin@openblog.dev",
      name: "Admin",
      password,
      role: "admin",
      bio: "OpenBlog administrator",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      siteName: "OpenBlog",
      siteDesc: "A modern open blog platform built with Next.js",
      siteUrl: "http://localhost:3000",
      accentColor: "#e85d04",
    },
  });

  const categories = [
    { name: "Technology", slug: "technology", color: "#3b82f6" },
    { name: "Design", slug: "design", color: "#8b5cf6" },
    { name: "Business", slug: "business", color: "#10b981" },
    { name: "Lifestyle", slug: "lifestyle", color: "#f59e0b" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const tech = await prisma.category.findUnique({ where: { slug: "technology" } });

  await prisma.post.upsert({
    where: { slug: "welcome-to-openblog" },
    update: {},
    create: {
      title: "Welcome to OpenBlog",
      slug: "welcome-to-openblog",
      excerpt: "OpenBlog is a modern, open-source blog platform built with Next.js 14, Prisma, and Tailwind CSS.",
      content: `# Welcome to OpenBlog

OpenBlog is a **modern, production-ready** blog platform built with the latest web technologies.

## Features

- Full-featured blog with categories, tags, and comments
- Admin dashboard for content management
- AI-powered writing assistant
- SEO optimized with meta tags
- Dark/light mode support
- Responsive design

## Getting Started

Login to the admin panel at \`/admin\` with:
- Email: admin@openblog.dev  
- Password: admin123456

Start creating your first post!`,
      published: true,
      featured: true,
      readingTime: 2,
      publishedAt: new Date(),
      authorId: admin.id,
      categories: { connect: tech ? [{ id: tech.id }] : [] },
    },
  });

  console.log("Seed completed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
