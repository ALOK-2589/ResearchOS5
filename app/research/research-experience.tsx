"use client";

import {
  isResearchResponse,
  type ResearchResponse,
} from "@/lib/research-types";
import { useCallback, useEffect, useState } from "react";
import {
  ReportErrorState,
  ReportLoadingState,
  ResearchReport,
} from "./research-report";

const STAGES = [
  "Understand the topic",
  "Gather reliable sources",
  "Compare evidence",
  "Analyze trends",
  "Identify opportunities",
  "Generate report",
] as const;

const STAGE_MS = 1250;
const REVEAL_DELAY_MS = 500;
const TOTAL_LOADING_MS = STAGES.length * STAGE_MS;

type StageState = "pending" | "active" | "complete";
type FetchState = "idle" | "loading" | "success" | "error";

function StageIndicator({ state }: { state: StageState }) {
  if (state === "complete") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 transition-all duration-500">
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <span className="absolute h-5 w-5 animate-ping rounded-full bg-violet-400/20" />
        <span className="relative h-2 w-2 rounded-full bg-violet-400" />
      </span>
    );
  }

  return (
    <span className="h-5 w-5 shrink-0 rounded-full border border-zinc-700/80" />
  );
}

export function ResearchExperience({ topic }: { topic: string }) {
  const [stageStates, setStageStates] = useState<StageState[]>(() =>
    STAGES.map(() => "pending")
  );
  const [visibleStageCount, setVisibleStageCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [researchData, setResearchData] = useState<ResearchResponse | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchResearch = useCallback(async () => {
    setFetchState("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const error =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Failed to generate research report.";
        throw new Error(error);
      }

      if (!isResearchResponse(data)) {
        throw new Error("Received an invalid report from the server.");
      }

      setResearchData(data);
      setFetchState("success");
    } catch (error) {
      setResearchData(null);
      setFetchState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to generate research report."
      );
    }
  }, [topic]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleStageCount(index + 1);
          setStageStates((prev) =>
            prev.map((_, i) => {
              if (i < index) return "complete";
              if (i === index) return "active";
              return "pending";
            })
          );
        }, index * STAGE_MS)
      );
    });

    timers.push(
      setTimeout(() => {
        setStageStates(STAGES.map(() => "complete"));
      }, TOTAL_LOADING_MS)
    );

    timers.push(
      setTimeout(() => {
        setLoadingComplete(true);
      }, TOTAL_LOADING_MS + REVEAL_DELAY_MS)
    );

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (TOTAL_LOADING_MS / 50);
        return next >= 100 ? 100 : next;
      });
    }, 50);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressTimer);
    };
  }, []);

  useEffect(() => {
    if (!loadingComplete) return;
    fetchResearch();
  }, [loadingComplete, fetchResearch]);

  const showReportSection = loadingComplete;
  const statusLabel =
    fetchState === "success"
      ? "Research report"
      : loadingComplete
        ? "Finalizing report"
        : "Research in progress";

  return (
    <div className="app-surface min-h-full flex-1 bg-[#0a0a0b] text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(120,119,198,0.08),transparent)]"
      />

      <main className="relative mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-14">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          {statusLabel}
        </p>
        <h1 className="mb-10 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {topic}
        </h1>

        <div
          className={`overflow-hidden transition-all duration-700 ease-out ${
            showReportSection
              ? "pointer-events-none mb-0 max-h-0 opacity-0"
              : "mb-10 max-h-[600px] opacity-100"
          }`}
        >
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                </span>
                Analyzing
              </span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 animate-pulse bg-white/20" />
              </div>
            </div>
          </div>

          <h2 className="mb-5 text-lg font-semibold tracking-tight text-white">
            Research Blueprint
          </h2>
          <ul className="space-y-4" aria-live="polite" aria-busy={!showReportSection}>
            {STAGES.slice(0, visibleStageCount).map((label, index) => {
              const state = stageStates[index];
              return (
                <li
                  key={label}
                  className="flex animate-[fadeSlideIn_0.5s_ease-out_both] items-center gap-3"
                >
                  <StageIndicator state={state} />
                  <span
                    className={`text-sm transition-colors duration-500 sm:text-base ${
                      state === "active"
                        ? "font-medium text-white"
                        : state === "complete"
                          ? "text-zinc-500"
                          : "text-zinc-400"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className={`transition-all duration-700 ease-out ${
            showReportSection
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          {showReportSection && fetchState === "loading" && <ReportLoadingState />}
          {showReportSection && fetchState === "error" && errorMessage && (
            <ReportErrorState message={errorMessage} onRetry={fetchResearch} />
          )}
          {showReportSection && fetchState === "success" && researchData && (
            <ResearchReport data={researchData} topic={topic} />
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media print {
          @page {
            margin: 18mm;
          }

          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          .print-report,
          .print-report * {
            visibility: visible;
          }

          .print-report {
            position: absolute;
            inset: 0;
            width: 100%;
            color: #18181b !important;
          }

          .no-print {
            display: none !important;
          }

          .print-report article,
          .print-report section {
            break-inside: avoid;
            border-color: #d4d4d8 !important;
            background: white !important;
            box-shadow: none !important;
          }

          .print-report button {
            color: #18181b !important;
          }

          .print-report .report-section-body {
            grid-template-rows: 1fr !important;
            opacity: 1 !important;
          }

          .print-report .report-section-body > div {
            overflow: visible !important;
          }

          .print-report p,
          .print-report li,
          .print-report dd,
          .print-report dt,
          .print-report h2,
          .print-report h3,
          .print-report a,
          .print-report span {
            color: #27272a !important;
          }
        }
      `}</style>
    </div>
  );
}
