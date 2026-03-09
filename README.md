# OpenBlog

A modern, production-ready open blog platform built with Next.js 14, Prisma, and Tailwind CSS. Includes an AI writing assistant powered by Claude.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM + SQLite (easily swappable to PostgreSQL)
- NextAuth v5 (credentials auth)
- Tailwind CSS + @tailwindcss/typography
- MDX / next-mdx-remote
- Anthropic Claude API (AI assistant)

## Features

- Public blog with categories, tags, comments, and search
- RSS feed (/feed.xml) and sitemap (/sitemap.xml)
- Admin dashboard with post editor (Markdown)
- AI writing assistant (Claude integration)
- Comment moderation system
- SEO meta tags + Open Graph
- Responsive editorial design
- Post view counter
- Related posts

## Quick Start

1. Clone and install:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Edit .env and set:
- DATABASE_URL (default: SQLite file)
- NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
- ANTHROPIC_API_KEY (from console.anthropic.com)

3. Setup database:

```bash
npm run db:push
npm run db:seed
```

4. Start development:

```bash
npm run dev
```

5. Visit http://localhost:3000

## Default Admin Login

- Email: admin@openblog.dev
- Password: admin123456

Change immediately after first login!

## Production Deploy

```bash
npm run build
npm start
```

For production, switch DATABASE_URL to PostgreSQL in prisma/schema.prisma.

## Directory Structure

```
src/
  app/
    (blog)/          Public blog routes
    admin/           Admin panel routes
    api/             REST API endpoints
    login/           Auth pages
  components/
    blog/            Blog UI components
    layout/          Header, Footer
    admin/           Admin UI components
    ui/              Shared UI
  lib/               Prisma, auth, utils
  types/             TypeScript types
prisma/
  schema.prisma      Database schema
  seed.ts            Seed data
```

## AI System Instruction

The Claude AI instruction is stored in CLAUDE_SYSTEM_INSTRUCTION.txt and also embedded in /src/app/api/ai/generate/route.ts.
