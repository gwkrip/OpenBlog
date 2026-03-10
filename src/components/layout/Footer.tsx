import Link from "next/link";
import { Twitter, Github, Linkedin, Rss, ArrowUpRight } from "lucide-react";

interface Props {
  settings: any;
  categories: any[];
}

export function Footer({ settings, categories }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white/60 mt-auto">
      <div className="container-editorial py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif font-black text-2xl text-white">
                {settings?.siteName || "OpenBlog"}
              </span>
              <span className="w-2 h-2 rounded-full bg-accent" />
            </div>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs mb-6">
              {settings?.siteDesc || "A modern open blog platform built with Next.js, Prisma, and Tailwind CSS."}
            </p>
            <div className="flex items-center gap-3">
              {settings?.socialTwitter && (
                <a
                  href={`https://twitter.com/${settings.socialTwitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 transition-all"
                >
                  <Twitter size={15} />
                </a>
              )}
              {settings?.socialGithub && (
                <a
                  href={`https://github.com/${settings.socialGithub}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 transition-all"
                >
                  <Github size={15} />
                </a>
              )}
              {settings?.socialLinkedin && (
                <a
                  href={`https://linkedin.com/in/${settings.socialLinkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 transition-all"
                >
                  <Linkedin size={15} />
                </a>
              )}
              <a
                href="/feed.xml"
                aria-label="RSS Feed"
                className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 transition-all"
              >
                <Rss size={15} />
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 mb-5">Navigate</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/blog", label: "Blog" },
                { href: "/categories", label: "Categories" },
                { href: "/about", label: "About" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/45 hover:text-accent transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 mb-5">Topics</h3>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-white/45 hover:text-accent transition-colors flex items-center gap-1.5 group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            {settings?.footerText || `© ${year} ${settings?.siteName || "OpenBlog"}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="text-xs text-white/25 hover:text-accent transition-colors flex items-center gap-1"
            >
              Admin
              <ArrowUpRight size={11} />
            </Link>
            <a
              href="/sitemap.xml"
              className="text-xs text-white/25 hover:text-accent transition-colors"
            >
              Sitemap
            </a>
            <a
              href="/feed.xml"
              className="text-xs text-white/25 hover:text-accent transition-colors"
            >
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
