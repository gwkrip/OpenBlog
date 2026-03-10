"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, PenSquare, ArrowRight } from "lucide-react";
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); setSearchOpen(false); }, [pathname]);

  // Trap body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/blog?q=${encodeURIComponent(query)}`;
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/categories", label: "Topics" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-paper/96 backdrop-blur-md border-b border-[var(--border)]"
            : "bg-paper border-b border-[var(--border)]"
        )}
        style={scrolled ? { boxShadow: "0 1px 12px rgba(0,0,0,0.05)" } : {}}
      >
        <div className="container-editorial">
          <div className="flex items-center justify-between h-[60px]">
            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-2 group" aria-label="Home">
              <span className="font-serif font-black text-xl tracking-tight group-hover:text-accent transition-colors duration-200">
                {settings?.siteName || "OpenBlog"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-110 transition-transform" aria-hidden />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-sm transition-all duration-150",
                    pathname === link.href
                      ? "text-accent bg-[var(--accent-light)]"
                      : "text-ink-muted hover:text-ink hover:bg-[var(--paper-warm)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  "p-2.5 rounded-sm transition-all duration-150",
                  searchOpen
                    ? "text-accent bg-[var(--accent-light)]"
                    : "text-ink-muted hover:text-accent hover:bg-[var(--paper-warm)]"
                )}
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                <Search size={17} />
              </button>
              <Link
                href="/admin/new"
                className="hidden md:inline-flex btn-primary btn-sm gap-1.5 ml-2"
              >
                <PenSquare size={13} />
                Write
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2.5 rounded-sm text-ink-muted hover:text-ink hover:bg-[var(--paper-warm)] transition-all"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-[var(--border)] bg-[var(--paper-warm)] animate-fade-in">
            <div className="container-editorial py-3">
              <form onSubmit={handleSearch} className="flex gap-2 items-center">
                <Search size={16} className="text-ink-faint flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search articles, topics..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-ink placeholder:text-ink-faint font-sans py-1"
                />
                {query && (
                  <button type="submit" className="btn-primary btn-sm gap-1">
                    Search
                    <ArrowRight size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setQuery(""); }}
                  className="btn-ghost btn-sm text-xs"
                >
                  <X size={14} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Category bar */}
        {categories.length > 0 && !searchOpen && (
          <div className="border-t border-[var(--border)] hidden md:block bg-paper">
            <div className="container-editorial">
              <div className="flex items-center gap-0 h-9 overflow-x-auto no-scrollbar">
                {categories.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={cn(
                      "px-3 h-full inline-flex items-center text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap transition-all duration-150 border-b-2",
                      pathname === `/categories/${cat.slug}`
                        ? "text-accent border-accent"
                        : "text-ink-faint border-transparent hover:text-ink-muted hover:border-[var(--border-strong)]"
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

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 z-50 bg-paper md:hidden flex flex-col",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ boxShadow: "-12px 0 40px rgba(0,0,0,0.12)" }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <span className="font-serif font-black text-lg">{settings?.siteName || "OpenBlog"}</span>
          <button onClick={() => setOpen(false)} className="p-2 text-ink-muted hover:text-ink rounded-sm transition-colors">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all",
                pathname === link.href
                  ? "text-accent bg-[var(--accent-light)]"
                  : "text-ink-muted hover:text-ink hover:bg-[var(--paper-warm)]"
              )}
            >
              {link.label}
              {pathname === link.href && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </Link>
          ))}
          {categories.length > 0 && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Topics</p>
              </div>
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-ink-subtle hover:text-ink hover:bg-[var(--paper-warm)] transition-all"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="p-5 border-t border-[var(--border)]">
          <Link href="/admin/new" className="btn-primary w-full gap-2">
            <PenSquare size={15} />
            Start Writing
          </Link>
        </div>
      </div>
    </>
  );
}
