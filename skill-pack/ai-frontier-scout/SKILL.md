---
name: ai-frontier-scout
description: "Scout emerging AI tech and rate scale, access, growth. Use for scheduled research briefs, methodologies, business models, industries, niches, case studies, papers, unexplored frontiers, and cron/messaging reports."
version: 1.0.0
author: Frontier Scout contributors, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
compatibility: "Requires Hermes Agent with web toolset. Python 3.10+ stdlib for helper scripts."
metadata:
  hermes:
    tags: [Research, AI, Emerging-Tech, Cron, Ratings, Briefing]
    category: research
    requires_toolsets: [web]
    blueprint:
      schedule: "0 8 * * 1-5"
      deliver: origin
      no_agent: false
      prompt: "Run the ai-frontier-scout skill exactly as written. Research emerging AI technologies across methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Score each on scalability, accessibility, growth potential, and adaptability using the skill rubric. Report at most 10 NEW topics. Skip anything already in the seen ledger. Your final response is the messaging-ready brief. Do not call send_message."
---

# AI Frontier Scout Skill

Scout emerging AI technologies and return a scored briefing. This skill does **not** dump news. It selects at most **10 new** topics per run, rates them on a four-axis rubric, and suppresses repeats via a durable ledger.

Use the helper at `scripts/scout.py` for ledger, scoring, and message formatting. Do not reimplement those in prose.

## When to Use

- The user asks to research emerging AI: methodologies, business models, industries, niches, case studies, papers, or unexplored frontiers.
- A cron / scheduled job named "AI Frontier Scout" (or similar) fires.
- The user wants a scored watchlist, not a raw link dump.
- The user asks "what's new in AI that is actually scalable / accessible / growing / adaptable?"

Don't use for:

- A single known paper recap (use `arxiv` instead).
- Stock tips, model-weight leaks, or unverified rumors with no primary source.
- Padding a brief with topics already in the ledger.

## Prerequisites

- Hermes `web_search` and `web_extract` (web toolset).
- Python 3.10+ stdlib only — no pip installs.
- Optional: bundled `arxiv` skill for paper lookup.
- Ledger path: `~/.hermes/data/ai-frontier-scout/ledger.json` (created on first `scout.py` call).
- `${HERMES_SKILL_DIR}` points at this skill directory when loaded. If unset, resolve from `~/.hermes/skills/ai-frontier-scout`.

## How to Run

Canonical invocations through the `terminal` tool. Prefer `python3` on Linux/macOS and `python` on Windows.

```
terminal(command="python3 \"${HERMES_SKILL_DIR}/scripts/scout.py\" status", timeout=30)
terminal(command="python3 \"${HERMES_SKILL_DIR}/scripts/scout.py\" filter --input /tmp/frontier-candidates.json", timeout=30)
terminal(command="python3 \"${HERMES_SKILL_DIR}/scripts/scout.py\" score --input /tmp/frontier-kept.json", timeout=30)
terminal(command="python3 \"${HERMES_SKILL_DIR}/scripts/scout.py\" record --input /tmp/frontier-final.json", timeout=30)
terminal(command="python3 \"${HERMES_SKILL_DIR}/scripts/scout.py\" format --input /tmp/frontier-final.json --channel origin", timeout=30)
```

`--channel` is `telegram` | `discord` | `slack` | `origin` | `generic`. Use `discord` when delivering to Discord (2k cap). Default `origin` targets Telegram-length (4k).

Schedule (CLI):

```
hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "Run the ai-frontier-scout skill exactly as written. Research emerging AI technologies across methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Score each on scalability, accessibility, growth potential, and adaptability using the skill rubric. Report at most 10 NEW topics. Skip anything already in the seen ledger. Your final response is the messaging-ready brief. Do not call send_message."
```

In chat: `Every weekday at 8am, run ai-frontier-scout and send me the brief.`

## Quick Reference

| Action | Command |
| --- | --- |
| Ledger status | `python3 ${HERMES_SKILL_DIR}/scripts/scout.py status` |
| Drop repeats | `... filter --input candidates.json` |
| Fill composite + band | `... score --input kept.json` |
| Persist seen topics | `... record --input final.json` |
| Messaging brief | `... format --input final.json --channel origin` |
| Cron command text | `... cron-help` |
| Forget old entries | `... reset --older-than 90` |
| Rubric | `skill_view("ai-frontier-scout", "references/rating-rubric.md")` |
| Sources | `skill_view("ai-frontier-scout", "references/sources.md")` |
| Report rules | `skill_view("ai-frontier-scout", "references/report-format.md")` |

