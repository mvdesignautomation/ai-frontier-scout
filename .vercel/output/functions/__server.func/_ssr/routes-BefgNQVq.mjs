import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Layers, c as Copy, d as ArrowDown, i as MessageSquare, l as Check, n as ShieldCheck, o as Gauge, r as Radar, s as Download, u as CalendarClock } from "../_libs/lucide-react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as compositeOf, r as bandOf, t as AXIS_META } from "./score-D_2goy89.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BefgNQVq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none transition-[color,background-color,border-color,transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", {
	variants: {
		variant: {
			primary: "bg-paper text-ink hover:bg-accent",
			secondary: "border border-border bg-surface text-fg hover:border-accent/50 hover:text-paper",
			ghost: "text-muted hover:text-fg"
		},
		size: {
			sm: "h-10 min-h-10 px-3 text-sm rounded-sm",
			md: "h-11 min-h-11 px-4 text-sm rounded-md",
			lg: "h-12 min-h-12 px-5 text-base rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function CopyButton({ text, label = "Copy" }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function onCopy() {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setCopied(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "secondary",
		size: "sm",
		onClick: onCopy,
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-4",
			strokeWidth: 1.75
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
			className: "size-4",
			strokeWidth: 1.75
		}), copied ? "Copied" : label]
	});
}
var COMMANDS = [
	{
		id: "hermes",
		title: "Hermes terminal",
		hint: "After this folder is on GitHub as YOURUSER/ai-frontier-scout",
		code: "hermes skills install YOURUSER/ai-frontier-scout"
	},
	{
		id: "bash",
		title: "Linux / macOS",
		hint: "From the unzipped folder, or pipe after you push",
		code: `./install.sh

# after push:
curl -fsSL https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.sh \\
  | AI_FRONTIER_SCOUT_REPO=YOURUSER/ai-frontier-scout bash`
	},
	{
		id: "ps",
		title: "PowerShell",
		hint: "Native Windows — no WSL required for the copy",
		code: `.\\install.ps1

# after push:
$env:AI_FRONTIER_SCOUT_REPO = "YOURUSER/ai-frontier-scout"
irm https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.ps1 | iex`
	},
	{
		id: "cron",
		title: "Schedule the job",
		hint: "In Hermes chat, or the same CLI on Windows and Unix",
		code: `Every weekday at 8am, run ai-frontier-scout and send me the brief.

hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "Run the ai-frontier-scout skill exactly as written. Research emerging AI technologies across methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Score each on scalability, accessibility, growth potential, and adaptability using the skill rubric. Report at most 10 NEW topics. Skip anything already in the seen ledger. Your final response is the messaging-ready brief. Do not call send_message."`
	}
];
function InstallBlock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-w-0 gap-4",
		children: COMMANDS.map((cmd) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 rounded-lg border border-border bg-surface p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-fg",
					children: cmd.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: cmd.hint
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { text: cmd.code })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-4 max-w-full min-w-0 overflow-x-auto rounded-md bg-bg p-3 font-mono text-[12px] leading-relaxed break-all whitespace-pre-wrap text-paper sm:text-xs",
				children: cmd.code
			})]
		}, cmd.id))
	});
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		fill: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "14.5",
				stroke: "currentColor",
				strokeWidth: "1.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "6",
				stroke: "currentColor",
				strokeWidth: "1.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 2.5v5.5M16 24v5.5M2.5 16h5.5M24 16h5.5",
				stroke: "currentColor",
				strokeWidth: "1.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 16l7-4.5",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "1.6",
				fill: "currentColor"
			})
		]
	});
}
var BAND_CLASS = {
	S: "text-band-s border-band-s/30",
	A: "text-band-a border-band-a/30",
	B: "text-band-b border-band-b/30",
	C: "text-band-c border-band-c/30",
	D: "text-band-d border-band-d/30"
};
function TopicCard({ topic, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-border bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs tabular-nums text-faint",
						children: [
							String(index).padStart(2, "0"),
							" · ",
							topic.category
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-xl leading-snug text-balance text-fg sm:text-2xl",
						children: topic.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("shrink-0 rounded-sm border px-2 py-1 font-mono text-xs tabular-nums", BAND_CLASS[topic.band]),
					children: [
						topic.band,
						" ",
						topic.composite.toFixed(1)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-normal text-pretty text-muted",
				children: topic.whyNow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: AXIS_META.map((axis) => {
					const value = topic.scores[axis.key];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] uppercase tracking-[0.12em] text-faint",
							children: axis.short
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "mt-1 font-mono text-sm tabular-nums text-fg",
							children: [value, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-faint",
								children: "/10"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-0.5 overflow-hidden rounded-full bg-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-accent",
								style: { width: `${value * 10}%` }
							})
						})
					] }, axis.key);
				})
			}),
			topic.sources[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: topic.sources[0].url,
				target: "_blank",
				rel: "noreferrer",
				className: "mt-4 inline-block max-w-full truncate font-mono text-xs text-accent hover:text-paper",
				children: [topic.sources[0].label, " →"]
			}) : null
		]
	});
}
function compact(text, n) {
	const s = text.replace(/\s+/g, " ").trim();
	if (s.length <= n) return s;
	return `${s.slice(0, n - 1).trimEnd()}…`;
}
function sourceLine(topic) {
	const bits = [];
	const id = topic.arxivIds?.[0];
	if (id) bits.push(`arxiv:${id}`);
	for (const src of topic.sources) {
		if (id && src.url.includes("arxiv.org")) continue;
		bits.push(src.url);
		if (bits.length >= 2) break;
	}
	return bits.slice(0, 2).join(" · ");
}
function topicBlock(i, topic) {
	const { scores } = topic;
	return [
		`${i}. ${compact(topic.title, 88)}  ${topic.band} ${topic.composite.toFixed(1)}`,
		`   ${topic.category} · sc ${scores.scalability} · ac ${scores.accessibility} · gr ${scores.growth} · ad ${scores.adaptability}`,
		`   ${compact(topic.whyNow || topic.summary, 180)}`,
		`   ${compact(sourceLine(topic), 120)}`
	].join("\n");
}
function formatBrief(brief) {
	const date = new Date(brief.generatedAt);
	const stamp = Number.isNaN(date.getTime()) ? brief.generatedAt : date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	});
	const topics = brief.topics.slice(0, 10);
	const header = `AI Frontier Scout · ${stamp}\n${topics.length} new · ${brief.skipped} repeats suppressed`;
	if (topics.length === 0) return `${header}\n\nNo new emerging-AI topics cleared the ledger and source bar this run. The watchlist is up to date.`;
	return `${header}\n\n${topics.map((t, i) => topicBlock(i + 1, t)).join("\n\n")}\n\nsc scale · ac access · gr growth · ad adapt · band S≥8.5 A≥7.5 B≥6.5`;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var runLiveScout = createServerFn({ method: "POST" }).handler(createSsrRpc("1c5f8f6d4a744b451fb065d2d6a2bef09c7ef419d1fe088ec5c08f797eb37c77"));
