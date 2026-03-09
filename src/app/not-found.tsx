import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif font-black text-[10rem] leading-none text-[var(--border)] select-none">
          404
        </p>
        <h1 className="heading-display text-3xl mb-4 -mt-4">Page Not Found</h1>
        <p className="text-ink-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
