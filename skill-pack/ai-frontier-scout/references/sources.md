# Sources

Every delivered topic needs **at least one primary URL**. Secondary roundups (newsletters, Twitter threads) are supporting, not sufficient.

## Source classes (hit ≥4 per run)

1. **Papers** — arXiv `cs.AI`, `cs.LG`, `cs.CL`, `cs.RO`, `cs.CY`; OpenReview; PMLR. Prefer submissions from the last 14 days unless a paper just started moving (citations, reproductions, productization).
2. **Methodologies** — test-time compute, memory, routing, world models, verifiers, synthetic data, distillation, alignment, evals. Lab blogs (DeepMind, OpenAI, Anthropic, Meta FAIR, Microsoft Research, xAI, Mistral, Nous, etc.).
3. **Business models** — inference routing, skill marketplaces, agent hosting, data foundries, eval-as-a-service, on-prem agents, usage-based research APIs. Look at pricing pages and filings, not only announcements.
4. **Industries / niches** — law, medicine, robotics, defense, science, finance, industrial, education. Prefer a named deployment over "AI will transform X."
5. **Case studies** — a specific org, metric, and date. "Company Y cut Z by N% using method M."
6. **Unexplored frontiers** — ideas with thin literature, conflicting results, or a newly opened constraint (regulation, hardware, data). Label uncertainty in `why_now`.

## Suggested queries

Rotate; do not reuse the same four strings every morning.

- `emerging AI methodology 2026`
- `test-time compute OR inference-time scaling`
- `AI agent business model pricing`
- `site:arxiv.org submittedDate cs.AI`
- `world model robotics paper`
- `on-device mixture of experts mobile`
- `AI regulation deployment case study`
- `synthetic data foundry startup`
- `continual memory language model`
- `failed AI pilot 2026` (counter-signal)

## Hygiene

- Prefer dated pages. Drop undated listicles.
- Record arXiv IDs in `arxiv_ids` and canonical abs URLs.
- Put product names and paper titles in `aliases` so the ledger can catch rephrases.
- One counter-signal per run (replication failure, pulled product, regulatory block) if you can source it — it calibrates the rest.
