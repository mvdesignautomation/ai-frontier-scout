import { AXIS_META, type Topic } from "@/lib/scout/types";
import { cn } from "@/lib/utils";

const BAND_CLASS: Record<Topic["band"], string> = {
  S: "text-band-s border-band-s/30",
  A: "text-band-a border-band-a/30",
  B: "text-band-b border-band-b/30",
  C: "text-band-c border-band-c/30",
  D: "text-band-d border-band-d/30",
};

export function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs tabular-nums text-faint">
            {String(index).padStart(2, "0")} · {topic.category}
          </p>
          <h3 className="mt-1 font-display text-xl leading-snug text-balance text-fg sm:text-2xl">
            {topic.title}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-sm border px-2 py-1 font-mono text-xs tabular-nums",
            BAND_CLASS[topic.band],
          )}
        >
          {topic.band} {topic.composite.toFixed(1)}
        </span>
      </header>
      <p className="mt-3 text-sm leading-normal text-pretty text-muted">{topic.whyNow}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {AXIS_META.map((axis) => {
          const value = topic.scores[axis.key];
          return (
            <div key={axis.key}>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-faint">
                {axis.short}
              </dt>
              <dd className="mt-1 font-mono text-sm tabular-nums text-fg">
                {value}
                <span className="text-faint">/10</span>
              </dd>
              <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${value * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </dl>
      {topic.sources[0] ? (
        <a
          href={topic.sources[0].url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block max-w-full truncate font-mono text-xs text-accent hover:text-paper"
        >
          {topic.sources[0].label} →
        </a>
      ) : null}
    </article>
  );
}
