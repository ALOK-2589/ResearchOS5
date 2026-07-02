"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
    >
      {children}
    </button>
  );
}

export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("researchos-theme");
    const dark = savedTheme
      ? savedTheme === "dark"
      : !window.matchMedia("(prefers-color-scheme: light)").matches;
    setIsDark(dark);
    document.documentElement.classList.toggle("light", !dark);
  }, []);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const topic = query.trim();
    if (!topic) return;
    router.push(`/research?topic=${encodeURIComponent(topic)}`);
    setQuery("");
  }

  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    localStorage.setItem("researchos-theme", nextDark ? "dark" : "light");
  }

  return (
    <header className="global-navbar no-print sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0a0a0b]/85 px-4 py-3 text-zinc-100 shadow-sm shadow-black/10 backdrop-blur-xl sm:px-6 lg:px-10">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 md:flex-nowrap" aria-label="Global navigation">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" aria-hidden>
              <path d="M12 3L4 9v12h16V9l-8-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden text-base font-semibold tracking-tight text-white sm:inline">
            ResearchOS
          </span>
        </Link>

        <form onSubmit={submitSearch} className="order-3 flex w-full min-w-0 md:order-none md:mx-auto md:max-w-xl" role="search">
          <label htmlFor="global-research-search" className="sr-only">Research anything</label>
          <div className="flex w-full items-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-1 transition-colors focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-violet-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="ml-2.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              id="global-research-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Research anything..."
              className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              Search
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hidden lg:inline">New Research</span>
          </Link>
          <IconButton label="History">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M4 12a8 8 0 108-8 8.1 8.1 0 00-5.7 2.3L4 8.5M4 4v4.5h4.5M12 8v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
          <IconButton label="Settings">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.2h-4V21a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 00.3-1.9A1.7 1.7 0 003 14H2.8v-4H3a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 009 4.6 1.7 1.7 0 0010 3V2.8h4V3a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.2v4H21a1.7 1.7 0 00-1.6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </IconButton>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                <path d="M20 15.5A8.5 8.5 0 018.5 4 8.5 8.5 0 1020 15.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
