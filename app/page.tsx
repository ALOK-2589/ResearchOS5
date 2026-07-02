"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EXAMPLE_PROMPTS = [
  "Compare the latest LLM benchmarks for coding tasks",
  "Summarize recent breakthroughs in fusion energy",
  "What are the best practices for RAG in production?",
  "Explain the tradeoffs between microservices and monoliths",
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/research?topic=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="app-surface relative flex min-h-full flex-1 flex-col overflow-hidden bg-[#0a0a0b] text-zinc-100">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(56,189,248,0.06),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(10,10,11,0.4)_70%)]"
      />

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 sm:px-10 sm:pt-12">
        <div className="w-full max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI-powered research, instantly
          </div>

          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            ResearchOS
          </h1>
          <p className="mx-auto mb-10 max-w-lg text-base text-zinc-400 sm:text-lg sm:leading-relaxed">
            The fastest way to research anything
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl transition-colors focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-700">
              <label htmlFor="research-query" className="sr-only">
                What do you want to research?
              </label>
              <textarea
                id="research-query"
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to research?"
                className="w-full resize-none bg-transparent px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none sm:text-lg"
              />
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-2">
                <div className="hidden items-center gap-2 text-xs text-zinc-600 sm:flex">
                  <kbd className="rounded border border-zinc-700 bg-zinc-800/80 px-1.5 py-0.5 font-mono text-zinc-500">
                    ↵
                  </kbd>
                  <span>to start</span>
                </div>
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="ml-auto inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
                >
                  Start Research
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          {/* Example prompts */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-600">
              Try an example
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuery(prompt)}
                  className="rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-left text-sm text-zinc-400 transition-all hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-zinc-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 px-6 py-5 text-center text-xs text-zinc-600 sm:px-10">
        © {new Date().getFullYear()} ResearchOS. Research smarter, not harder.
      </footer>
    </div>
  );
}
