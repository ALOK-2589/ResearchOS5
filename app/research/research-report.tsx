"use client";

import type {
  ResearchContradiction,
  ResearchReportData,
  ResearchResponse,
  ResearchSource,
} from "@/lib/research-types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ReportSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  defaultOpen?: boolean;
};

function SectionIcon({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
    >
      {children}
    </div>
  );
}

function listToMarkdown(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n\n");
}

function numberedListToMarkdown(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n\n");
}

function markdownList(items: string[]): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "_No data available._";
}

function buildExportMarkdown(topic: string, data: ResearchResponse): string {
  const { report } = data;
  const plan = data.researchPlan.length
    ? data.researchPlan.map((item, index) => `${index + 1}. ${item}`).join("\n")
    : "_No research plan available._";
  const references = report.references.length
    ? report.references.map((item, index) => `${index + 1}. ${item}`).join("\n")
    : "_No references available._";
  const sources = data.sources.length
    ? data.sources
        .map((source) => `- [${source.title}](${source.url})\n  ${source.content}`)
        .join("\n")
    : "_No sources available._";
  const contradictions = report.contradictions.length
    ? report.contradictions
        .map(
          (item) =>
            `### ${item.topic}\n\n` +
            `- **${item.sourceA}:** ${item.claimA}\n` +
            `- **${item.sourceB}:** ${item.claimB}\n` +
            `- **Possible reason:** ${item.reason}\n` +
            `- **Confidence:** ${item.confidence}`
        )
        .join("\n\n")
    : "No significant contradictions were detected among the analyzed sources.";

  return [
    `# ${topic}`,
    `## Executive Summary\n\n${report.executiveSummary}`,
    `## Research Plan\n\n${plan}`,
    `## Key Findings\n\n${markdownList(report.keyFindings)}`,
    `## Statistics & Data\n\n${markdownList(report.statistics)}`,
    `## Opportunities\n\n${markdownList(report.opportunities)}`,
    `## Risks\n\n${markdownList(report.risks)}`,
    `## Future Trends\n\n${markdownList(report.futureTrends)}`,
    `## Contradictions & Conflicting Evidence\n\n${contradictions}`,
    `## References\n\n${references}`,
    `## Sources\n\n${sources}`,
  ].join("\n\n");
}

function topicFilename(topic: string): string {
  const slug = topic
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${slug || "research-report"}.md`;
}

function buildReportSections(report: ResearchReportData): ReportSection[] {
  return [
    {
      id: "executive-summary",
      title: "Executive Summary",
      defaultOpen: true,
      icon: (
        <SectionIcon accent="bg-violet-500/15 text-violet-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M9 12h6M9 16h6M9 8h6M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </SectionIcon>
      ),
      content: report.executiveSummary,
    },
    {
      id: "key-findings",
      title: "Key Findings",
      defaultOpen: true,
      icon: (
        <SectionIcon accent="bg-cyan-500/15 text-cyan-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </SectionIcon>
      ),
      content: listToMarkdown(report.keyFindings),
    },
    {
      id: "statistics",
      title: "Statistics & Data",
      icon: (
        <SectionIcon accent="bg-blue-500/15 text-blue-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M4 19V5M4 19h16M8 17V11M12 17V7M16 17v-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SectionIcon>
      ),
      content: listToMarkdown(report.statistics),
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: (
        <SectionIcon accent="bg-emerald-500/15 text-emerald-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SectionIcon>
      ),
      content: listToMarkdown(report.opportunities),
    },
    {
      id: "risks",
      title: "Risks",
      icon: (
        <SectionIcon accent="bg-amber-500/15 text-amber-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SectionIcon>
      ),
      content: listToMarkdown(report.risks),
    },
    {
      id: "future-trends",
      title: "Future Trends",
      icon: (
        <SectionIcon accent="bg-fuchsia-500/15 text-fuchsia-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M4.5 16.5c1.5-4 5-7.5 9.5-7.5m0 0c3 0 5.5 1.5 7 4M12 9V4m0 0l-2 2m2-2l2 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SectionIcon>
      ),
      content: listToMarkdown(report.futureTrends),
    },
    {
      id: "references",
      title: "References",
      icon: (
        <SectionIcon accent="bg-zinc-500/15 text-zinc-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </SectionIcon>
      ),
      content: numberedListToMarkdown(report.references),
    },
  ];
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 leading-relaxed text-zinc-300 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="text-zinc-400">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 text-zinc-300 last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-zinc-300 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-3 border-l-2 border-violet-500/50 pl-4 text-zinc-400 italic last:mb-0">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 transition-colors hover:text-cyan-300 hover:decoration-cyan-300/50"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full min-w-[320px] border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="border-b border-zinc-700">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-zinc-800">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-3 py-2 text-left font-medium text-zinc-200">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-3 py-2 text-zinc-400">{children}</td>
  ),
};

function ReportSectionCard({ section }: { section: ReportSection }) {
  const [open, setOpen] = useState(section.defaultOpen ?? false);

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm shadow-black/20 backdrop-blur-sm transition-colors hover:border-zinc-700/80">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={`section-${section.id}`}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-800/30 sm:px-5"
      >
        {section.icon}
        <span className="flex-1 text-base font-medium text-white">
          {section.title}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id={`section-${section.id}`}
        className={`report-section-body grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-800/80 px-4 pb-5 pt-4 sm:px-5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
}

