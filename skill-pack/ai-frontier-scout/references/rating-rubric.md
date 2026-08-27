# Rating rubric

Score each axis as an **integer 1–10**. Do not use halves. Composite and band are computed by `scripts/scout.py` — do not hand-round them.

Weights: growth 0.30, scalability 0.25, adaptability 0.25, accessibility 0.20.

Bands: **S** ≥ 8.5 · **A** ≥ 7.5 · **B** ≥ 6.5 · **C** ≥ 5.5 · **D** below.

## Scalability

Can this spread without a linear explosion in elite talent, proprietary data, or single-vendor compute?

| Score | Anchor |
| --- | --- |
| 1–2 | Lab toy. One team, one cluster, no path to more users. |
| 3–4 | Works in a narrow stack; replication needs the original authors. |
| 5–6 | Documented enough that a strong lab can reproduce in weeks. |
| 7–8 | Horizontal: APIs, open weights, or a playbook others are already copying. |
| 9–10 | Compounding infrastructure — more users make it cheaper or better. |

## Accessibility

Who can actually use or build on this in the next 12 months?

| Score | Anchor |
| --- | --- |
| 1–2 | Closed, waitlisted, or export-controlled. No public artifact. |
| 3–4 | Paper only, or access limited to a few partners. |
| 5–6 | Open paper + partial code, or a paid API with reasonable onboarding. |
| 7–8 | Runnable by a competent engineer in a day (docs, weights, or API). |
| 9–10 | Usable by non-researchers: productized, cheap, or on-device. |

## Growth potential

Is demand, capital, and capability pulling in the same direction?

| Score | Anchor |
| --- | --- |
| 1–2 | Shrinking interest; a 2023 meme with no 2026 buyers. |
| 3–4 | Academic curiosity; no budget line. |
| 5–6 | Real pilots, unclear expansion. |
| 7–8 | Multiple independent buyers or labs investing now. |
| 9–10 | Category-creating: new spend, new headcount, new vendors forming. |

## Adaptability

Does it transfer across tasks, industries, or model generations — or die when the base model changes?

| Score | Anchor |
| --- | --- |
| 1–2 | Overfit to one model version or one regulation. |
| 3–4 | Tied to a single vendor's undocumented behavior. |
| 5–6 | Portable with non-trivial rework. |
| 7–8 | Method/pattern survives a model swap; documented interfaces. |
| 9–10 | Model-agnostic infrastructure or a general scientific method. |

## Scoring rules

- Score the **topic as it exists this week**, not the utopian roadmap.
- If evidence conflicts, take the **lower** score and say so in `why_now`.
- A paper with no artifact caps **accessibility** at 6.
- A closed product with huge distribution can still score high on growth and scale.
- Do not average "vibes." Each axis needs a one-line justification in your private notes; only `why_now` is published.
