import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GitFlex",
  description: "GitFlex is a calendar for GitHub contributions",
};

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <header className="absolute left-0 top-0 z-20 w-full px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-wide text-slate-200 hover:text-white">
            GitFlex
          </Link>
        </div>
      </header>
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-32 pb-24 text-center md:pt-40">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 px-4 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Live GitHub contribution visualizer
        </div>
        <h1 className="mt-8 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Your GitHub year
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent"> visualized</span>
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg">
          Paste your GitHub profile URL and instantly explore a flexible contribution calendar. Tweak layout, colors and export it for your portfolio or README.
        </p>

        <Form />

        <div className="mt-14 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <Feature
            title="Instant preview"
            desc="See a contribution grid immediately without auth."
          />
          <Feature
            title="Flexible layout"
            desc="Switch orientation & square size easily."
          />
          <Feature
            title="Color themes"
            desc="Pick from curated palettes or define your own."
          />
          <Feature
            title="Export ready"
            desc="Generate crisp SVG assets for sharing anywhere."
          />
        </div>

        <footer className="mt-24 flex flex-col items-center gap-4 text-xs text-slate-500 md:flex-row">
          <span>© {new Date().getFullYear()} GitFlex</span>
          <span className="hidden md:inline">•</span>
          <Link
            href="https://github.com"
            className="transition-colors hover:text-slate-300"
          >
            Star project
          </Link>
        </footer>
      </div>
      <Gradients />
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm transition-colors hover:border-slate-600">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 [background:radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_70%)] transition-opacity" />
      <h3 className="relative text-sm font-semibold text-slate-100">{title}</h3>
      <p className="relative mt-1 text-xs leading-relaxed text-slate-400">
        {desc}
      </p>
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

function Form() {
  async function action(formData: FormData) {
    "use server";
    const raw = (formData.get("github-url") as string | undefined)?.trim();
    if (!raw) return;
    try {
      const hasProtocol = /^https?:\/\//i.test(raw);
      const url = new URL(hasProtocol ? raw : `https://github.com/${raw}`);
      if (url.hostname !== "github.com") return;
      const segments = url.pathname.split("/").filter(Boolean);
      if (!segments[0]) return;
      redirect(`/${segments[0]}`);
    } catch (e) {
      console.error("Invalid URL", e);
    }
  }

  return (
    <form
      action={action}
      className="mt-10 w-full max-w-xl rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-xl backdrop-blur-md"
    >
      <label
        htmlFor="github-url"
        className="mb-2 block text-left text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        GitHub Profile URL or Username
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="github-url"
          name="github-url"
          type="text"
          autoComplete="off"
          placeholder="https://github.com/octocat or octocat"
          required
          className="w-full flex-1 rounded-md border border-slate-600/70 bg-slate-900/60 px-3 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
        />
        <button
          type="submit"
          className="group relative inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 active:scale-[0.98]"
        >
          <span>Visualize</span>
          <span className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-blue-500/0 opacity-0 blur-md transition group-hover:opacity-100" />
        </button>
      </div>
      <p className="mt-3 text-left text-[11px] text-slate-500">
        We only fetch public contributions. Nothing is stored.
      </p>
    </form>
  );
}
