"use client";

import { ToastProvider } from "@/components/ui/Toast";

/**
 * Providers wrapper — the recommended Next.js App Router pattern for
 * placing React Context providers in a Server Component layout.
 * All "use client" providers must be inside this component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
