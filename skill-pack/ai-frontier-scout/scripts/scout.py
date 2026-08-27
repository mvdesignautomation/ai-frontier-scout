#!/usr/bin/env python3
"""AI Frontier Scout — ledger, scoring, and messaging format.

Stdlib only. Cross-platform (Linux, macOS, Windows).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import unicodedata
from datetime import datetime, timedelta, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

VERSION = "1.0.0"
LIMIT = 10
TTL_DAYS = 90
FUZZY_RATIO = 0.84
JACCARD = 0.72
WEIGHTS = {
    "growth": 0.30,
    "scalability": 0.25,
    "adaptability": 0.25,
    "accessibility": 0.20,
}
CATEGORIES = {
    "methodology",
    "business-model",
    "industry",
    "niche",
    "case-study",
    "paper",
    "unexplored-frontier",
}
SCORE_KEYS = ("scalability", "accessibility", "growth", "adaptability")
ARXIV_RE = re.compile(
    r"(?:arxiv\.org/(?:abs|pdf)/|arxiv[:\s]+|abs/)(\d{4}\.\d{4,5})(?:v\d+)?",
    re.IGNORECASE,
)
PUNCT_RE = re.compile(r"[^\w\s]+", re.UNICODE)
WS_RE = re.compile(r"\s+")
STOP = {
    "the",
    "a",
    "an",
    "and",
    "or",
    "of",
    "for",
    "to",
    "in",
    "on",
    "with",
    "via",
    "vs",
    "using",
}

# Discord 2000, Telegram 4096, Slack ~4000. Leave headroom for cron wrap.
CHANNEL_BUDGET = {
    "discord": 1800,
    "telegram": 3800,
    "slack": 3600,
    "origin": 3800,
    "generic": 3800,
}


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime | None = None) -> str:
    return (dt or utcnow()).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_iso(value: str) -> datetime:
    value = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def skill_dir() -> Path:
    env = os.environ.get("HERMES_SKILL_DIR")
    if env:
        p = Path(env).expanduser()
        if p.is_dir():
            return p
    return Path(__file__).resolve().parent.parent


def hermes_home() -> Path:
    env = os.environ.get("HERMES_HOME")
    if env:
        return Path(env).expanduser()
    return Path.home() / ".hermes"


def default_data_dir() -> Path:
    d = hermes_home() / "data" / "ai-frontier-scout"
    d.mkdir(parents=True, exist_ok=True)
    return d


def ledger_path(data_dir: Path) -> Path:
    return data_dir / "ledger.json"


def normalize(title: str) -> str:
    s = unicodedata.normalize("NFKD", title or "")
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower().replace("–", "-").replace("—", "-").replace("’", "'")
    s = PUNCT_RE.sub(" ", s)
    s = WS_RE.sub(" ", s).strip()
    return s


def tokens(text: str) -> set[str]:
    return {t for t in normalize(text).split() if t and t not in STOP and len(t) > 1}


def jaccard(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


def topic_id(normalized_title: str) -> str:
    return hashlib.sha1(normalized_title.encode("utf-8")).hexdigest()[:16]


def extract_arxiv_ids(*parts: str) -> list[str]:
    found: list[str] = []
    for part in parts:
        for match in ARXIV_RE.findall(part or ""):
            if match not in found:
                found.append(match)
    return found


def normalize_url(url: str) -> str:
    u = (url or "").strip()
    if not u:
        return ""
    u = re.sub(r"^https?://", "", u, flags=re.I)
    u = u.lower().rstrip("/")
    u = re.sub(r"^www\.", "", u)
    return u


def composite_of(scores: dict[str, Any]) -> float:
    total = 0.0
    for key, weight in WEIGHTS.items():
        total += float(scores.get(key, 0)) * weight
    return round(total, 2)


def band_of(composite: float) -> str:
    if composite >= 8.5:
        return "S"
    if composite >= 7.5:
        return "A"
    if composite >= 6.5:
        return "B"
    if composite >= 5.5:
        return "C"
    return "D"


def empty_ledger() -> dict[str, Any]:
    now = iso()
    return {
        "version": 1,
        "created_at": now,
        "updated_at": now,
        "ttl_days": TTL_DAYS,
        "limit": LIMIT,
        "entries": [],
        "runs": [],
    }


def load_ledger(path: Path) -> dict[str, Any]:
    if not path.exists():
        return empty_ledger()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return empty_ledger()
    if not isinstance(data, dict) or "entries" not in data:
        return empty_ledger()
    data.setdefault("ttl_days", TTL_DAYS)
    data.setdefault("limit", LIMIT)
    data.setdefault("runs", [])
    data.setdefault("version", 1)
    return data


def save_ledger(path: Path, ledger: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(ledger, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    tmp.replace(path)


def entry_active(entry: dict[str, Any], ttl_days: int, now: datetime) -> bool:
    last = entry.get("last_seen") or entry.get("first_seen")
    if not last:
        return True
    try:
        seen = parse_iso(str(last))
    except ValueError:
        return True
    return now - seen <= timedelta(days=ttl_days)


def load_topics(raw: Any) -> list[dict[str, Any]]:
    if raw is None:
        return []
    if isinstance(raw, list):
        return [t for t in raw if isinstance(t, dict)]
    if isinstance(raw, dict):
        topics = raw.get("topics", raw.get("candidates", []))
        if isinstance(topics, list):
            return [t for t in topics if isinstance(t, dict)]
    return []


def read_input(path: str | None) -> Any:
    if not path or path == "-":
        text = sys.stdin.read()
    else:
        text = Path(path).read_text(encoding="utf-8")
    text = text.strip()
    if not text:
        return {"topics": []}
    return json.loads(text)


def topic_urls(topic: dict[str, Any]) -> list[str]:
    urls: list[str] = []
    for item in topic.get("sources") or []:
        if isinstance(item, dict) and item.get("url"):
            urls.append(str(item["url"]))
        elif isinstance(item, str):
            urls.append(item)
    for extra in topic.get("urls") or []:
        urls.append(str(extra))
    return urls


def topic_arxiv(topic: dict[str, Any]) -> list[str]:
    parts = [str(topic.get("title") or ""), str(topic.get("summary") or "")]
    parts.extend(topic_urls(topic))
    parts.extend(str(a) for a in (topic.get("arxiv_ids") or []))
    parts.extend(str(a) for a in (topic.get("aliases") or []))
    return extract_arxiv_ids(*parts)


def topic_aliases(topic: dict[str, Any]) -> list[str]:
    aliases = [str(topic.get("title") or "")]
    for a in topic.get("aliases") or []:
        aliases.append(str(a))
    return [a for a in aliases if a.strip()]


def match_reason(topic: dict[str, Any], entry: dict[str, Any]) -> str | None:
    title = str(topic.get("title") or "")
    norm = normalize(title)
    if not norm:
        return "empty-title"
    if topic_id(norm) == entry.get("id"):
        return f"id:{entry.get('id')}"
    entry_norm = str(entry.get("normalized") or "")
    if norm == entry_norm:
        return f"title:{entry.get('title')}"
    for alias in topic_aliases(topic):
        n = normalize(alias)
        if n and n == entry_norm:
            return f"alias:{entry.get('title')}"
        for existing_alias in entry.get("aliases") or []:
            if n and n == normalize(str(existing_alias)):
                return f"alias:{existing_alias}"
    t_arxiv = set(topic_arxiv(topic))
    e_arxiv = set(entry.get("arxiv_ids") or [])
    hit = t_arxiv & e_arxiv
    if hit:
        return f"arxiv:{sorted(hit)[0]}"
    t_urls = {normalize_url(u) for u in topic_urls(topic) if normalize_url(u)}
    e_urls = {normalize_url(u) for u in (entry.get("urls") or []) if normalize_url(u)}
    url_hit = t_urls & e_urls
    if url_hit:
        return f"url:{sorted(url_hit)[0]}"
    if entry_norm:
        ratio = SequenceMatcher(None, norm, entry_norm).ratio()
        if ratio >= FUZZY_RATIO:
            return f"fuzzy:{ratio:.2f}:{entry.get('title')}"
        jac = jaccard(tokens(norm), tokens(entry_norm))
        if jac >= JACCARD and min(len(tokens(norm)), len(tokens(entry_norm))) >= 3:
            return f"jaccard:{jac:.2f}:{entry.get('title')}"
    return None


def filter_topics(
    topics: list[dict[str, Any]], ledger: dict[str, Any], now: datetime | None = None
) -> dict[str, Any]:
    now = now or utcnow()
    ttl = int(ledger.get("ttl_days") or TTL_DAYS)
    active = [e for e in ledger.get("entries") or [] if entry_active(e, ttl, now)]
    kept: list[dict[str, Any]] = []
    skipped: list[dict[str, Any]] = []
    seen_this_batch: list[dict[str, Any]] = []

    for topic in topics:
        title = str(topic.get("title") or "").strip()
        if not title:
            skipped.append({"title": title, "reason": "empty-title"})
            continue
        reason = None
        for entry in active:
            reason = match_reason(topic, entry)
            if reason:
                break
        if reason is None:
            for prior in seen_this_batch:
                reason = match_reason(topic, prior)
                if reason:
                    reason = f"batch-{reason}"
                    break
        if reason:
            skipped.append({"title": title, "reason": reason})
            continue
        norm = normalize(title)
        shadow = {
            "id": topic_id(norm),
            "title": title,
            "normalized": norm,
            "aliases": topic_aliases(topic),
            "urls": topic_urls(topic),
            "arxiv_ids": topic_arxiv(topic),
        }
        seen_this_batch.append(shadow)
        kept.append(topic)
    return {
        "kept": kept,
        "skipped": skipped,
        "seen_count": len(active),
        "ttl_days": ttl,
    }


def ensure_scores(topic: dict[str, Any]) -> dict[str, int]:
    raw = topic.get("scores") or {}
    out: dict[str, int] = {}
    for key in SCORE_KEYS:
        try:
            val = int(round(float(raw.get(key, 0))))
        except (TypeError, ValueError):
            val = 0
        out[key] = max(1, min(10, val)) if raw.get(key) is not None else 0
        if out[key] == 0:
            out[key] = 1
    return out


def score_topics(topics: list[dict[str, Any]], limit: int = LIMIT) -> list[dict[str, Any]]:
    scored: list[dict[str, Any]] = []
    for topic in topics:
        item = dict(topic)
        scores = ensure_scores(item)
        item["scores"] = scores
        item["composite"] = composite_of(scores)
        item["band"] = band_of(item["composite"])
        cat = str(item.get("category") or "niche").strip().lower().replace(" ", "-")
        if cat not in CATEGORIES:
            cat = "niche"
        item["category"] = cat
        item["title"] = str(item.get("title") or "").strip()
        item["summary"] = str(item.get("summary") or "").strip()
        item["why_now"] = str(item.get("why_now") or "").strip()
        scored.append(item)
    scored.sort(key=lambda t: (-float(t["composite"]), -int(t["scores"]["growth"]), t["title"]))
    return scored[: max(0, limit)]


def record_topics(
    ledger: dict[str, Any], topics: list[dict[str, Any]], run_id: str | None = None
) -> dict[str, Any]:
    now = utcnow()
    now_s = iso(now)
    run_id = run_id or now.strftime("%Y%m%dT%H%M%SZ")
    entries: list[dict[str, Any]] = list(ledger.get("entries") or [])
    by_id = {e.get("id"): i for i, e in enumerate(entries) if e.get("id")}
    recorded = 0
    for topic in topics:
        title = str(topic.get("title") or "").strip()
        if not title:
            continue
        norm = normalize(title)
        tid = topic_id(norm)
        urls = topic_urls(topic)
        arxiv_ids = topic_arxiv(topic)
        aliases = topic_aliases(topic)
        payload = {
            "id": tid,
            "title": title,
            "normalized": norm,
            "aliases": aliases,
            "urls": urls,
            "arxiv_ids": arxiv_ids,
            "category": topic.get("category"),
            "composite": topic.get("composite"),
            "band": topic.get("band"),
            "last_seen": now_s,
        }
        if tid in by_id:
            existing = entries[by_id[tid]]
            existing.update(payload)
            existing.setdefault("first_seen", now_s)
            runs = list(existing.get("run_ids") or [])
            if run_id not in runs:
                runs.append(run_id)
            existing["run_ids"] = runs[-20:]
        else:
            payload["first_seen"] = now_s
            payload["run_ids"] = [run_id]
            by_id[tid] = len(entries)
            entries.append(payload)
        recorded += 1
    ledger["entries"] = entries
    ledger["updated_at"] = now_s
    runs = list(ledger.get("runs") or [])
    runs.append(
        {
            "id": run_id,
            "at": now_s,
            "recorded": recorded,
            "titles": [str(t.get("title")) for t in topics[:LIMIT]],
        }
    )
    ledger["runs"] = runs[-100:]
    return {"recorded": recorded, "total": len(entries), "run_id": run_id}


def reset_ledger(ledger: dict[str, Any], older_than: int | None) -> dict[str, Any]:
    if older_than is None:
        created = ledger.get("created_at") or iso()
        fresh = empty_ledger()
        fresh["created_at"] = created
        return fresh
    now = utcnow()
    kept = [
        e
        for e in ledger.get("entries") or []
        if entry_active(e, older_than, now)
    ]
    ledger["entries"] = kept
    ledger["updated_at"] = iso(now)
    return ledger


def compact(text: str, n: int) -> str:
    text = WS_RE.sub(" ", (text or "").strip())
    if len(text) <= n:
        return text
    return text[: n - 1].rstrip() + "…"


def source_label(topic: dict[str, Any]) -> str:
    bits: list[str] = []
    arxiv_ids = topic_arxiv(topic)
    if arxiv_ids:
        bits.append(f"arxiv:{arxiv_ids[0]}")
    for src in topic.get("sources") or []:
        if isinstance(src, dict) and src.get("url"):
            url = str(src["url"])
            if arxiv_ids and "arxiv.org" in url:
                continue
            bits.append(url)
        elif isinstance(src, str):
            bits.append(src)
        if len(bits) >= 2:
            break
    return " · ".join(bits[:2])


def format_topic_line(i: int, topic: dict[str, Any], tight: bool) -> str:
    scores = topic.get("scores") or {}
    title = compact(str(topic.get("title") or "Untitled"), 72 if tight else 88)
    band = topic.get("band") or band_of(float(topic.get("composite") or 0))
    comp = float(topic.get("composite") or 0)
    cat = str(topic.get("category") or "niche")
    s = int(scores.get("scalability") or 0)
    a = int(scores.get("accessibility") or 0)
    g = int(scores.get("growth") or 0)
    d = int(scores.get("adaptability") or 0)
    why = compact(str(topic.get("why_now") or topic.get("summary") or ""), 140 if tight else 180)
    src = compact(source_label(topic), 90 if tight else 120)
    lines = [
        f"{i}. {title}  {band} {comp:.1f}",
        f"   {cat} · sc {s} · ac {a} · gr {g} · ad {d}",
    ]
    if why:
        lines.append(f"   {why}")
    if src:
        lines.append(f"   {src}")
    return "\n".join(lines)


def format_brief(
    topics: list[dict[str, Any]],
    skipped: int = 0,
    channel: str = "origin",
    generated_at: datetime | None = None,
) -> str:
    channel = channel if channel in CHANNEL_BUDGET else "origin"
    budget = CHANNEL_BUDGET[channel]
    now = generated_at or utcnow()
    date = now.strftime("%d %b %Y")
    topics = topics[:LIMIT]
    n = len(topics)
    header = f"AI Frontier Scout · {date}\n{n} new · {skipped} repeats suppressed"
    if n == 0:
        body = (
            "No new emerging-AI topics cleared the ledger and source bar this run. "
            "The watchlist is up to date."
        )
        return f"{header}\n\n{body}"

    tight = False
    while True:
        blocks = [format_topic_line(i + 1, t, tight) for i, t in enumerate(topics)]
        footer = "sc scale · ac access · gr growth · ad adapt · band S≥8.5 A≥7.5 B≥6.5"
        text = header + "\n\n" + "\n\n".join(blocks) + "\n\n" + footer
        if len(text) <= budget or tight:
            if len(text) > budget:
                text = text[: budget - 1].rstrip() + "…"
            return text
        tight = True


def status_payload(ledger: dict[str, Any]) -> dict[str, Any]:
    now = utcnow()
    ttl = int(ledger.get("ttl_days") or TTL_DAYS)
    entries = ledger.get("entries") or []
    active = [e for e in entries if entry_active(e, ttl, now)]
    recent = sorted(active, key=lambda e: str(e.get("last_seen") or ""), reverse=True)[:15]
    last_run = (ledger.get("runs") or [{}])[-1] if ledger.get("runs") else {}
    return {
        "ok": True,
        "version": VERSION,
        "seen_count": len(active),
        "seen_total": len(entries),
        "ttl_days": ttl,
        "limit": int(ledger.get("limit") or LIMIT),
        "updated_at": ledger.get("updated_at"),
        "last_run": last_run,
        "recent_titles": [e.get("title") for e in recent],
        "data_hint": str(hermes_home() / "data" / "ai-frontier-scout" / "ledger.json"),
    }


def cron_help_text() -> str:
    prompt = (
        "Run the ai-frontier-scout skill exactly as written. Research emerging AI "
        "technologies across methodologies, business models, industries, niches, "
        "case studies, papers, and unexplored frontiers. Score each on scalability, "
        "accessibility, growth potential, and adaptability using the skill rubric. "
        "Report at most 10 NEW topics. Skip anything already in the seen ledger. "
        "Your final response is the messaging-ready brief. Do not call send_message."
    )
    return "\n".join(
        [
            "# Hermes CLI",
            'hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "'
            + prompt
            + '"',
            "",
            "# In chat",
            "Every weekday at 8am, run ai-frontier-scout and send me the brief.",
            "",
            "# PowerShell (same CLI)",
            'hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "'
            + prompt
            + '"',
        ]
    )


def dump(data: Any) -> None:
    sys.stdout.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="scout.py", description="AI Frontier Scout helper")
    p.add_argument("--data-dir", default=None, help="Override ledger directory")
    p.add_argument("--json", action="store_true", help="Force JSON output where applicable")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("status", help="Print ledger status")
    sub.add_parser("init", help="Create data dir and empty ledger")
    sub.add_parser("cron-help", help="Print schedule commands")

    pf = sub.add_parser("filter", help="Drop topics already in the ledger")
    pf.add_argument("--input", default="-", help="JSON file or - for stdin")

    ps = sub.add_parser("score", help="Fill composite + band, cut to 10")
    ps.add_argument("--input", default="-")
    ps.add_argument("--limit", type=int, default=LIMIT)

    pr = sub.add_parser("record", help="Persist topics as seen")
    pr.add_argument("--input", default="-")
    pr.add_argument("--run-id", default=None)

    fm = sub.add_parser("format", help="Print messaging-ready brief")
    fm.add_argument("--input", default="-")
    fm.add_argument("--channel", default="origin", choices=sorted(CHANNEL_BUDGET))
    fm.add_argument("--limit", type=int, default=LIMIT)
    fm.add_argument("--skipped", type=int, default=0)

    rs = sub.add_parser("reset", help="Clear or prune the ledger")
    rs.add_argument("--older-than", type=int, default=None, metavar="DAYS")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    data_dir = Path(args.data_dir).expanduser() if args.data_dir else default_data_dir()
    data_dir.mkdir(parents=True, exist_ok=True)
    path = ledger_path(data_dir)
    ledger = load_ledger(path)

    if args.cmd == "init":
        if not path.exists():
            save_ledger(path, empty_ledger())
        dump({"ok": True, "ledger": str(path)})
        return 0

    if args.cmd == "status":
        dump(status_payload(ledger))
        return 0

    if args.cmd == "cron-help":
        sys.stdout.write(cron_help_text() + "\n")
        return 0

    if args.cmd == "reset":
        ledger = reset_ledger(ledger, args.older_than)
        save_ledger(path, ledger)
        dump({"ok": True, "seen_count": len(ledger.get("entries") or [])})
        return 0

    payload = read_input(args.input)
    topics = load_topics(payload)
    extra_skipped = 0
    if isinstance(payload, dict):
        extra_skipped = int(payload.get("skipped_count") or 0)

    if args.cmd == "filter":
        result = filter_topics(topics, ledger)
        dump(result)
        return 0

    if args.cmd == "score":
        scored = score_topics(topics, limit=args.limit)
        dump({"topics": scored, "count": len(scored)})
        return 0

    if args.cmd == "record":
        scored = score_topics(topics, limit=LIMIT)
        result = record_topics(ledger, scored, run_id=args.run_id)
        save_ledger(path, ledger)
        dump(result)
        return 0

    if args.cmd == "format":
        scored = score_topics(topics, limit=args.limit)
        skipped = args.skipped or extra_skipped
        text = format_brief(scored, skipped=skipped, channel=args.channel)
        if args.json:
            dump({"brief": text, "count": len(scored), "chars": len(text)})
        else:
            sys.stdout.write(text + "\n")
        return 0

    return 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except BrokenPipeError:
        raise SystemExit(0)
