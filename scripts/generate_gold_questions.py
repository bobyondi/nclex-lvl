#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


NOISE_MARKERS = [
    "Close Explanation",
    "Peer Comparison",
    "Difficulty level:",
    "Browse Mode",
    "Incorrect Answers:",
]

NOISE_LINE_PATTERNS = [
    re.compile(r"^\s*[A-G]\s*\|\s*\d+%.*$", re.I),
    re.compile(r"^\s*[A-G]\s+I\s+\d+%.*$", re.I),
    re.compile(r"^\s*a\s*=\s*.*$", re.I),
]


@dataclass
class Stats:
    total_rows: int = 0
    kept_rows: int = 0
    dropped_rows: int = 0
    repaired_correct: int = 0
    repaired_stem: int = 0
    repaired_rationale: int = 0
    dropped_bad_choices: int = 0
    dropped_bad_stem: int = 0
    dropped_bad_correct: int = 0
    dropped_noisy_choice: int = 0


def squash_ws(text: str) -> str:
    text = text.replace("\u202f", " ").replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean_text(text: str) -> str:
    if not text:
        return ""
    t = text
    for m in NOISE_MARKERS:
        idx = t.find(m)
        if idx != -1:
            t = t[:idx]
    t = t.replace("Anurse", "A nurse").replace("Aclient", "A client").replace("Anewborn", "A newborn")
    # Strip scoring artifacts commonly injected by OCR
    t = re.sub(r"\b[A-G]\s*\|\s*\d+%[A-Za-z ]*", " ", t)
    t = re.sub(r"\b[A-G]\s+I\s+\d+%[A-Za-z ]*", " ", t)
    t = re.sub(r"\b\d+%\b", " ", t)
    t = re.sub(r"\ba\s*=\s*®.*$", " ", t, flags=re.I)
    return squash_ws(t)


def clean_choice_text(text: str) -> str:
    t = clean_text(text)
    # Remove common OCR score overlays and grading labels.
    t = re.sub(r"\b\d+%\b", " ", t)
    t = re.sub(r"\b(hard|moderate|easy)\b", " ", t, flags=re.I)
    t = re.sub(r"\b(all|peer)\b", " ", t, flags=re.I)
    t = re.sub(r"[|]+", " ", t)
    t = squash_ws(t)
    return t


def strip_options_from_stem(stem: str) -> str:
    # If options got appended to stem (e.g., "O A. ... O B. ..."), trim at first option marker.
    markers = [
        r"\sO\sA\.\s",
        r"\sA\.\s",
    ]
    out = stem
    for marker in markers:
        m = re.search(marker, out)
        if m and m.start() > 35:
            out = out[: m.start()]
            break
    return clean_text(out)


def parse_options_from_stem(stem_raw: str) -> dict[str, str]:
    """
    Extract option texts from noisy stems such as:
    "... O A. ... O B. ... O C. ... O D. ..."
    """
    text = stem_raw.replace("\n", " ")
    # Start at first "O A."
    start = re.search(r"\bO\s*A\.\s", text)
    if not start:
        return {}
    opt_text = text[start.start() :]
    # Split by option tokens while preserving marker
    parts = re.split(r"\bO\s*([A-G])\.\s", opt_text)
    # parts => [prefix, id1, text1, id2, text2, ...]
    out: dict[str, str] = {}
    if len(parts) < 3:
        return out
    for i in range(1, len(parts) - 1, 2):
        cid = parts[i].lower().strip()
        txt = clean_text(parts[i + 1])
        # stop if we've rolled into explanation section
        for marker in NOISE_MARKERS:
            idx = txt.find(marker)
            if idx != -1:
                txt = txt[:idx].strip()
        txt = clean_text(txt)
        if cid in {"a", "b", "c", "d", "e", "f", "g"} and txt:
            out[cid] = txt
    return out


def parse_json_maybe(value: str) -> Any:
    if not value:
        return None
    v = value.strip()
    if not v:
        return None
    try:
        return json.loads(v)
    except Exception:
        return None


def normalize_choices(raw_choices: str) -> list[dict[str, str]]:
    parsed = parse_json_maybe(raw_choices)
    if not isinstance(parsed, list):
        return []
    out: list[dict[str, str]] = []
    seen = set()
    for item in parsed:
        if not isinstance(item, dict):
            continue
        cid = str(item.get("id", "")).strip().lower()
        txt = clean_choice_text(str(item.get("t", "")).strip())
        if cid not in {"a", "b", "c", "d", "e", "f", "g"}:
            continue
        if not txt:
            continue
        if cid in seen:
            continue
        seen.add(cid)
        out.append({"id": cid, "t": txt})
    return out


