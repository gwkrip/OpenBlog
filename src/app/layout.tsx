import type { Metadata } from "next";
import "@/styles/globals.css";
import { prisma } from "@/lib/prisma";
import { Providers } from "@/components/Providers";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } }).catch(() => null);
  return {
    title: {
      default: settings?.siteName || "OpenBlog",
      template: `%s | ${settings?.siteName || "OpenBlog"}`,
    },
    description: settings?.siteDesc || "A modern open blog platform",
    metadataBase: new URL(settings?.siteUrl || "http://localhost:3000"),
    openGraph: { type: "website", locale: "en_US", siteName: settings?.siteName || "OpenBlog" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-paper font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
