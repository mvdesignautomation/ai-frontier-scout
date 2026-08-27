import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  CalendarClock,
  Download,
  Gauge,
  Layers,
  MessageSquare,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { InstallBlock } from "@/components/install-block";
import { Mark } from "@/components/mark";
import { TopicCard } from "@/components/topic-card";
import { Button } from "@/components/ui/button";
import { formatBrief } from "@/lib/scout/format";
import { runLiveScout } from "@/lib/scout/run";
import { SAMPLE_BRIEF } from "@/lib/scout/sample";
import type { ScoutBrief } from "@/lib/scout/types";
import { AXIS_META } from "@/lib/scout/types";

export const Route = createFileRoute("/")({ component: Home });

const PACK_TREE = `ai-frontier-scout/
├── SKILL.md
├── README.md
├── LICENSE
├── install.sh
├── install.ps1
├── skills.sh.json
├── scripts/
│   ├── scout.py
│   └── test_scout.py
├── references/
│   ├── rating-rubric.md
│   ├── sources.md
│   ├── report-format.md
│   └── cron-setup.md
├── templates/report.md
└── examples/`;

const STEPS = [
  {
    n: "01",
    title: "Research",
    body: "Pull papers, lab posts, deployments, and one counter-signal. Methodologies, business models, industries, niches, case studies, frontiers.",
  },
  {
    n: "02",
    title: "Dedup",
    body: "scout.py checks a durable ledger — titles, aliases, URLs, arXiv IDs, fuzzy overlap. Repeats never ship.",
  },
  {
    n: "03",
    title: "Rate",
    body: "Four integer axes, a weighted composite, a band. At most ten new topics. Fewer is fine. Padding is a defect.",
  },
  {
    n: "04",
    title: "Deliver",
    body: "The formatted brief is the final message. Hermes cron sends it to Telegram, Discord, Slack, or origin chat.",
  },
];