def merge_choices(choice_list: list[dict[str, str]], stem_options: dict[str, str], correct_letters: list[str]) -> list[dict[str, str]]:
    by_id: dict[str, str] = {c["id"]: c["t"] for c in choice_list}

    # Fill missing choices from stem-parsed options.
    for cid, txt in stem_options.items():
        cleaned = clean_choice_text(txt)
        if not cleaned:
            continue
        if cid not in by_id or len(by_id[cid]) < 12 or is_noisy_choice(by_id[cid]):
            by_id[cid] = cleaned

    # Ensure all correct letters exist as fallback placeholders.
    for cid in correct_letters:
        if cid not in by_id:
            by_id[cid] = f"Option {cid.upper()} (text recovered from OCR is incomplete)."

    # Keep in alphabetical order for stable UX.
    merged = [{"id": cid, "t": by_id[cid]} for cid in sorted(by_id.keys())]
    return merged


def normalize_correct(raw_correct: str, choices: list[dict[str, str]]) -> str | list[str] | None:
    choice_ids = {c["id"] for c in choices}
    if not choice_ids:
        return None

    letters = re.findall(r"[A-Ga-g]", raw_correct or "")
    if not letters:
        return None
    uniq: list[str] = []
    for ch in letters:
        ch = ch.lower()
        if ch in choice_ids and ch not in uniq:
            uniq.append(ch)
    if not uniq:
        return None
    if len(uniq) == 1:
        return uniq[0]
    return uniq


def parse_correct_letters(raw_correct: str) -> list[str]:
    letters = re.findall(r"[A-Ga-g]", raw_correct or "")
    uniq: list[str] = []
    for ch in letters:
        c = ch.lower()
        if c not in uniq:
            uniq.append(c)
    return uniq


def looks_like_garbage(text: str) -> bool:
    if not text or len(text) < 20:
        return True
    alnum = sum(ch.isalnum() for ch in text)
    ratio = alnum / max(len(text), 1)
    return ratio < 0.55


def is_noisy_choice(text: str) -> bool:
    t = text.strip()
    if not t:
        return True
    if re.search(r"\b\d+%\b", t):
        return True
    if re.search(r"\b(hard|moderate|easy)\b", t, flags=re.I):
        return True
    if "|" in t:
        return True
    if "peer comparison" in t.lower() or "browse mode" in t.lower():
        return True
    if re.match(r"^[ivx]+\b", t.lower()):
        return True
    if t.lower().startswith(("i ", "ii ", "iii ")):
        return True
    if len(t) < 4:
        return True
    return False


