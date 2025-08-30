import { Metadata } from "next";
import Link from "next/link";
import Form from "../components/Form";

export const metadata: Metadata = {
  title: "GitFlex",
  description: "GitFlex is a calendar for GitHub contributions",
};

export default function Home() {
  return (
    <div className="relative flex justify-center items-center flex-col min-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <header className="absolute left-0 top-0 z-20 w-full px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-slate-200 hover:text-white"
          >
            GitFlex
          </Link>
        </div>
      </header>
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />

      <div className="text-center">
        <h1 className="mt-6 text-balance font-sans text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">Your GitHub year</span>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            {" "}
            visualized
          </span>
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-pretty font-sans text-base leading-relaxed text-slate-300 md:text-lg">
          Paste your GitHub profile URL and instantly explore a flexible
          contribution calendar. Tweak layout, colors and export it for your
          portfolio or README.
        </p>
      </div>

      <Form />

      <footer className="mt-16 flex flex-col items-center gap-4 text-[11px] text-slate-500 md:flex-row md:justify-center">
        <span>© {new Date().getFullYear()} GitFlex</span>
        <span className="hidden md:inline">•</span>
        <Link
          href="https://github.com"
          className="transition-colors hover:text-slate-300"
        >
          Github
        </Link>
      </footer>

      <Gradients />
    </div>
  );
}

function Gradients() {
  return (
    <>
      <div className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 -right-32 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
    </>
  );
}


