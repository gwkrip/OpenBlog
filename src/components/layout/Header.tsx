"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  settings: any;
  categories: any[];
}

export function Header({ settings, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/blog?q=${encodeURIComponent(query)}`;
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-paper/95 backdrop-blur-sm shadow-sm" : "bg-paper"
      )}
    >
      <div className="border-b border-[var(--border)]">
        <div className="container-editorial">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif font-black text-2xl tracking-tight">
                {settings?.siteName || "OpenBlog"}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent"
                aria-hidden
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-accent"
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-ink-muted hover:text-accent transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <Link href="/admin" className="hidden md:block btn-primary text-xs px-4 py-2">
                Write
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 text-ink-muted"
                aria-label="Menu"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-b border-[var(--border)] bg-paper-warm animate-fade-in">
          <div className="container-editorial py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary">
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {open && (
        <div className="md:hidden border-b border-[var(--border)] bg-paper animate-fade-in">
          <nav className="container-editorial py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-medium py-1",
                  pathname === link.href ? "text-accent" : "text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="btn-primary self-start mt-2">
              Write
            </Link>
          </nav>
        </div>
      )}

      {categories.length > 0 && (
        <div className="border-b border-[var(--border)] bg-paper-warm hidden md:block">
          <div className="container-editorial">
            <div className="flex items-center gap-6 h-9 overflow-x-auto no-scrollbar">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className={cn(
                    "text-xs font-medium uppercase tracking-widest whitespace-nowrap transition-colors",
                    pathname === `/categories/${cat.slug}`
                      ? "text-accent"
                      : "text-ink-subtle hover:text-ink"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