def build_gold(csv_path: Path) -> tuple[dict[str, list[dict[str, Any]]], list[dict[str, Any]], Stats]:
    stats = Stats()
    banks: dict[str, list[dict[str, Any]]] = defaultdict(list)
    dropped: list[dict[str, Any]] = []

    with csv_path.open(newline="", encoding="utf-8", errors="ignore") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            stats.total_rows += 1
            qid_raw = row.get("id", "").strip()
            bank = row.get("bank", "").strip()
            cat = clean_text(row.get("cat", "").strip()) or "General"
            stem_raw = row.get("stem", "")
            rationale_raw = row.get("rationale", "")
            why_not_raw = row.get("why_not", "")
            key_concept_raw = row.get("key_concept", "")

            correct_letters = parse_correct_letters(row.get("correct", ""))
            choices = normalize_choices(row.get("choices", ""))
            stem_options = parse_options_from_stem(stem_raw)

            # Prefer stem-derived options when available; they are often cleaner than OCR'd choices JSON.
            if len(stem_options) >= 2:
                stem_choice_list = [{"id": k, "t": clean_choice_text(v)} for k, v in sorted(stem_options.items())]
                stem_choice_list = [c for c in stem_choice_list if c["t"]]
                choices = merge_choices(stem_choice_list, stem_options, correct_letters)
            else:
                choices = merge_choices(choices, stem_options, correct_letters)
            if len(choices) < 2:
                stats.dropped_rows += 1
                stats.dropped_bad_choices += 1
                dropped.append({"id": qid_raw, "bank": bank, "reason": "bad_choices"})
                continue
            # Remove noisy distractors when enough clean options remain.
            filtered = [c for c in choices if not is_noisy_choice(c["t"])]
            filtered_ids = {c["id"] for c in filtered}
            if isinstance(normalize_correct(row.get("correct", ""), choices), list):
                needed = set(parse_correct_letters(row.get("correct", "")))
            else:
                needed = set(parse_correct_letters(row.get("correct", ""))[:1])
            if len(filtered) >= 2 and needed.issubset(filtered_ids):
                choices = filtered

            if any(is_noisy_choice(c["t"]) for c in choices):
                stats.dropped_rows += 1
                stats.dropped_noisy_choice += 1
                dropped.append({"id": qid_raw, "bank": bank, "reason": "noisy_choice"})
                continue

            stem = strip_options_from_stem(stem_raw)
            if stem != squash_ws(stem_raw):
                stats.repaired_stem += 1
            if looks_like_garbage(stem):
                stats.dropped_rows += 1
                stats.dropped_bad_stem += 1
                dropped.append({"id": qid_raw, "bank": bank, "reason": "bad_stem"})
                continue

            correct = normalize_correct(row.get("correct", ""), choices)
            if correct is None:
                stats.dropped_rows += 1
                stats.dropped_bad_correct += 1
                dropped.append({"id": qid_raw, "bank": bank, "reason": "bad_correct"})
                continue
            if row.get("correct", "") not in {"{" + (correct if isinstance(correct, str) else ",".join(correct)) + "}"}:
                stats.repaired_correct += 1

            rationale = clean_text(rationale_raw)
            key_concept = clean_text(key_concept_raw)
            if len(rationale) < 45 and key_concept:
                rationale = key_concept
                stats.repaired_rationale += 1
            if len(rationale) < 45:
                rationale = f"Use clinical judgment to prioritize safety and select the best answer based on the client scenario."
                stats.repaired_rationale += 1

            why_not = parse_json_maybe(why_not_raw)
            if not isinstance(why_not, dict):
                why_not = None
            else:
                norm = {}
                for k, v in why_not.items():
                    kk = str(k).strip().lower()
                    if kk in {c['id'] for c in choices}:
                        vv = clean_text(str(v))
                        if vv:
                            norm[kk] = vv
                why_not = norm or None

            try:
                qid = int(qid_raw)
            except Exception:
                qid = 0

            q = {
                "id": qid,
                "cat": cat,
                "stem": stem,
                "choices": choices,
                "correct": correct,
                "rationale": rationale,
                "whyNot": why_not,
                "keyConcept": key_concept or None,
            }
            banks[bank].append(q)
            stats.kept_rows += 1

    return banks, dropped, stats


def to_ts(banks: dict[str, list[dict[str, Any]]]) -> str:
    categories = []
    for bank_id in sorted(banks.keys()):
        items = banks[bank_id]
        cat_name = items[0]["cat"] if items else bank_id
        categories.append({"id": bank_id, "name": cat_name, "count": len(items)})

    banks_json = json.dumps(banks, ensure_ascii=False)
    cats_json = json.dumps(categories, ensure_ascii=False)
    return (
        'import type { Question } from "@/types";\n\n'
        f"export const IMPORTED_BANKS: Record<string, Question[]> = {banks_json};\n\n"
        f"export const IMPORTED_CATEGORIES: {{ id: string; name: string; count: number }}[] = {cats_json};\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate cleaned gold question bank from CSV.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-ts", required=True, type=Path)
    parser.add_argument("--report", required=True, type=Path)
    args = parser.parse_args()

    banks, dropped, stats = build_gold(args.input.expanduser().resolve())

    args.output_ts.parent.mkdir(parents=True, exist_ok=True)
    args.output_ts.write_text(to_ts(banks), encoding="utf-8")

    bank_counts = Counter({k: len(v) for k, v in banks.items()})
    dropped_reason = Counter(d["reason"] for d in dropped)
    report_lines = [
        "# Gold Question Generation Report",
        "",
        f"- source_rows: {stats.total_rows}",
        f"- kept_rows: {stats.kept_rows}",
        f"- dropped_rows: {stats.dropped_rows}",
        f"- repaired_stem: {stats.repaired_stem}",
        f"- repaired_correct: {stats.repaired_correct}",
        f"- repaired_rationale: {stats.repaired_rationale}",
        f"- dropped_noisy_choice: {stats.dropped_noisy_choice}",
        "",
        "## Drop Reasons",
    ]
    for reason, count in dropped_reason.most_common():
        report_lines.append(f"- {reason}: {count}")
    report_lines.extend(["", "## Top Banks (kept)"])
    for bank, count in bank_counts.most_common(20):
        report_lines.append(f"- {bank}: {count}")
    report_lines.extend(["", "## Sample Dropped Items"])
    for d in dropped[:50]:
        report_lines.append(f"- id={d['id']} bank={d['bank']} reason={d['reason']}")

    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text("\n".join(report_lines) + "\n", encoding="utf-8")

    print(f"Wrote: {args.output_ts}")
    print(f"Wrote: {args.report}")
    print(f"Kept {stats.kept_rows}/{stats.total_rows}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