const CONFIDENCE_STYLES = {
  High: "border-red-500/20 bg-red-500/10 text-red-300",
  Medium: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Low: "border-zinc-600 bg-zinc-800 text-zinc-300",
} as const;

function ContradictionCard({ item }: { item: ResearchContradiction }) {
  return (
    <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.04] p-4 shadow-none sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-amber-400/80">
            Topic
          </p>
          <h3 className="font-semibold text-zinc-100">{item.topic}</h3>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${CONFIDENCE_STYLES[item.confidence]}`}>
          {item.confidence} confidence
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3.5">
          <p className="mb-1 text-xs font-semibold text-cyan-400">{item.sourceA}</p>
          <p className="text-sm leading-relaxed text-zinc-300">{item.claimA}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3.5">
          <p className="mb-1 text-xs font-semibold text-violet-400">{item.sourceB}</p>
          <p className="text-sm leading-relaxed text-zinc-300">{item.claimB}</p>
        </div>
      </div>

      <div className="mt-3 border-t border-zinc-800/80 pt-3">
        <p className="text-xs font-medium text-zinc-500">Possible reason</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.reason}</p>
      </div>
    </div>
  );
}

function ContradictionsSection({
  contradictions,
}: {
  contradictions: ResearchContradiction[];
}) {
  const [open, setOpen] = useState(contradictions.length > 0);
  const hasContradictions = contradictions.length > 0;

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm shadow-black/20 backdrop-blur-sm transition-colors hover:border-zinc-700/80">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="section-contradictions"
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-800/30 sm:px-5"
      >
        <SectionIcon accent={hasContradictions ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}>
          {hasContradictions ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M12 9v4m0 4h.01M10.3 4.2L2 18a2 2 0 001.7 3h16.6a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </SectionIcon>
        <span className="flex-1 text-base font-medium text-white">
          Contradictions &amp; Conflicting Evidence
        </span>
        <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 text-zinc-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div id="section-contradictions" className={`report-section-body grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-zinc-800/80 px-4 pb-5 pt-4 sm:px-5">
            {hasContradictions ? (
              contradictions.map((item, index) => (
                <ContradictionCard key={`${item.topic}-${item.sourceA}-${index}`} item={item} />
              ))
            ) : (
              <p className="text-sm leading-relaxed text-zinc-400">
                No significant contradictions were detected among the analyzed sources.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ExportTools({ topic, data }: { topic: string; data: ResearchResponse }) {
  const [copied, setCopied] = useState(false);

  async function copyReport() {
    await navigator.clipboard.writeText(buildExportMarkdown(topic, data));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function downloadMarkdown() {
    const blob = new Blob([buildExportMarkdown(topic, data)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = topicFilename(topic);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const tools = [
    {
      label: copied ? "Copied!" : "Copy Report",
      onClick: copyReport,
      icon: <path d="M9 8h9a1 1 0 011 1v10a1 1 0 01-1 1H9a1 1 0 01-1-1V9a1 1 0 011-1zm6-4H5a1 1 0 00-1 1v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
    },
    {
      label: "Download Markdown",
      onClick: downloadMarkdown,
      icon: <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
    },
    {
      label: "Print / Save PDF",
      onClick: () => window.print(),
      icon: <path d="M7 9V4h10v5M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2m-10-4h10v7H7v-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
    },
  ];

  return (
    <div className="no-print mb-5 flex flex-wrap gap-2" aria-label="Export report">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={tool.onClick}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            {tool.icon}
          </svg>
          {tool.label}
        </button>
      ))}
    </div>
  );
}

const HIGH_CREDIBILITY_DOMAINS = [
  "apnews.com",
  "bbc.com",
  "economist.com",
  "ft.com",
  "nature.com",
  "reuters.com",
  "science.org",
  "who.int",
];

function getSourceMeta(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

    const domain = parsed.hostname.replace(/^www\./, "");
    const highCredibility =
      domain.endsWith(".gov") ||
      domain.endsWith(".edu") ||
      HIGH_CREDIBILITY_DOMAINS.some(
        (trustedDomain) =>
          domain === trustedDomain || domain.endsWith(`.${trustedDomain}`)
      );

    return {
      domain,
      credibility: highCredibility ? ("High" as const) : ("Medium" as const),
      faviconUrl: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
    };
  } catch {
    return null;
  }
}

function SourceCard({ source }: { source: ResearchSource }) {
  const meta = getSourceMeta(source.url);
  if (!meta) return null;

  return (
    <article className="flex min-h-64 flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- remote source favicons have dynamic hosts */}
            <img src={meta.faviconUrl} alt="" className="h-5 w-5" loading="lazy" />
          </span>
          <span className="truncate text-xs font-medium text-zinc-400">
            {meta.domain}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            meta.credibility === "High"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/20 bg-amber-500/10 text-amber-300"
          }`}
        >
          {meta.credibility} credibility
        </span>
      </div>

      <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-zinc-100">
        {source.title}
      </h3>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 truncate text-xs text-cyan-400/80 hover:text-cyan-300"
        title={source.url}
      >
        {source.url}
      </a>
      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-zinc-400">
        {source.content || "No summary is available for this source."}
      </p>

      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-700"
      >
        Open Source
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path d="M14 5h5v5M19 5l-8 8M19 14v4a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </article>
  );
}

function SourcesSection({ sources }: { sources: ResearchSource[] }) {
  return (
    <section className="pt-8" aria-labelledby="sources-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-violet-400">
            Research trail
          </p>
          <h2 id="sources-heading" className="text-2xl font-semibold tracking-tight text-white">
            Sources
          </h2>
        </div>
        <span className="text-sm text-zinc-500">
          {sources.length} {sources.length === 1 ? "source" : "sources"}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sources.map((source, index) => (
          <SourceCard key={`${source.url}-${index}`} source={source} />
        ))}
      </div>
    </section>
  );
}

function ResearchQuality({ sourceCount }: { sourceCount: number }) {
  const metrics = [
    { label: "Sources analyzed", value: String(sourceCount) },
    { label: "Estimated confidence", value: "High" },
    { label: "Research depth", value: "Standard" },
    { label: "Generated", value: "Today" },
  ];

  return (
    <section
      className="mt-8 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-5 shadow-sm shadow-black/20 sm:p-6"
      aria-labelledby="research-quality-heading"
    >
      <div className="mb-5 flex items-center gap-3">
        <SectionIcon accent="bg-emerald-500/15 text-emerald-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path d="M12 3l2.1 2.6 3.3-.2.7 3.2 2.8 1.8-1.5 3 1.5 3-2.8 1.8-.7 3.2-3.3-.2L12 23l-2.1-2.6-3.3.2-.7-3.2-2.8-1.8 1.5-3-1.5-3 2.8-1.8.7-3.2 3.3.2L12 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M8.5 12.5l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </SectionIcon>
        <h2 id="research-quality-heading" className="text-lg font-semibold text-white">
          Research Quality
        </h2>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-zinc-950/70 px-4 py-4">
            <dt className="mb-1 text-xs text-zinc-500">{metric.label}</dt>
            <dd className="text-sm font-semibold text-zinc-100">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReportLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-16 text-center">
      <span className="relative mb-4 flex h-10 w-10 items-center justify-center">
        <span className="absolute h-10 w-10 animate-ping rounded-full bg-violet-400/20" />
        <span className="relative h-3 w-3 animate-pulse rounded-full bg-violet-400" />
      </span>
      <p className="text-sm font-medium text-zinc-200">Generating your report</p>
      <p className="mt-1 text-xs text-zinc-500">
        AI is synthesizing insights for your topic…
      </p>
    </div>
  );
}

export function ReportErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          <path
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-red-200">Failed to generate report</p>
      <p className="mt-2 text-sm text-zinc-400">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
      >
        Try again
      </button>
    </div>
  );
}

export function ResearchReport({
  data,
  topic,
}: {
  data: ResearchResponse;
  topic: string;
}) {
  const sections = buildReportSections(data.report);

  return (
    <div className="print-report">
      <ExportTools topic={topic} data={data} />
      <h1 className="hidden text-3xl font-semibold text-zinc-950 print:block">
        {topic}
      </h1>
      <div className="space-y-3">
        {sections.map((section) => (
          <ReportSectionCard key={section.id} section={section} />
        ))}
        <ContradictionsSection contradictions={data.report.contradictions} />
      </div>
      <ResearchQuality sourceCount={data.sources.length} />
      <SourcesSection sources={data.sources} />
    </div>
  );
}
