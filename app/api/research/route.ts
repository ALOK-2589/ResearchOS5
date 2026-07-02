import { NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const TAVILY_URL = "https://api.tavily.com/search";
const MODEL = "openai/gpt-4o-mini";

export async function POST(request: Request) {
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const tavilyKey = process.env.TAVILY_API_KEY;

    if (!openRouterKey) {
      return NextResponse.json({ error: "Missing OpenRouter API key." }, { status: 500 });
    }

    if (!tavilyKey) {
      return NextResponse.json({ error: "Missing Tavily API key." }, { status: 500 });
    }

    const body = await request.json();
    const topic = body?.topic?.trim();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 });
    }

    const tavilyResponse = await fetch(TAVILY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tavilyKey}`,
      },
      body: JSON.stringify({
        query: topic,
        search_depth: "advanced",
        max_results: 5,
        include_answer: false,
        include_raw_content: false,
      }),
    });

    if (!tavilyResponse.ok) {
      const details = await tavilyResponse.text();
      return NextResponse.json({ error: "Tavily search failed.", details }, { status: 502 });
    }

    const tavilyData = await tavilyResponse.json();

    const sources =
      tavilyData.results?.map((item: any) => ({
        title: item.title ?? "Untitled Source",
        url: item.url ?? "",
        content: item.content ?? "",
      })) ?? [];

    const sourceText = sources
      .map(
        (source: any, index: number) =>
          `[${index + 1}] ${source.title}\nURL: ${source.url}\nSnippet: ${source.content}`
      )
      .join("\n\n");

    const prompt = `
You are ResearchOS, an expert AI research analyst.

Research topic:
${topic}

Use ONLY the sources below as much as possible. Cite source numbers like [1], [2], [3].
Compare claims across all sources and identify meaningful contradictions or conflicting evidence. Do not invent conflicts. If none exist, return an empty contradictions array.

Sources:
${sourceText}

Return ONLY valid JSON with this exact structure:

{
  "researchPlan": ["step 1", "step 2", "step 3", "step 4"],
  "executiveSummary": "2 detailed paragraphs with citations like [1]",
  "keyFindings": ["finding with citation [1]", "finding with citation [2]"],
  "statistics": ["stat with citation [1]", "stat with citation [2]"],
  "opportunities": ["opportunity with citation [1]"],
  "risks": ["risk with citation [2]"],
  "futureTrends": ["trend with citation [3]"],
  "contradictions": [{
    "topic": "Market Size",
    "sourceA": "Reuters",
    "claimA": "Market size estimated at $18B in 2025.",
    "sourceB": "Industry Report",
    "claimB": "Market size estimated at $21B in 2025.",
    "reason": "Different methodologies and datasets.",
    "confidence": "Medium"
  }],
  "references": ["[1] Source title - URL", "[2] Source title - URL"]
}
`;

    const aiResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ResearchOS",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.25,
      }),
    });

    if (!aiResponse.ok) {
      const details = await aiResponse.text();
      return NextResponse.json({ error: "OpenRouter failed.", details }, { status: 502 });
    }

    const aiData = await aiResponse.json();
    const raw = aiData?.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: "Empty AI response." }, { status: 502 });
    }

    let parsed: any;

    try {
      parsed = JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch {
      return NextResponse.json({ error: "Invalid JSON from AI.", raw }, { status: 502 });
    }

    const normalized = {
      researchPlan: Array.isArray(parsed.researchPlan) ? parsed.researchPlan : [],
      executiveSummary: parsed.executiveSummary ?? "",
      keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings : [],
      statistics: Array.isArray(parsed.statistics) ? parsed.statistics : [],
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      futureTrends: Array.isArray(parsed.futureTrends) ? parsed.futureTrends : [],
      contradictions: Array.isArray(parsed.contradictions)
        ? parsed.contradictions
            .filter(
              (item: any) =>
                item &&
                typeof item.topic === "string" &&
                typeof item.sourceA === "string" &&
                typeof item.claimA === "string" &&
                typeof item.sourceB === "string" &&
                typeof item.claimB === "string" &&
                typeof item.reason === "string"
            )
            .map((item: any) => ({
              topic: item.topic,
              sourceA: item.sourceA,
              claimA: item.claimA,
              sourceB: item.sourceB,
              claimB: item.claimB,
              reason: item.reason,
              confidence: ["High", "Medium", "Low"].includes(item.confidence)
                ? item.confidence
                : "Medium",
            }))
        : [],
      references: Array.isArray(parsed.references) ? parsed.references : [],
      sources,
    };

    return NextResponse.json({
      ...normalized,
      report: {
        executiveSummary: normalized.executiveSummary,
        keyFindings: normalized.keyFindings,
        statistics: normalized.statistics,
        opportunities: normalized.opportunities,
        risks: normalized.risks,
        futureTrends: normalized.futureTrends,
        contradictions: normalized.contradictions,
        references: normalized.references,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
