import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
  query?: string;
}

export function Pagination({ page, totalPages, baseUrl, searchParams = {}, query }: Props) {
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(p) });
    if (query) params.set("q", query.replace("q=", ""));
    return `${baseUrl}?${params}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={buildUrl(page - 1)}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border)] bg-white text-ink-subtle hover:text-accent hover:border-accent transition-all",
          page <= 1 && "pointer-events-none opacity-30"
        )}
        aria-disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </Link>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <span key={p} className="flex items-center gap-1">
            {prev && p - prev > 1 && (
              <span className="w-9 h-9 flex items-center justify-center text-ink-faint text-sm">…</span>
            )}
            <Link
              href={buildUrl(p)}
              className={cn(
                "w-9 h-9 flex items-center justify-center text-sm rounded-md border transition-all font-medium",
                p === page
                  ? "bg-ink text-paper border-ink"
                  : "bg-white border-[var(--border)] text-ink-muted hover:border-accent hover:text-accent"
              )}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildUrl(page + 1)}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border)] bg-white text-ink-subtle hover:text-accent hover:border-accent transition-all",
          page >= totalPages && "pointer-events-none opacity-30"
        )}
        aria-disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={15} />
      </Link>
    </nav>
  );
}
