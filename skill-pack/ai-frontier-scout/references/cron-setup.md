# Cron setup

Cron jobs run in a **fresh** session. They cannot see your current chat. Put every instruction in the job prompt (the skill already does). The ledger at `~/.hermes/data/ai-frontier-scout/ledger.json` is the repeat memory.

## Accept the blueprint

If install registered a suggestion:

```
/suggestions
/suggestions accept 1
```

## Hermes CLI (Linux, macOS, Windows)

```
hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "Run the ai-frontier-scout skill exactly as written. Research emerging AI technologies across methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Score each on scalability, accessibility, growth potential, and adaptability using the skill rubric. Report at most 10 NEW topics. Skip anything already in the seen ledger. Your final response is the messaging-ready brief. Do not call send_message."
```

Print the same text anytime with:

```
python3 ~/.hermes/skills/ai-frontier-scout/scripts/scout.py cron-help
```

## In chat

```
Every weekday at 8am, run ai-frontier-scout and send me the brief on Telegram.
```

Hermes translates that into a `cronjob` create. Name it **AI Frontier Scout**.

## Delivery targets

| Want | `--deliver` |
| --- | --- |
| Same chat that created the job | `origin` (default on messaging) |
| Telegram home | `telegram` |
| Discord home | `discord` (use `--channel discord` in format) |
| Slack home | `slack` |
| Local files only | `local` |
| Every connected home | `all` |

Do **not** also call `send_message`. The scheduler delivers the final response.

## Cadence

- Weekday morning brief: `0 8 * * 1-5`
- Daily: `0 8 * * *`
- Twice a week: `0 8 * * 1,4`
- Every 12h: `every 12h` (noisy; keep the 10-topic cap)

## Verify

```
hermes cron list
hermes cron run "AI Frontier Scout"
python3 ~/.hermes/skills/ai-frontier-scout/scripts/scout.py status
```

A good first run delivers 1–10 sourced topics and increases `seen_count`. A second immediate run should deliver the empty brief (repeats suppressed).
