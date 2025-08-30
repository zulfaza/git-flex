"use client"

import { useRouter } from "next/navigation"

export default function Form() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const raw = (formData.get("github-url") as string | undefined)?.trim()
    const fromDate = (formData.get("from-date") as string | undefined)?.trim()
    const toDate = (formData.get("to-date") as string | undefined)?.trim()
    
    if (!raw) return
    
    try {
      const hasProtocol = /^https?:\/\//i.test(raw)
      const url = new URL(hasProtocol ? raw : `https://github.com/${raw}`)
      if (url.hostname !== "github.com") return
      const segments = url.pathname.split("/").filter(Boolean)
      if (!segments[0]) return
      
      const searchParams = new URLSearchParams()
      if (fromDate) searchParams.set("from", fromDate)
      if (toDate) searchParams.set("to", toDate)
      
      const queryString = searchParams.toString()
      const path = `/${segments[0]}${queryString ? `?${queryString}` : ""}`
      router.push(path)
    } catch (e) {
      console.error("Invalid URL", e)
    }
  }

  const currentDate = new Date()
  const oneYearAgo = new Date(currentDate)
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1)

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 mx-auto w-full max-w-2xl rounded-lg border border-slate-700/70 bg-slate-950/60 p-4 font-mono shadow-lg"
    >
      <label htmlFor="github-url" className="sr-only">
        GitHub Profile URL or Username
      </label>
      <div className="flex flex-col gap-3 text-sm">
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
        
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="flex-1">
            <label htmlFor="from-date" className="block text-xs text-slate-400 mb-1">
              From Date (optional)
            </label>
            <input
              id="from-date"
              name="from-date"
              type="date"
              defaultValue={formatDate(oneYearAgo)}
              className="w-full rounded-md border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500/70"
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="to-date" className="block text-xs text-slate-400 mb-1">
              To Date (optional)
            </label>
            <input
              id="to-date"
              name="to-date"
              type="date"
              defaultValue={formatDate(currentDate)}
              className="w-full rounded-md border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500/70"
            />
          </div>
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
        We only fetch public contributions. Nothing is stored. Leave dates empty for last year.
      </p>
    </form>
  )
}