import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-4 h-4 border-[1.5px]", md: "w-6 h-6 border-2", lg: "w-9 h-9 border-[2.5px]" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizes[size],
        className
      )}
      style={{ animation: "spin 0.7s linear infinite" }}
    />
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label="Loading">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-current opacity-70"
          style={{ animation: `pulse 1.2s ${delay}ms ease-in-out infinite` }}
        />
      ))}
    </span>
  );
}
