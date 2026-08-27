import { createServerFn } from "@tanstack/react-start";
import { bandOf, clampScore, compositeOf } from "./score";
import type { Category, Scores, ScoutBrief, Topic } from "./types";
import { CATEGORIES } from "./types";

const CACHE_MS = 30 * 60 * 1000;
const MAX_TOKENS = 1800;

type CacheEntry = { at: number; brief: ScoutBrief };
let cache: CacheEntry | null = null;
let lastCall = 0;

type ArxivItem = { title: string; id: string; published: string; summary: string };
type HnItem = { title: string; url: string; points: number };

function isCategory(v: string): v is Category {
  return (CATEGORIES as readonly string[]).includes(v);
}

async function fetchArxiv(): Promise<ArxivItem[]> {
  const url =
    "https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL&start=0&max_results=16&sortBy=submittedDate&sortOrder=descending";
  const res = await fetch(url, {
    headers: { "User-Agent": "FrontierScout/1.0 (research briefing)" },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  const entries = xml.split("<entry>").slice(1);
  return entries.slice(0, 16).map((block) => {
    const title = (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const idUrl = block.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? "";
    const id = idUrl.split("/abs/").pop()?.replace(/v\d+$/, "") ?? "";
    const published = (block.match(/<published>([\s\S]*?)<\/published>/)?.[1] ?? "").slice(
      0,
      10,
    );
    const summary = (block.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220);
    return { title, id, published, summary };
  }).filter((e) => e.title && e.id);
}

async function fetchHn(): Promise<HnItem[]> {
  const url =
    "https://hn.algolia.com/api/v1/search?query=AI%20OR%20LLM%20OR%20agent&tags=story&hitsPerPage=12";
  const res = await fetch(url, {
    headers: { "User-Agent": "FrontierScout/1.0 (research briefing)" },
  });
  if (!res.ok) return [];
  const body = (await res.json()) as {
    hits?: { title?: string; url?: string; points?: number }[];
  };
  return (body.hits ?? [])
    .map((h) => ({
      title: (h.title ?? "").trim(),
      url: h.url ?? "",
      points: h.points ?? 0,
    }))
    .filter((h) => h.title);
}

function parseTopics(raw: unknown): Topic[] {
  if (!raw || typeof raw !== "object") return [];
  const topics = (raw as { topics?: unknown }).topics;
  if (!Array.isArray(topics)) return [];
  const out: Topic[] = [];
  for (const item of topics) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const title = String(rec.title ?? "").trim();
    if (!title) continue;
    const catRaw = String(rec.category ?? "niche").toLowerCase().replace(/\s+/g, "-");
    const category: Category = isCategory(catRaw) ? catRaw : "niche";
    const scoresRaw = (rec.scores ?? {}) as Record<string, unknown>;
    const scores: Scores = {
      scalability: clampScore(Number(scoresRaw.scalability)),
      accessibility: clampScore(Number(scoresRaw.accessibility)),
      growth: clampScore(Number(scoresRaw.growth)),
      adaptability: clampScore(Number(scoresRaw.adaptability)),
    };
    const composite = compositeOf(scores);
    const sources = Array.isArray(rec.sources)
      ? rec.sources
          .map((s) => {
            if (!s || typeof s !== "object") return null;
            const src = s as Record<string, unknown>;
            const url = String(src.url ?? "").trim();
            if (!url) return null;
            return { label: String(src.label ?? "source"), url };
          })
          .filter((s): s is { label: string; url: string } => Boolean(s))
      : [];
    const arxivIds = Array.isArray(rec.arxiv_ids)
      ? rec.arxiv_ids.map((x) => String(x))
      : Array.isArray(rec.arxivIds)
        ? rec.arxivIds.map((x) => String(x))
        : [];
    out.push({
      title,
      category,
      summary: String(rec.summary ?? "").trim().slice(0, 280),
      whyNow: String(rec.why_now ?? rec.whyNow ?? "").trim().slice(0, 180),
      scores,
      composite,
      band: bandOf(composite),
      sources,
      arxivIds,
    });
  }
  out.sort((a, b) => b.composite - a.composite || b.scores.growth - a.scores.growth);
  return out.slice(0, 10);
}

export const runLiveScout = createServerFn({ method: "POST" }).handler(
  async (): Promise<ScoutBrief> => {
    const now = Date.now();
    if (cache && now - cache.at < CACHE_MS) {
      return { ...cache.brief, note: "Cached for 30 minutes to keep API spend low." };
    }
    if (now - lastCall < 15_000) {
      if (cache) return { ...cache.brief, note: "Cached — wait a moment before another run." };
      return {
        generatedAt: new Date().toISOString(),
        topics: [],
        skipped: 0,
        source: "live",
        note: "Please wait a few seconds before running again.",
      };
    }
    lastCall = now;

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        generatedAt: new Date().toISOString(),
        topics: [],
        skipped: 0,
        source: "live",
        note: "Live scoring is unavailable in this environment. The sample brief still shows the format.",
      };
    }

    let arxiv: ArxivItem[] = [];
    let hn: HnItem[] = [];
    try {
      ;[arxiv, hn] = await Promise.all([fetchArxiv(), fetchHn()]);
    } catch {
      arxiv = [];
      hn = [];
    }

    const evidence = [
      "arXiv (recent cs.AI / cs.LG / cs.CL):",
      ...arxiv.slice(0, 12).map(
        (p) => `- ${p.published} [${p.id}] ${p.title} — ${p.summary}`,
      ),
      "",
      "Hacker News:",
      ...hn.slice(0, 10).map((h) => `- ${h.title} (${h.points}) ${h.url}`),
    ].join("\n");

    const prompt = `You are AI Frontier Scout. From the evidence below, pick at most 10 NEW emerging AI topics spanning methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Skip generic "AI is booming" items. Each topic needs a primary URL from the evidence (arxiv abs URL is https://arxiv.org/abs/ID).

Return ONLY JSON:
{"topics":[{"title":"","category":"methodology|business-model|industry|niche|case-study|paper|unexplored-frontier","summary":"<=280 chars","why_now":"<=180 chars","scores":{"scalability":1,"accessibility":1,"growth":1,"adaptability":1},"arxiv_ids":[],"sources":[{"label":"","url":""}]}]}

Scores are integers 1-10 using: scalability (can it spread), accessibility (who can use it in 12 months), growth (demand/capital now), adaptability (survives a model swap). Be conservative. Prefer fewer than 10 over padding.

EVIDENCE:
${evidence}`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.3,
        max_tokens: MAX_TOKENS,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return {
        generatedAt: new Date().toISOString(),
        topics: [],
        skipped: 0,
        source: "live",
        note: `xAI API error ${res.status}. Try again in a minute.`,
      };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {};
    }
    const topics = parseTopics(parsed);
    const brief: ScoutBrief = {
      generatedAt: new Date().toISOString(),
      topics,
      skipped: 0,
      source: "live",
      note:
        topics.length === 0
          ? "The model returned no scorable topics. The sample brief below is the format Hermes will send."
          : `Live run from ${arxiv.length} arXiv items and ${hn.length} HN stories. Hermes cron also writes a seen-ledger so repeats are dropped.`,
    };
    cache = { at: Date.now(), brief };
    return brief;
  },
);