function t(topic) {
	const composite = compositeOf(topic.scores);
	return {
		...topic,
		composite,
		band: bandOf(composite)
	};
}
var SAMPLE_BRIEF = {
	generatedAt: "2026-08-28T08:00:00Z",
	topics: [
		t({
			title: "Test-Time Compute Routing",
			category: "methodology",
			summary: "Extra inference-time search sold as a billed routing layer, not a decoding trick.",
			whyNow: "Labs are shipping product surfaces that charge for longer thinking traces.",
			scores: {
				scalability: 8,
				accessibility: 6,
				growth: 9,
				adaptability: 8
			},
			sources: [{
				label: "arXiv",
				url: "https://arxiv.org/abs/2506.11200"
			}],
			aliases: ["TTC routing", "inference-time search product"],
			arxivIds: ["2506.11200"]
		}),
		t({
			title: "Agentic Skill Marketplaces",
			category: "business-model",
			summary: "Portable SKILL.md packs with cron blueprints as an installable capability channel.",
			whyNow: "Hermes, Claude, and others standardized the skill folder, so distribution has a socket.",
			scores: {
				scalability: 7,
				accessibility: 8,
				growth: 8,
				adaptability: 7
			},
			sources: [{
				label: "Hermes skills",
				url: "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills"
			}]
		}),
		t({
			title: "On-Device Mixture of Experts",
			category: "methodology",
			summary: "Sparse experts small enough to run on phones, with a router that stays on-device.",
			whyNow: "New silicon and 2–4B MoE checkpoints make local agents commercially plausible.",
			scores: {
				scalability: 8,
				accessibility: 7,
				growth: 8,
				adaptability: 7
			},
			sources: [{
				label: "arXiv",
				url: "https://arxiv.org/abs/2504.08388"
			}]
		}),
		t({
			title: "Synthetic Data Foundries",
			category: "business-model",
			summary: "Companies that sell verified synthetic corpora instead of scraping the public web.",
			whyNow: "Licensing pressure and eval contamination are turning data generation into a vendor category.",
			scores: {
				scalability: 8,
				accessibility: 6,
				growth: 9,
				adaptability: 7
			},
			sources: [{
				label: "Industry note",
				url: "https://arxiv.org/abs/2503.00001"
			}]
		}),
		t({
			title: "World Models for Factory Robots",
			category: "industry",
			summary: "Video-action world models closing the sim-to-real gap on repetitive industrial tasks.",
			whyNow: "Named factory pilots are reporting cycle-time gains, not just lab demos.",
			scores: {
				scalability: 7,
				accessibility: 5,
				growth: 9,
				adaptability: 8
			},
			sources: [{
				label: "arXiv",
				url: "https://arxiv.org/abs/2505.04421"
			}]
		}),
		t({
			title: "Continual User Modeling",
			category: "unexplored-frontier",
			summary: "Cross-session dialectic memory that builds a working model of one human over months.",
			whyNow: "Agent runtimes are wiring this in as a first-class loop, not a chat log.",
			scores: {
				scalability: 6,
				accessibility: 5,
				growth: 8,
				adaptability: 8
			},
			sources: [{
				label: "Honcho",
				url: "https://github.com/plastic-labs/honcho"
			}]
		}),
		t({
			title: "AI-Native Insurance Underwriting",
			category: "case-study",
			summary: "Carriers replacing parts of the actuarial stack with document-grounded agents.",
			whyNow: "A handful of named deployments published loss-ratio movement, not just copilots.",
			scores: {
				scalability: 7,
				accessibility: 6,
				growth: 8,
				adaptability: 6
			},
			sources: [{
				label: "Case writeup",
				url: "https://arxiv.org/abs/2502.11800"
			}]
		}),
		t({
			title: "Vertical Agent OS for Law",
			category: "niche",
			summary: "Matter-centric agent shells with privilege controls, not generic chat in a sidebar.",
			whyNow: "Firms are buying workflow OS, not another summarizer, and switching costs are high.",
			scores: {
				scalability: 6,
				accessibility: 6,
				growth: 8,
				adaptability: 7
			},
			sources: [{
				label: "Practice note",
				url: "https://arxiv.org/abs/2501.07721"
			}]
		}),
		t({
			title: "Inference-Time Constitutional Classifiers",
			category: "paper",
			summary: "Policy checks that run on traces at decode time instead of only at training.",
			whyNow: "Regulated buyers want a knob they can audit without retraining the base model.",
			scores: {
				scalability: 7,
				accessibility: 6,
				growth: 7,
				adaptability: 8
			},
			sources: [{
				label: "arXiv",
				url: "https://arxiv.org/abs/2507.03301"
			}]
		}),
		t({
			title: "Shared Eval Cartels",
			category: "unexplored-frontier",
			summary: "Cross-lab private eval sets that rotate faster than public leaderboards can be gamed.",
			whyNow: "Public benches are saturated; buyers are paying for held-out, dated suites.",
			scores: {
				scalability: 6,
				accessibility: 4,
				growth: 8,
				adaptability: 7
			},
			sources: [{
				label: "Eval discussion",
				url: "https://arxiv.org/abs/2503.22110"
			}]
		})
	],
	skipped: 11,
	source: "sample",
	note: "Illustrative brief. Live scout pulls recent arXiv + HN, then scores with Grok."
};
var PACK_TREE = `ai-frontier-scout/
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
var STEPS = [
	{
		n: "01",
		title: "Research",
		body: "Pull papers, lab posts, deployments, and one counter-signal. Methodologies, business models, industries, niches, case studies, frontiers."
	},
	{
		n: "02",
		title: "Dedup",
		body: "scout.py checks a durable ledger — titles, aliases, URLs, arXiv IDs, fuzzy overlap. Repeats never ship."
	},
	{
		n: "03",
		title: "Rate",
		body: "Four integer axes, a weighted composite, a band. At most ten new topics. Fewer is fine. Padding is a defect."
	},
	{
		n: "04",
		title: "Deliver",
		body: "The formatted brief is the final message. Hermes cron sends it to Telegram, Discord, Slack, or origin chat."
	}
];
function Home() {
	const [brief, setBrief] = (0, import_react.useState)(SAMPLE_BRIEF);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const message = (0, import_react.useMemo)(() => formatBrief(brief), [brief]);
	async function onLive() {
		if (running) return;
		setRunning(true);
		setError(null);
		try {
			const next = await runLiveScout();
			if (next.topics.length === 0 && next.note) setError(next.note);
			else setBrief(next);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Live scout failed.");
		} finally {
			setRunning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh overflow-x-hidden bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border/80 bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#top",
							className: "flex items-center gap-2 text-sm font-medium text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-6 text-accent" }), "Frontier Scout"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-6 text-sm text-muted sm:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#brief",
									className: "hover:text-fg",
									children: "Brief"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#install",
									className: "hover:text-fg",
									children: "Install"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#pack",
									className: "hover:text-fg",
									children: "Pack"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/downloads/ai-frontier-scout.zip",
								download: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									className: "size-4",
									strokeWidth: 1.75
								}), "Download"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-[0.18em] text-accent",
								children: "Hermes Agent skill"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 font-display text-[2.6rem] leading-[1.08] tracking-[-0.03em] text-fg sm:text-6xl",
								children: "Emerging AI, scored — ten topics, no repeats."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-xl text-base leading-normal text-muted sm:text-lg",
								children: "A scheduled research harness for Hermes. It scouts methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers, then rates each on scale, access, growth, and adaptability. The brief lands in your messaging apps."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/downloads/ai-frontier-scout.zip",
										download: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
											className: "size-4",
											strokeWidth: 1.75
										}), "Download GitHub folder"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "secondary",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "#install",
										children: ["Install commands", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
											className: "size-4",
											strokeWidth: 1.75
										})]
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "rounded-xl border border-border bg-surface p-5 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-[0.16em] text-faint",
								children: "Per execution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-3 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
											className: "mt-0.5 size-4 shrink-0 text-accent",
											strokeWidth: 1.75
										}), "At most 10 new topics"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
											className: "mt-0.5 size-4 shrink-0 text-accent",
											strokeWidth: 1.75
										}), "Ledger blocks rephrased repeats"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
											className: "mt-0.5 size-4 shrink-0 text-accent",
											strokeWidth: 1.75
										}), "Four-axis rubric + composite band"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
											className: "mt-0.5 size-4 shrink-0 text-accent",
											strokeWidth: 1.75
										}), "Cron blueprint: weekdays 08:00"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
											className: "mt-0.5 size-4 shrink-0 text-accent",
											strokeWidth: 1.75
										}), "Telegram / Discord / Slack / origin"]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-y border-border bg-surface-2/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid max-w-6xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4",
							children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-bg px-5 py-8 sm:px-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs tabular-nums text-accent",
										children: step.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 font-display text-2xl text-fg",
										children: step.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-normal text-muted",
										children: step.body
									})
								]
							}, step.n))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-[0.18em] text-accent",
								children: "Rubric"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-4xl text-fg",
								children: "Four axes, one band."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-2xl text-muted",
								children: "Composite = 0.30 growth + 0.25 scale + 0.25 adapt + 0.20 access. S ≥ 8.5, A ≥ 7.5, B ≥ 6.5, C ≥ 5.5. Integers only — the helper script owns the math."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid gap-4 sm:grid-cols-2",
								children: AXIS_META.map((axis) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-surface p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-medium text-fg",
										children: axis.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-sm text-muted",
										children: [
											axis.key === "scalability" && "Can this spread without elite-talent or single-vendor bottlenecks?",
											axis.key === "accessibility" && "Who can use or build on it in the next twelve months?",
											axis.key === "growth" && "Are demand, capital, and capability pulling the same way now?",
											axis.key === "adaptability" && "Does the method survive a model swap or a new domain?"
										]
									})]
								}, axis.key))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "brief",
						className: "scroll-mt-16 border-t border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-end justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs uppercase tracking-[0.18em] text-accent",
											children: "Sample brief"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-3 font-display text-4xl text-fg",
											children: "What messaging receives."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 max-w-xl text-muted",
											children: "Compact enough for Telegram. Discord uses a tighter budget. Live scout pulls recent arXiv and HN, then scores with Grok — one click, cached for 30 minutes."
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "secondary",
											onClick: onLive,
											disabled: running,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
												className: "size-4",
												strokeWidth: 1.75
											}), running ? "Scouting…" : "Run live scout"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
											text: message,
											label: "Copy brief"
										})]
									})]
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-6 font-mono text-xs text-faint",
									children: [
										brief.source === "live" ? "Live" : "Sample",
										" · ",
										brief.topics.length,
										" topics · ",
										brief.skipped,
										" repeats suppressed",
										brief.note ? ` · ${brief.note}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 grid gap-4 lg:grid-cols-2",
									children: brief.topics.map((topic, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicCard, {
										topic,
										index: i + 1
									}, `${topic.title}-${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-8 max-w-full min-w-0 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap text-muted sm:text-xs",
									children: message
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "install",
						className: "scroll-mt-16 border-t border-border bg-surface-2/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-[0.18em] text-accent",
									children: "Install"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl text-fg",
									children: "Download, push, then one command."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-2xl text-muted",
									children: "The zip is a GitHub-ready repository. Upload the folder, replace YOURUSER, install into Hermes, attach it to a cron job. Linux, macOS, and native PowerShell are covered."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallBlock, {})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "pack",
						className: "scroll-mt-16 border-t border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-[0.18em] text-accent",
									children: "Repository"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl text-fg",
									children: "Pack layout"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted",
									children: "Compatible with agentskills.io and Hermes. Helper scripts are Python stdlib only. Tests ship with the pack."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/downloads/ai-frontier-scout.zip",
										download: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
											className: "size-4",
											strokeWidth: 1.75
										}), "ai-frontier-scout.zip"]
									})
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "max-w-full min-w-0 overflow-x-auto rounded-xl border border-border bg-surface p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-paper",
								children: PACK_TREE
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
							className: "size-4",
							strokeWidth: 1.75
						}), "MIT · Hermes Agent skill"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ledger lives in ~/.hermes/data/ai-frontier-scout" })]
				})
			})
		]
	});
}
//#endregion
export { Home as component };
