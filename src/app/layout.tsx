import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DbStatusPill } from "@/components/hub/DbStatusPill";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Teaching Hub",
    template: "%s · The Teaching Hub",
  },
  description:
    "Hub interattivo per architetture software, pattern e sicurezza — know-how da senior a junior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="flex min-h-full flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              The Teaching Hub
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/learn"
                className="hidden text-xs font-medium text-zinc-600 hover:text-zinc-900 sm:inline dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Percorso
              </Link>
              <DbStatusPill />
            </div>
          </header>
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
