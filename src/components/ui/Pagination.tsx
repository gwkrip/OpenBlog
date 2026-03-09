import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ page, totalPages, baseUrl, searchParams = {} }: Props) {
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(p) });
    return `${baseUrl}?${params}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
  );

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      <Link
        href={buildUrl(page - 1)}
        className={cn("btn-ghost p-2", page <= 1 && "pointer-events-none opacity-30")}
        aria-disabled={page <= 1}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <span key={p} className="flex items-center gap-2">
            {prev && p - prev > 1 && <span className="text-ink-subtle px-1">…</span>}
            <Link
              href={buildUrl(p)}
              className={cn(
                "w-9 h-9 flex items-center justify-center text-sm rounded-sm transition-colors",
                p === page
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:bg-paper-warm"
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildUrl(page + 1)}
        className={cn("btn-ghost p-2", page >= totalPages && "pointer-events-none opacity-30")}
        aria-disabled={page >= totalPages}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
