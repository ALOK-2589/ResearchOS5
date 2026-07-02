export type ResearchReportData = {
  executiveSummary: string;
  keyFindings: string[];
  statistics: string[];
  opportunities: string[];
  risks: string[];
  futureTrends: string[];
  references: string[];
  contradictions: ResearchContradiction[];
};

export type ResearchContradiction = {
  topic: string;
  sourceA: string;
  claimA: string;
  sourceB: string;
  claimB: string;
  reason: string;
  confidence: "High" | "Medium" | "Low";
};

export type ResearchSource = {
  title: string;
  url: string;
  content: string;
};

export type ResearchResponse = {
  researchPlan: string[];
  report: ResearchReportData;
  sources: ResearchSource[];
};

export type ResearchRequest = {
  topic: string;
};

export type ResearchErrorResponse = {
  error: string;
};

export function isResearchReportData(value: unknown): value is ResearchReportData {
  if (!value || typeof value !== "object") return false;

  const report = value as Record<string, unknown>;
  if (typeof report.executiveSummary !== "string") return false;

  const arrayFields: (keyof Omit<ResearchReportData, "executiveSummary" | "contradictions">)[] = [
    "keyFindings",
    "statistics",
    "opportunities",
    "risks",
    "futureTrends",
    "references",
  ];

  const stringArraysAreValid = arrayFields.every(
    (field) =>
      Array.isArray(report[field]) &&
      (report[field] as unknown[]).every((item) => typeof item === "string")
  );

  if (!stringArraysAreValid || !Array.isArray(report.contradictions)) return false;

  return report.contradictions.every((contradiction) => {
    if (!contradiction || typeof contradiction !== "object") return false;
    const item = contradiction as Record<string, unknown>;
    return (
      typeof item.topic === "string" &&
      typeof item.sourceA === "string" &&
      typeof item.claimA === "string" &&
      typeof item.sourceB === "string" &&
      typeof item.claimB === "string" &&
      typeof item.reason === "string" &&
      (item.confidence === "High" ||
        item.confidence === "Medium" ||
        item.confidence === "Low")
    );
  });
}

export function isResearchResponse(value: unknown): value is ResearchResponse {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, unknown>;
  if (
    !Array.isArray(data.researchPlan) ||
    !data.researchPlan.every((item) => typeof item === "string")
  ) {
    return false;
  }

  if (!isResearchReportData(data.report) || !Array.isArray(data.sources)) {
    return false;
  }

  return data.sources.every((source) => {
    if (!source || typeof source !== "object") return false;
    const item = source as Record<string, unknown>;
    return (
      typeof item.title === "string" &&
      typeof item.url === "string" &&
      typeof item.content === "string"
    );
  });
}

export function extractJsonContent(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1].trim() : trimmed;
}