Hard limits: **≤10 topics** in the delivered brief. **0 padding.** Repeats are a defect.

## Procedure

1. **Load state.** Run `scout.py status`. Note `seen_count`, recent titles, and `ttl_days`. Completion: you have the JSON status and will not propose those titles again.
2. **Collect candidates (15–30, not 10).** Search at least four source classes from `references/sources.md`:
   - `web_search` queries covering methodologies, business models, industry deployments, niches, and unexplored frontiers. Include the current year.
   - arXiv: `cs.AI`, `cs.LG`, `cs.CL`, `cs.RO`, `cs.CY` sorted by submission date (use the `arxiv` skill or `scripts/search_arxiv.py` if present).
   - Primary posts: lab blogs, company research pages, funding/product launches with a dated URL.
   - One counter-signal source (failure, regulation, replication) so the brief is not pure hype.
   Write candidates to a JSON file matching `templates/report.md`'s schema (title, category, summary, why_now, sources, optional aliases / arxiv_ids / urls). Scores may be omitted at this stage. Completion: a candidates file exists with ≥10 distinct items or you have exhausted sources.
3. **Dedup before scoring.** `scout.py filter --input <candidates>`. Drop every `skipped` item. If fewer than 3 remain, collect another batch from different queries — do not lower the bar to refill. Completion: a kept file with only unseen topics.
4. **Deepen the kept set.** For each remaining candidate, `web_extract` one primary URL (paper abs, blog post, or filing). Discard items with no primary source. Fill `summary` (≤280 chars) and `why_now` (≤180 chars). Assign integer scores 1–10 using `references/rating-rubric.md`. Categories must be one of: `methodology`, `business-model`, `industry`, `niche`, `case-study`, `paper`, `unexplored-frontier`. Completion: every kept item has four scores and at least one source URL.
5. **Score and cut to 10.** `scout.py score --input <kept>`. Sort is done by the script (composite desc, then growth desc). If more than 10 remain, keep the top 10 only. If a topic's composite is below 5.5 **and** you have 10 stronger ones, drop it. Never invent a 11th. Completion: final JSON has 1–10 topics, each with `composite` and `band`.
6. **Record, then format.** `scout.py record --input <final>` **before** delivering, so a crashed send still suppresses repeats next run. Then `scout.py format --input <final> --channel <deliver-target>`. Completion: ledger `updated_at` is this run; stdout is the brief.
7. **Deliver.** The formatted brief **is** your final response. Do not wrap it in extra commentary. Do not call `send_message` — cron already delivers the final response. If zero new topics: output the empty-brief template from `references/report-format.md` and stop.

## Pitfalls

- **Repeats look "fresh" when the headline is rephrased.** The ledger matches normalized titles, aliases, URLs, and arXiv IDs, plus fuzzy similarity. Always pass aliases (product names, paper titles, lab names) into the JSON.
- **Telegram 4096 / Discord 2000.** `format` truncates and compact-prints. Do not add an essay after it. If Discord, `--channel discord`.
- **Cron sessions are fresh.** They cannot see prior chat. The ledger is the only memory that matters. Do not rely on MEMORY.md for seen topics.
- **Hype without a source is not a topic.** "People are talking about X" with no URL is dropped.
- **Do not call `send_message`.** Duplicate delivery is a known Hermes failure mode.
- **Windows paths.** Use `python` and quoted paths; `scout.py` is pathlib-based and writes under `%USERPROFILE%\.hermes\data\ai-frontier-scout`.
- **`${HERMES_SKILL_DIR}` unset.** Fall back to `~/.hermes/skills/ai-frontier-scout/scripts/scout.py`.
- **Low-quality fill.** Fewer than 10 good new topics is success. Ten mediocre ones is failure.

## Verification

A run is correct only if all of the following hold:

- `scout.py status` after record shows `last_run` today and `seen_count` increased by the number of delivered topics.
- Delivered topic count is 0–10 inclusive.
- Every delivered title is absent from the *previous* status snapshot (fuzzy-safe).
- Every topic has four integer scores, a composite, a band, a category, and ≥1 URL.
- Final assistant message equals `scout.py format` stdout (no extra header you invented).
- Re-running `filter` on the same final JSON yields `kept: []`.
