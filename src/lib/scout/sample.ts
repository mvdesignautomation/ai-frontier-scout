import type { ScoutBrief, Topic } from "./types";
import { bandOf, compositeOf } from "./score";

function t(
  topic: Omit<Topic, "composite" | "band"> & { composite?: number; band?: Topic["band"] },
): Topic {
  const composite = compositeOf(topic.scores);
  return { ...topic, composite, band: bandOf(composite) };
}

export const SAMPLE_TOPICS: Topic[] = [
  t({
    title: "Test-Time Compute Routing",
    category: "methodology",
    summary:
      "Extra inference-time search sold as a billed routing layer, not a decoding trick.",
    whyNow:
      "Labs are shipping product surfaces that charge for longer thinking traces.",
    scores: { scalability: 8, accessibility: 6, growth: 9, adaptability: 8 },
    sources: [{ label: "arXiv", url: "https://arxiv.org/abs/2506.11200" }],
    aliases: ["TTC routing", "inference-time search product"],
    arxivIds: ["2506.11200"],
  }),
  t({
    title: "Agentic Skill Marketplaces",
    category: "business-model",
    summary:
      "Portable SKILL.md packs with cron blueprints as an installable capability channel.",
    whyNow:
      "Hermes, Claude, and others standardized the skill folder, so distribution has a socket.",
    scores: { scalability: 7, accessibility: 8, growth: 8, adaptability: 7 },
    sources: [
      {
        label: "Hermes skills",
        url: "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills",
      },
    ],
  }),
  t({
    title: "On-Device Mixture of Experts",
    category: "methodology",
    summary:
      "Sparse experts small enough to run on phones, with a router that stays on-device.",
    whyNow:
      "New silicon and 2–4B MoE checkpoints make local agents commercially plausible.",
    scores: { scalability: 8, accessibility: 7, growth: 8, adaptability: 7 },
    sources: [{ label: "arXiv", url: "https://arxiv.org/abs/2504.08388" }],
  }),
  t({
    title: "Synthetic Data Foundries",
    category: "business-model",
    summary:
      "Companies that sell verified synthetic corpora instead of scraping the public web.",
    whyNow:
      "Licensing pressure and eval contamination are turning data generation into a vendor category.",
    scores: { scalability: 8, accessibility: 6, growth: 9, adaptability: 7 },
    sources: [
      { label: "Industry note", url: "https://arxiv.org/abs/2503.00001" },
    ],
  }),
  t({
    title: "World Models for Factory Robots",
    category: "industry",
    summary:
      "Video-action world models closing the sim-to-real gap on repetitive industrial tasks.",
    whyNow:
      "Named factory pilots are reporting cycle-time gains, not just lab demos.",
    scores: { scalability: 7, accessibility: 5, growth: 9, adaptability: 8 },
    sources: [{ label: "arXiv", url: "https://arxiv.org/abs/2505.04421" }],
  }),
  t({
    title: "Continual User Modeling",
    category: "unexplored-frontier",
    summary:
      "Cross-session dialectic memory that builds a working model of one human over months.",
    whyNow:
      "Agent runtimes are wiring this in as a first-class loop, not a chat log.",
    scores: { scalability: 6, accessibility: 5, growth: 8, adaptability: 8 },
    sources: [{ label: "Honcho", url: "https://github.com/plastic-labs/honcho" }],
  }),
  t({
    title: "AI-Native Insurance Underwriting",
    category: "case-study",
    summary:
      "Carriers replacing parts of the actuarial stack with document-grounded agents.",
    whyNow:
      "A handful of named deployments published loss-ratio movement, not just copilots.",
    scores: { scalability: 7, accessibility: 6, growth: 8, adaptability: 6 },
    sources: [
      { label: "Case writeup", url: "https://arxiv.org/abs/2502.11800" },
    ],
  }),
  t({
    title: "Vertical Agent OS for Law",
    category: "niche",
    summary:
      "Matter-centric agent shells with privilege controls, not generic chat in a sidebar.",
    whyNow:
      "Firms are buying workflow OS, not another summarizer, and switching costs are high.",
    scores: { scalability: 6, accessibility: 6, growth: 8, adaptability: 7 },
    sources: [
      { label: "Practice note", url: "https://arxiv.org/abs/2501.07721" },
    ],
  }),
  t({
    title: "Inference-Time Constitutional Classifiers",
    category: "paper",
    summary:
      "Policy checks that run on traces at decode time instead of only at training.",
    whyNow:
      "Regulated buyers want a knob they can audit without retraining the base model.",
    scores: { scalability: 7, accessibility: 6, growth: 7, adaptability: 8 },
    sources: [{ label: "arXiv", url: "https://arxiv.org/abs/2507.03301" }],
  }),
  t({
    title: "Shared Eval Cartels",
    category: "unexplored-frontier",
    summary:
      "Cross-lab private eval sets that rotate faster than public leaderboards can be gamed.",
    whyNow:
      "Public benches are saturated; buyers are paying for held-out, dated suites.",
    scores: { scalability: 6, accessibility: 4, growth: 8, adaptability: 7 },
    sources: [{ label: "Eval discussion", url: "https://arxiv.org/abs/2503.22110" }],
  }),
];

export const SAMPLE_BRIEF: ScoutBrief = {
  generatedAt: "2026-08-28T08:00:00Z",
  topics: SAMPLE_TOPICS,
  skipped: 11,
  source: "sample",
  note: "Illustrative brief. Live scout pulls recent arXiv + HN, then scores with Grok.",
};
