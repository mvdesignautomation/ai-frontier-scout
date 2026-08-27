#!/usr/bin/env python3
"""Stdlib tests for scout.py — no network."""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import scout  # noqa: E402


def topic(title: str, **kwargs):
    base = {
        "title": title,
        "category": kwargs.pop("category", "methodology"),
        "summary": kwargs.pop("summary", "A short summary of the topic."),
        "why_now": kwargs.pop("why_now", "Why this matters now."),
        "scores": kwargs.pop(
            "scores",
            {"scalability": 8, "accessibility": 6, "growth": 9, "adaptability": 7},
        ),
        "sources": kwargs.pop(
            "sources",
            [{"label": "src", "url": f"https://example.com/{title.replace(' ', '-').lower()}"}],
        ),
    }
    base.update(kwargs)
    return base


class NormalizeTests(unittest.TestCase):
    def test_case_punct(self):
        self.assertEqual(
            scout.normalize("Test-Time Compute: Routing!"),
            "test time compute routing",
        )

    def test_accents(self):
        self.assertEqual(scout.normalize("Café résumé"), "cafe resume")


class ScoreTests(unittest.TestCase):
    def test_composite_weights(self):
        scores = {
            "scalability": 10,
            "accessibility": 10,
            "growth": 10,
            "adaptability": 10,
        }
        self.assertEqual(scout.composite_of(scores), 10.0)

    def test_growth_heavier(self):
        high_g = {
            "scalability": 1,
            "accessibility": 1,
            "growth": 10,
            "adaptability": 1,
        }
        high_a = {
            "scalability": 1,
            "accessibility": 10,
            "growth": 1,
            "adaptability": 1,
        }
        self.assertGreater(scout.composite_of(high_g), scout.composite_of(high_a))

    def test_bands(self):
        self.assertEqual(scout.band_of(8.5), "S")
        self.assertEqual(scout.band_of(7.5), "A")
        self.assertEqual(scout.band_of(6.5), "B")
        self.assertEqual(scout.band_of(5.5), "C")
        self.assertEqual(scout.band_of(5.4), "D")

    def test_score_cuts_to_limit(self):
        topics = [
            topic(
                f"Topic {i}",
                scores={
                    "scalability": i % 10 + 1,
                    "accessibility": 5,
                    "growth": i % 10 + 1,
                    "adaptability": 5,
                },
            )
            for i in range(15)
        ]
        out = scout.score_topics(topics, limit=10)
        self.assertEqual(len(out), 10)
        comps = [t["composite"] for t in out]
        self.assertEqual(comps, sorted(comps, reverse=True))


class FilterTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 8, 28, tzinfo=timezone.utc)
        self.ledger = scout.empty_ledger()

    def _record(self, *titles: str, **extra):
        items = [topic(t, **extra) for t in titles]
        scored = scout.score_topics(items)
        scout.record_topics(self.ledger, scored, run_id="t1")

    def test_exact_repeat(self):
        self._record("World Models for Robotics")
        result = scout.filter_topics(
            [topic("World Models for Robotics")], self.ledger, self.now
        )
        self.assertEqual(result["kept"], [])

    def test_fuzzy_rephrase(self):
        self._record("Test-Time Compute Routing as a Product Layer")
        result = scout.filter_topics(
            [topic("Test time compute routing as a product layer")],
            self.ledger,
            self.now,
        )
        self.assertEqual(len(result["kept"]), 0)

    def test_arxiv_id_match(self):
        self._record(
            "Some Paper Title",
            sources=[{"label": "p", "url": "https://arxiv.org/abs/2508.12345"}],
        )
        result = scout.filter_topics(
            [
                topic(
                    "Completely Different Headline",
                    sources=[{"label": "p", "url": "https://arxiv.org/pdf/2508.12345"}],
                )
            ],
            self.ledger,
            self.now,
        )
        self.assertEqual(len(result["kept"]), 0)
        self.assertIn("arxiv:", result["skipped"][0]["reason"])

    def test_url_match(self):
        self._record(
            "Lab Blog One",
            sources=[{"label": "b", "url": "https://openai.com/index/foo/"}],
        )
        result = scout.filter_topics(
            [
                topic(
                    "Unrelated Name",
                    sources=[{"label": "b", "url": "https://www.openai.com/index/foo"}],
                )
            ],
            self.ledger,
            self.now,
        )
        self.assertEqual(len(result["kept"]), 0)

    def test_new_topic_kept(self):
        self._record("AlphaFold 4 Deployment")
        result = scout.filter_topics(
            [topic("On-device Mixture of Experts")], self.ledger, self.now
        )
        self.assertEqual(len(result["kept"]), 1)

    def test_batch_internal_dupes(self):
        result = scout.filter_topics(
            [topic("Same Idea About Agents"), topic("Same idea about agents!")],
            self.ledger,
            self.now,
        )
        self.assertEqual(len(result["kept"]), 1)
        self.assertEqual(len(result["skipped"]), 1)

    def test_expired_ttl_allows_repeat(self):
        self._record("Old News Item")
        self.ledger["entries"][0]["last_seen"] = scout.iso(
            self.now - timedelta(days=120)
        )
        self.ledger["entries"][0]["first_seen"] = self.ledger["entries"][0]["last_seen"]
        result = scout.filter_topics(
            [topic("Old News Item")], self.ledger, self.now
        )
        self.assertEqual(len(result["kept"]), 1)

    def test_empty_title_skipped(self):
        result = scout.filter_topics([topic("   ")], self.ledger, self.now)
        self.assertEqual(result["kept"], [])


class FormatTests(unittest.TestCase):
    def test_limit_ten(self):
        topics = scout.score_topics([topic(f"Emerging Thing {i}") for i in range(12)])
        text = scout.format_brief(topics, skipped=4, channel="origin")
        self.assertIn("10 new", text)
        self.assertIn("4 repeats suppressed", text)
        self.assertNotIn("11.", text)

    def test_discord_budget(self):
        topics = scout.score_topics(
            [
                topic(
                    f"A reasonably long emerging AI topic title number {i} about systems",
                    summary="x" * 400,
                    why_now="y" * 400,
                )
                for i in range(10)
            ]
        )
        text = scout.format_brief(topics, channel="discord")
        self.assertLessEqual(len(text), 1800)

    def test_empty_brief(self):
        text = scout.format_brief([], skipped=9, channel="telegram")
        self.assertIn("0 new", text)
        self.assertIn("No new emerging-AI topics", text)


class CliRoundtripTests(unittest.TestCase):
    def test_record_filter_format(self):
        with tempfile.TemporaryDirectory() as td:
            data_dir = Path(td)
            payload = {
                "topics": [
                    topic("Continual Memory for Agents"),
                    topic("Synthetic Data Foundries"),
                ]
            }
            inp = data_dir / "in.json"
            inp.write_text(json.dumps(payload), encoding="utf-8")
            rc = scout.main(
                ["--data-dir", str(data_dir), "record", "--input", str(inp)]
            )
            self.assertEqual(rc, 0)
            rc = scout.main(
                ["--data-dir", str(data_dir), "filter", "--input", str(inp)]
            )
            self.assertEqual(rc, 0)


if __name__ == "__main__":
    unittest.main()
