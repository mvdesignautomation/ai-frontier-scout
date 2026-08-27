# AI Frontier Scout

A [Hermes Agent](https://hermes-agent.nousresearch.com/) skill that researches **emerging AI technologies** — methodologies, business models, industries, niches, case studies, papers, unexplored frontiers — and returns a scored briefing.

Each run delivers **at most 10 new topics**. A durable ledger suppresses repeats. Results go out through Hermes messaging (Telegram, Discord, Slack, …) when you attach the skill to a cron job.

This folder **is** the GitHub repository. Upload it as-is.

## What you get

| Axis | Question |
| --- | --- |
| Scalability | Can this spread without elite-talent bottlenecks? |
| Accessibility | Who can use or build on it in 12 months? |
| Growth potential | Are demand, capital, and capability aligned? |
| Adaptability | Does it survive a model swap or a new domain? |

Composite = `0.30·growth + 0.25·scale + 0.25·adapt + 0.20·access`. Bands: S ≥ 8.5, A ≥ 7.5, B ≥ 6.5, C ≥ 5.5.

## Install

### Hermes terminal (any OS)

After this folder is on GitHub as `YOURUSER/ai-frontier-scout`:

```bash
hermes skills install YOURUSER/ai-frontier-scout
```

or from the raw skill file (Hermes also pulls referenced `scripts/`, `references/`, `templates/`, `examples/`):

```bash
hermes skills install https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/SKILL.md
```

Local copy (no GitHub yet):

```bash
mkdir -p ~/.hermes/skills/ai-frontier-scout
cp -R . ~/.hermes/skills/ai-frontier-scout
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.hermes\skills\ai-frontier-scout"
Copy-Item -Recurse -Force .\* "$env:USERPROFILE\.hermes\skills\ai-frontier-scout"
```

### One-liner from this repo

Linux / macOS:

```bash
./install.sh
# after push:
curl -fsSL https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.sh \
  | AI_FRONTIER_SCOUT_REPO=YOURUSER/ai-frontier-scout bash
```

PowerShell:

```powershell
.\install.ps1
# after push:
$env:AI_FRONTIER_SCOUT_REPO = "YOURUSER/ai-frontier-scout"
irm https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.ps1 | iex
```

Verify:

```bash
hermes skills list
python3 ~/.hermes/skills/ai-frontier-scout/scripts/scout.py status
```

## Schedule (cron)

In Hermes chat:

```
Every weekday at 8am, run ai-frontier-scout and send me the brief.
```

CLI / PowerShell (same command):

```bash
hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "Run the ai-frontier-scout skill exactly as written. Research emerging AI technologies across methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Score each on scalability, accessibility, growth potential, and adaptability using the skill rubric. Report at most 10 NEW topics. Skip anything already in the seen ledger. Your final response is the messaging-ready brief. Do not call send_message."
```

`--deliver origin` returns to the chat that created the job. Use `telegram`, `discord`, `slack`, or `all` as needed. Do not also call `send_message`.

If install registered a blueprint suggestion: `/suggestions` then `/suggestions accept 1`.

Full notes: [references/cron-setup.md](references/cron-setup.md).

## Repeat suppression

Seen topics live in `~/.hermes/data/ai-frontier-scout/ledger.json` (Windows: `%USERPROFILE%\.hermes\data\ai-frontier-scout\ledger.json`). Matches:

- Normalized titles
- Aliases
- Canonical URLs
- arXiv IDs
- Fuzzy / token overlap

Default TTL is 90 days. `scout.py reset --older-than 90` prunes; `scout.py reset` clears.

## Layout

```
ai-frontier-scout/
├── SKILL.md                 # Hermes skill (required)
├── install.sh               # Linux / macOS
├── install.ps1              # Windows
├── scripts/scout.py         # ledger, score, format
├── scripts/test_scout.py
├── references/              # rubric, sources, format, cron
├── templates/report.md
└── examples/
```

Python 3.10+, **stdlib only**.

```bash
python3 scripts/test_scout.py -q
```

## Manual run

```
/ai-frontier-scout
```

or: `Scout emerging AI this week and send me the scored brief.`

## License

MIT. Compatible with [agentskills.io](https://agentskills.io) and Hermes Agent.
