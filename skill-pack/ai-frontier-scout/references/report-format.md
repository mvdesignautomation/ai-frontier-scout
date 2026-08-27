# Report format

The delivered message **is** `scout.py format` stdout. Do not add a greeting, a chain-of-thought, or a "let me know if you want more."

## Caps

| Channel | `--channel` | Char budget |
| --- | --- | --- |
| Telegram / origin / generic | `origin` | 3800 |
| Discord | `discord` | 1800 |
| Slack | `slack` | 3600 |

Cron wrap headers consume extra characters. Stay inside the budget.

## Shape

```
AI Frontier Scout · 28 Aug 2026
10 new · 14 repeats suppressed

1. Title  A 7.8
   methodology · sc 8 · ac 6 · gr 9 · ad 7
   Why this is moving this week, in one tight line.
   arxiv:2508.12345 · https://example.com/post

...
```

## Empty run

If filter leaves nothing worth scoring:

```
AI Frontier Scout · 28 Aug 2026
0 new · N repeats suppressed

No new emerging-AI topics cleared the ledger and source bar this run. The watchlist is up to date.
```

That is a successful run. Do not recycle old topics to avoid a short message.

## JSON schema (filter / score / record input)

```json
{
  "topics": [
    {
      "title": "Test-Time Compute Routing",
      "category": "methodology",
      "summary": "≤280 chars",
      "why_now": "≤180 chars",
      "aliases": ["TTC routing", "inference-time search product"],
      "arxiv_ids": ["2508.12345"],
      "scores": {
        "scalability": 8,
        "accessibility": 6,
        "growth": 9,
        "adaptability": 7
      },
      "sources": [
        { "label": "arXiv", "url": "https://arxiv.org/abs/2508.12345" }
      ]
    }
  ]
}
```

`category` must be one of: `methodology`, `business-model`, `industry`, `niche`, `case-study`, `paper`, `unexplored-frontier`.
