import type { Band, Scores } from "./types";
import { WEIGHTS } from "./types";

export function compositeOf(scores: Scores): number {
  const total =
    scores.growth * WEIGHTS.growth +
    scores.scalability * WEIGHTS.scalability +
    scores.adaptability * WEIGHTS.adaptability +
    scores.accessibility * WEIGHTS.accessibility;
  return Math.round(total * 100) / 100;
}

export function bandOf(composite: number): Band {
  if (composite >= 8.5) return "S";
  if (composite >= 7.5) return "A";
  if (composite >= 6.5) return "B";
  if (composite >= 5.5) return "C";
  return "D";
}

export function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(10, Math.round(n)));
}