function Home() {
  const [brief, setBrief] = useState<ScoutBrief>(SAMPLE_BRIEF);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const message = useMemo(() => formatBrief(brief), [brief]);

  async function onLive() {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      const next = await runLiveScout();
      if (next.topics.length === 0 && next.note) {
        setError(next.note);
      } else {
        setBrief(next);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Live scout failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2 text-sm font-medium text-fg">
            <Mark className="size-6 text-accent" />
            Frontier Scout
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <a href="#brief" className="hover:text-fg">
              Brief
            </a>
            <a href="#install" className="hover:text-fg">
              Install
            </a>
            <a href="#pack" className="hover:text-fg">
              Pack
            </a>
          </nav>
          <Button asChild size="sm">
            <a href="/downloads/ai-frontier-scout.zip" download>
              <Download className="size-4" strokeWidth={1.75} />
              Download
            </a>
          </Button>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Hermes Agent skill
            </p>
            <h1 className="mt-4 font-display text-[2.6rem] leading-[1.08] tracking-[-0.03em] text-fg sm:text-6xl">
              Emerging AI, scored — ten topics, no repeats.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-normal text-muted sm:text-lg">
              A scheduled research harness for Hermes. It scouts methodologies,
              business models, industries, niches, case studies, papers, and
              unexplored frontiers, then rates each on scale, access, growth, and
              adaptability. The brief lands in your messaging apps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="/downloads/ai-frontier-scout.zip" download>
                  <Download className="size-4" strokeWidth={1.75} />
                  Download GitHub folder
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="#install">
                  Install commands
                  <ArrowDown className="size-4" strokeWidth={1.75} />
                </a>
              </Button>
            </div>
          </div>
          <aside className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
              Per execution
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <Radar className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                At most 10 new topics
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                Ledger blocks rephrased repeats
              </li>
              <li className="flex gap-3">
                <Gauge className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                Four-axis rubric + composite band
              </li>
              <li className="flex gap-3">
                <CalendarClock className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                Cron blueprint: weekdays 08:00
              </li>
              <li className="flex gap-3">
                <MessageSquare className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                Telegram / Discord / Slack / origin
              </li>
            </ul>
          </aside>
        </section>

        <section className="border-y border-border bg-surface-2/40">
          <div className="mx-auto grid max-w-6xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n} className="bg-bg px-5 py-8 sm:px-6">
                <p className="font-mono text-xs tabular-nums text-accent">{step.n}</p>
                <h2 className="mt-3 font-display text-2xl text-fg">{step.title}</h2>
                <p className="mt-2 text-sm leading-normal text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Rubric
          </p>
          <h2 className="mt-3 font-display text-4xl text-fg">Four axes, one band.</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Composite = 0.30 growth + 0.25 scale + 0.25 adapt + 0.20 access. S ≥ 8.5,
            A ≥ 7.5, B ≥ 6.5, C ≥ 5.5. Integers only — the helper script owns the math.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {AXIS_META.map((axis) => (
              <div
                key={axis.key}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <h3 className="text-sm font-medium text-fg">{axis.label}</h3>
                <p className="mt-2 text-sm text-muted">
                  {axis.key === "scalability" &&
                    "Can this spread without elite-talent or single-vendor bottlenecks?"}
                  {axis.key === "accessibility" &&
                    "Who can use or build on it in the next twelve months?"}
                  {axis.key === "growth" &&
                    "Are demand, capital, and capability pulling the same way now?"}
                  {axis.key === "adaptability" &&
                    "Does the method survive a model swap or a new domain?"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="brief" className="scroll-mt-16 border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  Sample brief
                </p>
                <h2 className="mt-3 font-display text-4xl text-fg">
                  What messaging receives.
                </h2>
                <p className="mt-3 max-w-xl text-muted">
                  Compact enough for Telegram. Discord uses a tighter budget. Live
                  scout pulls recent arXiv and HN, then scores with Grok — one click,
                  cached for 30 minutes.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={onLive} disabled={running}>
                  <Radar className="size-4" strokeWidth={1.75} />
                  {running ? "Scouting…" : "Run live scout"}
                </Button>
                <CopyButton text={message} label="Copy brief" />
              </div>
            </div>
            {error ? (
              <p className="mt-4 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
                {error}
              </p>
            ) : null}
            <p className="mt-6 font-mono text-xs text-faint">
              {brief.source === "live" ? "Live" : "Sample"} · {brief.topics.length} topics
              · {brief.skipped} repeats suppressed
              {brief.note ? ` · ${brief.note}` : ""}
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {brief.topics.map((topic, i) => (
                <TopicCard key={`${topic.title}-${i}`} topic={topic} index={i + 1} />
              ))}
            </div>
            <pre className="mt-8 max-w-full min-w-0 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap text-muted sm:text-xs">
              {message}
            </pre>
          </div>
        </section>

        <section id="install" className="scroll-mt-16 border-t border-border bg-surface-2/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Install
            </p>
            <h2 className="mt-3 font-display text-4xl text-fg">
              Download, push, then one command.
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              The zip is a GitHub-ready repository. Upload the folder, replace
              YOURUSER, install into Hermes, attach it to a cron job. Linux, macOS,
              and native PowerShell are covered.
            </p>
            <div className="mt-8">
              <InstallBlock />
            </div>
          </div>
        </section>

        <section id="pack" className="scroll-mt-16 border-t border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                Repository
              </p>
              <h2 className="mt-3 font-display text-4xl text-fg">Pack layout</h2>
              <p className="mt-3 text-muted">
                Compatible with agentskills.io and Hermes. Helper scripts are Python
                stdlib only. Tests ship with the pack.
              </p>
              <Button asChild className="mt-6">
                <a href="/downloads/ai-frontier-scout.zip" download>
                  <Download className="size-4" strokeWidth={1.75} />
                  ai-frontier-scout.zip
                </a>
              </Button>
            </div>
            <pre className="max-w-full min-w-0 overflow-x-auto rounded-xl border border-border bg-surface p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-paper">
              {PACK_TREE}
            </pre>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="flex items-center gap-2">
            <Layers className="size-4" strokeWidth={1.75} />
            MIT · Hermes Agent skill
          </span>
          <span>Ledger lives in ~/.hermes/data/ai-frontier-scout</span>
        </div>
      </footer>
    </div>
  );
}
