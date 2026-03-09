import Link from "next/link";
import { Twitter, Github, Linkedin, Rss } from "lucide-react";

interface Props {
  settings: any;
  categories: any[];
}

export function Footer({ settings, categories }: Props) {
  return (
    <footer className="bg-ink text-paper mt-auto">
      <div className="container-editorial py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif font-black text-2xl">{settings?.siteName || "OpenBlog"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
            <p className="text-paper/60 text-sm leading-relaxed max-w-xs">
              {settings?.siteDesc || "A modern open blog platform built with Next.js"}
            </p>
            <div className="flex items-center gap-4 mt-6">
              {settings?.socialTwitter && (
                <a href={`https://twitter.com/${settings.socialTwitter}`} target="_blank" rel="noopener" aria-label="Twitter" className="text-paper/40 hover:text-accent transition-colors">
                  <Twitter size={18} />
                </a>
              )}
              {settings?.socialGithub && (
                <a href={`https://github.com/${settings.socialGithub}`} target="_blank" rel="noopener" aria-label="GitHub" className="text-paper/40 hover:text-accent transition-colors">
                  <Github size={18} />
                </a>
              )}
              {settings?.socialLinkedin && (
                <a href={`https://linkedin.com/in/${settings.socialLinkedin}`} target="_blank" rel="noopener" aria-label="LinkedIn" className="text-paper/40 hover:text-accent transition-colors">
                  <Linkedin size={18} />
                </a>
              )}
              <a href="/feed.xml" aria-label="RSS Feed" className="text-paper/40 hover:text-accent transition-colors">
                <Rss size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-paper/40 mb-6">Navigate</h3>
            <ul className="space-y-3">
              {["/", "/blog", "/categories", "/about"].map((href) => {
                const label = href === "/" ? "Home" : href.slice(1).charAt(0).toUpperCase() + href.slice(2);
                return (
                  <li key={href}>
                    <Link href={href} className="text-sm text-paper/60 hover:text-accent transition-colors">
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-paper/40 mb-6">Topics</h3>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-paper/60 hover:text-accent transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-paper/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper/30">
            {settings?.footerText ||
              `© ${new Date().getFullYear()} ${settings?.siteName || "OpenBlog"}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xs text-paper/30 hover:text-accent transition-colors">
              Admin
            </Link>
            <a href="/sitemap.xml" className="text-xs text-paper/30 hover:text-accent transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
