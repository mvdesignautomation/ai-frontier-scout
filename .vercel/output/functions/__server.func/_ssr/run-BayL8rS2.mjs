import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as compositeOf, i as clampScore, n as CATEGORIES, r as bandOf } from "./score-D_2goy89.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-BayL8rS2.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CACHE_MS = 18e5;
var MAX_TOKENS = 1800;
var cache = null;
var lastCall = 0;
function isCategory(v) {
	return CATEGORIES.includes(v);
}
async function fetchArxiv() {
	const res = await fetch("https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL&start=0&max_results=16&sortBy=submittedDate&sortOrder=descending", { headers: { "User-Agent": "FrontierScout/1.0 (research briefing)" } });
	if (!res.ok) return [];
	return (await res.text()).split("<entry>").slice(1).slice(0, 16).map((block) => {
		return {
			title: (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").replace(/\s+/g, " ").trim(),
			id: (block.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? "").split("/abs/").pop()?.replace(/v\d+$/, "") ?? "",
			published: (block.match(/<published>([\s\S]*?)<\/published>/)?.[1] ?? "").slice(0, 10),
			summary: (block.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? "").replace(/\s+/g, " ").trim().slice(0, 220)
		};
	}).filter((e) => e.title && e.id);
}
async function fetchHn() {
	const res = await fetch("https://hn.algolia.com/api/v1/search?query=AI%20OR%20LLM%20OR%20agent&tags=story&hitsPerPage=12", { headers: { "User-Agent": "FrontierScout/1.0 (research briefing)" } });
	if (!res.ok) return [];
	return ((await res.json()).hits ?? []).map((h) => ({
		title: (h.title ?? "").trim(),
		url: h.url ?? "",
		points: h.points ?? 0
	})).filter((h) => h.title);
}
function parseTopics(raw) {
	if (!raw || typeof raw !== "object") return [];
	const topics = raw.topics;
	if (!Array.isArray(topics)) return [];
	const out = [];
	for (const item of topics) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const title = String(rec.title ?? "").trim();
		if (!title) continue;
		const catRaw = String(rec.category ?? "niche").toLowerCase().replace(/\s+/g, "-");
		const category = isCategory(catRaw) ? catRaw : "niche";
		const scoresRaw = rec.scores ?? {};
		const scores = {
			scalability: clampScore(Number(scoresRaw.scalability)),
			accessibility: clampScore(Number(scoresRaw.accessibility)),
			growth: clampScore(Number(scoresRaw.growth)),
			adaptability: clampScore(Number(scoresRaw.adaptability))
		};
		const composite = compositeOf(scores);
		const sources = Array.isArray(rec.sources) ? rec.sources.map((s) => {
			if (!s || typeof s !== "object") return null;
			const src = s;
			const url = String(src.url ?? "").trim();
			if (!url) return null;
			return {
				label: String(src.label ?? "source"),
				url
			};
		}).filter((s) => Boolean(s)) : [];
		const arxivIds = Array.isArray(rec.arxiv_ids) ? rec.arxiv_ids.map((x) => String(x)) : Array.isArray(rec.arxivIds) ? rec.arxivIds.map((x) => String(x)) : [];
		out.push({
			title,
			category,
			summary: String(rec.summary ?? "").trim().slice(0, 280),
			whyNow: String(rec.why_now ?? rec.whyNow ?? "").trim().slice(0, 180),
			scores,
			composite,
			band: bandOf(composite),
			sources,
			arxivIds
		});
	}
	out.sort((a, b) => b.composite - a.composite || b.scores.growth - a.scores.growth);
	return out.slice(0, 10);
}
var runLiveScout_createServerFn_handler = createServerRpc({
	id: "1c5f8f6d4a744b451fb065d2d6a2bef09c7ef419d1fe088ec5c08f797eb37c77",
	name: "runLiveScout",
	filename: "src/lib/scout/run.ts"
}, (opts) => runLiveScout.__executeServer(opts));
var runLiveScout = createServerFn({ method: "POST" }).handler(runLiveScout_createServerFn_handler, async () => {
	const now = Date.now();
	if (cache && now - cache.at < CACHE_MS) return {
		...cache.brief,
		note: "Cached for 30 minutes to keep API spend low."
	};
	if (now - lastCall < 15e3) {
		if (cache) return {
			...cache.brief,
			note: "Cached — wait a moment before another run."
		};
		return {
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			topics: [],
			skipped: 0,
			source: "live",
			note: "Please wait a few seconds before running again."
		};
	}
	lastCall = now;
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		topics: [],
		skipped: 0,
		source: "live",
		note: "Live scoring is unavailable in this environment. The sample brief still shows the format."
	};
	let arxiv = [];
	let hn = [];
	try {
		[arxiv, hn] = await Promise.all([fetchArxiv(), fetchHn()]);
	} catch {
		arxiv = [];
		hn = [];
	}
	const prompt = `You are AI Frontier Scout. From the evidence below, pick at most 10 NEW emerging AI topics spanning methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Skip generic "AI is booming" items. Each topic needs a primary URL from the evidence (arxiv abs URL is https://arxiv.org/abs/ID).

Return ONLY JSON:
{"topics":[{"title":"","category":"methodology|business-model|industry|niche|case-study|paper|unexplored-frontier","summary":"<=280 chars","why_now":"<=180 chars","scores":{"scalability":1,"accessibility":1,"growth":1,"adaptability":1},"arxiv_ids":[],"sources":[{"label":"","url":""}]}]}

Scores are integers 1-10 using: scalability (can it spread), accessibility (who can use it in 12 months), growth (demand/capital now), adaptability (survives a model swap). Be conservative. Prefer fewer than 10 over padding.

EVIDENCE:
${[
		"arXiv (recent cs.AI / cs.LG / cs.CL):",
		...arxiv.slice(0, 12).map((p) => `- ${p.published} [${p.id}] ${p.title} — ${p.summary}`),
		"",
		"Hacker News:",
		...hn.slice(0, 10).map((h) => `- ${h.title} (${h.points}) ${h.url}`)
	].join("\n")}`;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .3,
			max_tokens: MAX_TOKENS,
			response_format: { type: "json_object" },
			messages: [{
				role: "user",
				content: prompt
			}]
		})
	});
	if (!res.ok) return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		topics: [],
		skipped: 0,
		source: "live",
		note: `xAI API error ${res.status}. Try again in a minute.`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "{}";
	let parsed = {};
	try {
		parsed = JSON.parse(text);
	} catch {
		parsed = {};
	}
	const topics = parseTopics(parsed);
	const brief = {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		topics,
		skipped: 0,
		source: "live",
		note: topics.length === 0 ? "The model returned no scorable topics. The sample brief below is the format Hermes will send." : `Live run from ${arxiv.length} arXiv items and ${hn.length} HN stories. Hermes cron also writes a seen-ledger so repeats are dropped.`
	};
	cache = {
		at: Date.now(),
		brief
	};
	return brief;
});
//#endregion
export { runLiveScout_createServerFn_handler };
