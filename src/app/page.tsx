import type { Metadata } from "next";
import Link from "next/link";

import Form from "@/components/Form";
import { Badge } from "../components/retroui/Badge";

export const metadata: Metadata = {
  title: "GitFlex",
  description: "GitFlex is a calendar for GitHub contributions",
};

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <header className="absolute left-0 top-0 z-20 w-full px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-lg font-head font-bold tracking-wide text-foreground hover:text-primary transition-colors"
          >
            GitFlex
          </Link>
        </div>
      </header>

      <div className="text-center">
        <h1 className="mt-6 flex flex-col items-center justify-center gap-3 text-balance font-head font-bold tracking-tight">
          <span className="block text-4xl">Flex your</span>
          <Badge variant="surface" className="text-7xl">
            Contribution
          </Badge>
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-pretty font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          Paste your GitHub profile URL and instantly explore a flexible
          contribution calendar. Tweak layout, colors and export it for your
          portfolio or README.
        </p>
      </div>

      <Form />

      <footer className="mt-16 flex flex-col items-center gap-4 text-xs text-muted-foreground md:flex-row md:justify-center font-sans">
        <span>© {new Date().getFullYear()} GitFlex</span>
        <span className="hidden md:inline">•</span>
        <Link
          href="https://github.com"
          className="transition-colors hover:text-foreground border-b border-transparent hover:border-current"
        >
          Github
        </Link>
      </footer>

      <RetroDecorations />
    </div>
  );
}

function RetroDecorations() {
  return (
    <>
      <div className="pointer-events-none absolute -left-16 top-32 h-32 w-32 border-4 border-primary/20 shadow-xl" />
      <div className="pointer-events-none absolute bottom-32 -right-16 h-24 w-24 border-4 border-accent/30 shadow-lg" />
      <div className="pointer-events-none absolute top-1/2 left-8 h-8 w-8 border-2 border-secondary/40 shadow-md" />
    </>
  );
}
