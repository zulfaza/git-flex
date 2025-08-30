import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      className="mt-10 mx-auto w-full max-w-2xl rounded-lg border border-slate-700/70 bg-slate-950/60 p-4 font-mono shadow-lg"
    >
      <label htmlFor="github-url" className="sr-only">
        GitHub Profile URL or Username
      </label>
      <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center">
        <div className="flex w-full flex-1 items-center gap-2 rounded-md border border-slate-700/70 bg-slate-900/70 px-3 py-2 focus-within:border-cyan-500/70">
          <input
            id="github-url"
            name="github-url"
            type="text"
            autoComplete="off"
            placeholder="https://github.com/your-username or username"
            required
            className="w-full bg-transparent py-1 text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="relative inline-flex items-center justify-center gap-2 rounded-md border border-cyan-500/40 bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-700/30 transition hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 active:scale-[0.98]"
        >
          Run
          <span className="absolute inset-0 -z-10 rounded-md opacity-0 blur transition group-hover:opacity-100" />
        </button>
      </div>
      <p className="mt-3 text-left text-[11px] text-slate-500">
        We only fetch public contributions. Nothing is stored.
      </p>
    </form>
  );
}
