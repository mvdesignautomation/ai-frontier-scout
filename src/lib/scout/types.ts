export const CATEGORIES = [
  "methodology",
  "business-model",
  "industry",
  "niche",
  "case-study",
  "paper",
  "unexplored-frontier",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Band = "S" | "A" | "B" | "C" | "D";

export type Scores = {
  scalability: number;
  accessibility: number;
  growth: number;
  adaptability: number;
};

export type Source = {
  label: string;
  url: string;
};

export type Topic = {
  title: string;
  category: Category;
  summary: string;
  whyNow: string;
  scores: Scores;
  composite: number;
  band: Band;
  sources: Source[];
  aliases?: string[];
  arxivIds?: string[];
};

export type ScoutBrief = {
  generatedAt: string;
  topics: Topic[];
  skipped: number;
  source: "sample" | "live";
  note?: string;
};

export const WEIGHTS = {
  growth: 0.3,
  scalability: 0.25,
  adaptability: 0.25,
  accessibility: 0.2,
} as const;

export const AXIS_META: {
  key: keyof Scores;
  label: string;
  short: string;
}[] = [
  { key: "scalability", label: "Scalability", short: "sc" },
  { key: "accessibility", label: "Accessibility", short: "ac" },
  { key: "growth", label: "Growth potential", short: "gr" },
  { key: "adaptability", label: "Adaptability", short: "ad" },
];
