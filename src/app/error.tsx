"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <p className="font-serif font-black text-8xl leading-none text-[var(--border)] select-none mb-4">
          500
        </p>
        <h1 className="heading-display text-2xl mb-3">Something went wrong</h1>
        <p className="text-ink-subtle mb-8 text-sm">
          An unexpected error occurred. You can try again or return home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-outline">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
