import type { ScoutBrief, Topic } from "./types";

function compact(text: string, n: number): string {
  const s = text.replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1).trimEnd()}…`;
}

function sourceLine(topic: Topic): string {
  const bits: string[] = [];
  const id = topic.arxivIds?.[0];
  if (id) bits.push(`arxiv:${id}`);
  for (const src of topic.sources) {
    if (id && src.url.includes("arxiv.org")) continue;
    bits.push(src.url);
    if (bits.length >= 2) break;
  }
  return bits.slice(0, 2).join(" · ");
}

function topicBlock(i: number, topic: Topic): string {
  const { scores } = topic;
  return [
    `${i}. ${compact(topic.title, 88)}  ${topic.band} ${topic.composite.toFixed(1)}`,
    `   ${topic.category} · sc ${scores.scalability} · ac ${scores.accessibility} · gr ${scores.growth} · ad ${scores.adaptability}`,
    `   ${compact(topic.whyNow || topic.summary, 180)}`,
    `   ${compact(sourceLine(topic), 120)}`,
  ].join("\n");
}

export function formatBrief(brief: ScoutBrief): string {
  const date = new Date(brief.generatedAt);
  const stamp = Number.isNaN(date.getTime())
    ? brief.generatedAt
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
  const topics = brief.topics.slice(0, 10);
  const header = `AI Frontier Scout · ${stamp}\n${topics.length} new · ${brief.skipped} repeats suppressed`;
  if (topics.length === 0) {
    return `${header}\n\nNo new emerging-AI topics cleared the ledger and source bar this run. The watchlist is up to date.`;
  }
  const footer =
    "sc scale · ac access · gr growth · ad adapt · band S≥8.5 A≥7.5 B≥6.5";
  return `${header}\n\n${topics.map((t, i) => topicBlock(i + 1, t)).join("\n\n")}\n\n${footer}`;
}
