#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from PIL import Image


SECTION_RE = re.compile(r"^##\s+(.+?\s+Q\d+)\s*$", re.MULTILINE)
IMAGE_RE = re.compile(r"!\[[^\]]*\]\(<([^>]+)>\)")
BLOCK_RE = re.compile(r"^\*\*(.+?)\*\*\s*$", re.MULTILINE)

QUESTION_START_PATTERNS = [
    r"A nurse\b",
    r"Anurse\b",
    r"An RN\b",
    r"A charge nurse\b",
    r"A client\b",
    r"An adult client\b",
    r"A child\b",
    r"A mother\b",
    r"A healthcare\b",
    r"The nurse\b",
    r"The client\b",
    r"Which of the following\b",
    r"When\b",
    r"What\b",
    r"Read the following\b",
    r"Match the following\b",
    r"For each of the following\b",
    r"Select the most appropriate\b",
    r"Select all that apply\b",
]

NOISE_INLINE_PATTERNS = [
    r"\s+Close Explanation\b.*$",
    r"\s+Peer Comparison\b.*$",
    r"\s+Difficulty level:.*$",
    r"\s+Browse Mode\b.*$",
    r"\s+Question\s+\d+\s+of\s+\d+\b",
    r"^\s*@.*?student\.atitesting\.com/LT[I|!]\b",
]

NOISE_LINE_PATTERNS = [
    re.compile(r"^\s*Peer Comparison.*$", re.I),
    re.compile(r"^\s*Difficulty level:.*$", re.I),
    re.compile(r"^\s*Browse Mode.*$", re.I),
    re.compile(r"^\s*Previous\s+\d+.*$", re.I),
    re.compile(r"^\s*a\s*=\s*.*$", re.I),
    re.compile(r"^\s*[A-G]\s*\|\s*\d+%.*$", re.I),
]

COMPLEX_ITEM_PATTERNS = [
    re.compile(r"\bfill in the blank\b", re.I),
    re.compile(r"\bmatch the following\b", re.I),
    re.compile(r"\bclick to specify\b", re.I),
    re.compile(r"\bdrag and drop\b", re.I),
    re.compile(r"\bhot spot\b", re.I),
    re.compile(r"\bcategorize\b", re.I),
]

IMAGE_TRIGGER_PATTERNS = [
    re.compile(r"\bsee image\b", re.I),
    re.compile(r"\bsee figure\b", re.I),
    re.compile(r"\bfigure/media\b", re.I),
    re.compile(r"\bdrawing\b", re.I),
    re.compile(r"\brhythm strip\b", re.I),
    re.compile(r"\becg\b", re.I),
    re.compile(r"\bekg\b", re.I),
    re.compile(r"\bx-?ray\b", re.I),
    re.compile(r"\bimage below\b", re.I),
    re.compile(r"\bchart below\b", re.I),
    re.compile(r"\btable below\b", re.I),
]

TYPO_FIXES = [
    ("Anurse", "A nurse"),
    ("Aclient", "A client"),
    ("Anewborn", "A newborn"),
    ("Alate", "A late"),
    ("Ifa", "If a"),
    ("Acharge", "A charge"),
    ("Aregistered", "A registered"),
]


@dataclass
class BuildStats:
    total_sections: int = 0
    kept_questions: int = 0
    dropped_questions: int = 0
    image_questions: int = 0
    copied_images: int = 0
    custom_images: int = 0
    dropped_complex: int = 0
    dropped_missing_choices: int = 0
    dropped_missing_correct: int = 0


def squash_ws(text: str) -> str:
    text = text.replace("\u202f", " ").replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text)
    return text.strip("_")


def split_sections(text: str) -> list[tuple[str, str]]:
    matches = list(SECTION_RE.finditer(text))
    out: list[tuple[str, str]] = []
    for i, match in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        out.append((match.group(1).strip(), text[match.start() : end]))
    return out


def parse_blocks(section: str) -> dict[str, str]:
    matches = list(BLOCK_RE.finditer(section))
    out: dict[str, str] = {}
    for i, match in enumerate(matches):
        title = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(section)
        out[title] = section[start:end].strip()
    return out


def clean_text(text: str) -> str:
    if not text:
        return ""
    out = text
    for old, new in TYPO_FIXES:
        out = out.replace(old, new)
    out = out.replace("\u202f", " ").replace("\u00a0", " ")
    for pattern in NOISE_INLINE_PATTERNS:
        out = re.sub(pattern, " ", out, flags=re.I | re.S)
    lines = []
    for line in out.splitlines():
        if any(pattern.match(line) for pattern in NOISE_LINE_PATTERNS):
            continue
        lines.append(line)
    out = "\n".join(lines)
    return squash_ws(out)


def strip_leading_chrome(text: str) -> str:
    cleaned = clean_text(text)
    if not cleaned:
        return ""
    starts = []
    for pattern in QUESTION_START_PATTERNS:
        match = re.search(pattern, cleaned, re.I)
        if match:
            starts.append(match.start())
    if starts:
        cleaned = cleaned[min(starts) :]
    return cleaned.strip()


def strip_options_from_question(text: str) -> str:
    cleaned = strip_leading_chrome(text)
    match = re.search(r"\sO\sA\.", cleaned)
    if match and match.start() > 35:
        cleaned = cleaned[: match.start()]
    return squash_ws(cleaned)


def parse_choice_lines(text: str) -> list[dict[str, str]]:
    choices: list[dict[str, str]] = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("-"):
            continue
        line = line[1:].strip()
        match = re.match(r"([A-G])\.\s*(.+)$", line)
        if not match:
            continue
        cid = match.group(1).lower()
        val = clean_text(match.group(2))
        if not val or val == "[OCR unclear]":
            continue
        choices.append({"id": cid, "t": val})
    return choices


def parse_inline_options(question_text: str) -> list[dict[str, str]]:
    text = question_text.replace("\n", " ")
    start = re.search(r"\bO\s*A\.", text)
    if not start:
        return []
    opt_text = text[start.start() :]
    parts = re.split(r"\bO\s*([A-G])\.\s*", opt_text)
    choices: list[dict[str, str]] = []
    for i in range(1, len(parts) - 1, 2):
        cid = parts[i].lower().strip()
        body = clean_text(parts[i + 1])
        body = re.split(r"\bClose Explanation\b|\bCorrect Answer\b|\bPeer Comparison\b", body, 1, flags=re.I)[0]
        body = squash_ws(body)
        if cid in "abcdefg" and len(body) > 2:
            choices.append({"id": cid, "t": body})
    return choices


def normalize_correct(text: str) -> str | list[str] | None:
    letters = []
    for letter in re.findall(r"[A-G]", text.upper()):
        if letter not in letters:
            letters.append(letter)
    if not letters:
        return None
    if len(letters) == 1:
        return letters[0].lower()
    return [letter.lower() for letter in letters]


def extract_correct_text(text: str) -> tuple[str | list[str] | None, str | None]:
    normalized = clean_text(text)
    if not normalized:
        return None, None
    match = re.match(r"^([A-G](?:\s*[,/&]\s*[A-G])*)\b", normalized, re.I)
    correct = normalize_correct(match.group(1)) if match else normalize_correct(normalized)
    single = re.match(r"^([A-G])\.\s*(.+)$", normalized, re.I)
    if single:
        return correct, clean_text(single.group(2))
    comma = re.match(r"^([A-G](?:\s*,\s*[A-G])+)\b", normalized, re.I)
    if comma:
        return correct, None
    match = re.match(r"([A-G])\.\s*(.+)$", normalized, re.I)
    if match:
        return correct, clean_text(match.group(2))
    return correct, None


def parse_why_not(text: str) -> dict[str, str] | None:
    out: dict[str, str] = {}
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("-"):
            continue
        line = line[1:].strip()
        match = re.match(r"([A-G])\.\s*(.+)$", line)
        if not match:
            continue
        out[match.group(1).lower()] = clean_text(match.group(2))
    return out or None


def merge_choices(
    block_choices: list[dict[str, str]],
    inline_choices: list[dict[str, str]],
    why_not: dict[str, str] | None,
    correct: str | list[str] | None,
    correct_text: str | None,
) -> list[dict[str, str]]:
    merged: dict[str, str] = {}
    for item in block_choices + inline_choices:
        cid = item["id"]
        txt = clean_text(item["t"])
        if cid not in merged or len(txt) > len(merged[cid]):
            merged[cid] = txt
    if why_not:
        for cid, txt in why_not.items():
            if cid not in merged and txt:
                merged[cid] = clean_text(txt)
    if isinstance(correct, str) and correct not in merged and correct_text:
        merged[correct] = correct_text
    return [{"id": cid, "t": merged[cid]} for cid in sorted(merged.keys())]


def synthesize_label_choices(stem: str, correct: str | list[str] | None) -> list[dict[str, str]]:
    if not isinstance(correct, str):
        return []
    if not re.search(r"\bmark on the drawing\b|\bmark on the diagram\b", stem, re.I):
        return []
    return [{"id": chr(code).lower(), "t": chr(code)} for code in range(ord("A"), ord("I") + 1)]


def needs_image(question_text: str, image_desc: str, has_screenshot: bool) -> bool:
    if not has_screenshot:
        return False
    desc = clean_text(image_desc)
    if desc and not desc.lower().startswith("no image"):
        return True
    prompt = clean_text(question_text)
    return any(pattern.search(prompt) for pattern in IMAGE_TRIGGER_PATTERNS)


def is_complex_item(question_text: str) -> bool:
    prompt = clean_text(question_text)
    return any(pattern.search(prompt) for pattern in COMPLEX_ITEM_PATTERNS)


def pick_custom_image(header: str) -> Path | None:
    key = header.upper()
    overrides = {
        "MUSCOSKELETAL Q001": Path("/Users/bobyondi/Documents/New project/ear_stock_photo_labeled.png"),
    }
    path = overrides.get(key)
    return path if path and path.exists() else None


def copy_image_asset(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if src.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
        image = Image.open(src)
        image = image.convert("RGB")
        max_w = 1100
        if image.width > max_w:
            ratio = max_w / image.width
            image = image.resize((max_w, int(image.height * ratio)), Image.LANCZOS)
        image.save(dest, format="WEBP", quality=78, method=6)
        return
    shutil.copy2(src, dest)


def bank_id_from_folder(folder_name: str) -> str:
    return slugify(folder_name.replace("...", " "))


def category_name_from_header(header: str) -> str:
    return re.sub(r"\s+Q\d+$", "", header).strip()


def build_question(
    header: str,
    section: str,
    folder: Path,
    bank_id: str,
    public_media_root: Path,
    stats: BuildStats,
    qid: int,
) -> tuple[dict[str, Any] | None, str | None]:
    blocks = parse_blocks(section)
    question_raw = blocks.get("Question", "")
    choices_raw = blocks.get("Choices", "")
    correct_raw = blocks.get("Correct Answer", "")
    rationale_raw = blocks.get("Rationale", "")
    why_not_raw = blocks.get("Incorrect Answers (Why Not)", "")
    key_concept_raw = blocks.get("Vital Concept", "")
    image_desc_raw = blocks.get("Image Description (if any)", "")

    screenshot_match = IMAGE_RE.search(section)
    screenshot_name = screenshot_match.group(1) if screenshot_match else None
    screenshot_path = folder / screenshot_name if screenshot_name else None
    has_screenshot = bool(screenshot_path and screenshot_path.exists())

    stem = strip_options_from_question(question_raw)
    block_choices = parse_choice_lines(choices_raw)
    inline_choices = parse_inline_options(question_raw)
    why_not = parse_why_not(why_not_raw)
    correct, correct_text = extract_correct_text(correct_raw)
    choices = merge_choices(block_choices, inline_choices, why_not, correct, correct_text)
    if len(choices) < 2:
        choices = synthesize_label_choices(stem, correct)
    rationale = clean_text(rationale_raw) or clean_text(key_concept_raw)
    key_concept = clean_text(key_concept_raw) or None
    image_desc = clean_text(image_desc_raw)

    complex_item = is_complex_item(question_raw)
    if complex_item:
        stats.dropped_complex += 1
        return None, "complex_item"

    if len(choices) < 2:
        stats.dropped_missing_choices += 1
        return None, "missing_choices"

    if correct is None:
        stats.dropped_missing_correct += 1
        return None, "missing_correct"

    image_url = None
    image_alt = None
    if needs_image(question_raw, image_desc, has_screenshot):
        custom = pick_custom_image(header)
        asset_name = f"{slugify(header)}.webp"
        asset_rel = Path("question-media") / bank_id / asset_name
        asset_abs = public_media_root / asset_rel
        if custom:
            copy_image_asset(custom, asset_abs)
            stats.custom_images += 1
        elif screenshot_path:
            copy_image_asset(screenshot_path, asset_abs)
        image_url = f"/{asset_rel.as_posix()}"
        image_alt = f"{header} supporting figure"
        stats.image_questions += 1
        stats.copied_images += 1

    question = {
        "id": qid,
        "cat": category_name_from_header(header),
        "stem": stem,
        "choices": choices,
        "correct": correct,
        "rationale": rationale or "Use clinical judgment and the rationale provided in the source material.",
        "whyNot": why_not,
        "keyConcept": key_concept,
        "imageUrl": image_url,
        "imageAlt": image_alt,
    }
    return question, None


def to_ts(banks: dict[str, list[dict[str, Any]]]) -> str:
    categories = [
        {"id": bank_id, "name": items[0]["cat"] if items else bank_id, "count": len(items)}
        for bank_id, items in sorted(banks.items())
        if items
    ]
    return (
        'import type { Question } from "@/types";\n\n'
        f"export const IMPORTED_BANKS: Record<string, Question[]> = {json.dumps(banks, ensure_ascii=False)};\n\n"
        f"export const IMPORTED_CATEGORIES: {{ id: string; name: string; count: number }}[] = {json.dumps(categories, ensure_ascii=False)};\n"
    )


def to_csv_rows(banks: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for bank_id, items in sorted(banks.items()):
        for item in items:
            rows.append(
                {
                    "id": item["id"],
                    "bank": bank_id,
                    "cat": item["cat"],
                    "stem": item["stem"],
                    "choices": json.dumps(item["choices"], ensure_ascii=False),
                    "correct": json.dumps(item["correct"], ensure_ascii=False),
                    "rationale": item["rationale"],
                    "why_not": json.dumps(item["whyNot"], ensure_ascii=False) if item["whyNot"] else "",
                    "key_concept": item["keyConcept"] or "",
                    "image_url": item["imageUrl"] or "",
                    "image_alt": item["imageAlt"] or "",
                }
            )
    return rows


def build(root: Path, public_root: Path) -> tuple[dict[str, list[dict[str, Any]]], list[dict[str, str]], BuildStats]:
    stats = BuildStats()
    banks: dict[str, list[dict[str, Any]]] = {}
    dropped: list[dict[str, str]] = []
    qid = 10000

    for md in sorted(root.glob("*/processed_*_clean_v2.md")):
        folder = md.parent
        bank_id = bank_id_from_folder(folder.name)
        text = md.read_text(encoding="utf-8", errors="ignore")
        for header, section in split_sections(text):
            stats.total_sections += 1
            question, reason = build_question(header, section, folder, bank_id, public_root, stats, qid)
            if question is None:
                stats.dropped_questions += 1
                dropped.append({"header": header, "bank": bank_id, "reason": reason or "unknown"})
                continue
            banks.setdefault(bank_id, []).append(question)
            qid += 1
            stats.kept_questions += 1

    return banks, dropped, stats


def write_csv(rows: list[dict[str, Any]], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "id",
                "bank",
                "cat",
                "stem",
                "choices",
                "correct",
                "rationale",
                "why_not",
                "key_concept",
                "image_url",
                "image_alt",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)


def write_report(path: Path, stats: BuildStats, dropped: list[dict[str, str]]) -> None:
    lines = [
        "# Markdown Import Report",
        "",
        f"- total_sections: {stats.total_sections}",
        f"- kept_questions: {stats.kept_questions}",
        f"- dropped_questions: {stats.dropped_questions}",
        f"- image_questions: {stats.image_questions}",
        f"- copied_images: {stats.copied_images}",
        f"- custom_images: {stats.custom_images}",
        f"- dropped_complex: {stats.dropped_complex}",
        f"- dropped_missing_choices: {stats.dropped_missing_choices}",
        f"- dropped_missing_correct: {stats.dropped_missing_correct}",
        "",
        "## Sample Dropped",
    ]
    for item in dropped[:100]:
        lines.append(f"- {item['bank']} :: {item['header']} :: {item['reason']}")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build question bank from cleaned markdown files.")
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--output-ts", required=True, type=Path)
    parser.add_argument("--output-csv", required=True, type=Path)
    parser.add_argument("--report", required=True, type=Path)
    parser.add_argument("--public-root", required=True, type=Path)
    args = parser.parse_args()

    root = args.root.expanduser().resolve()
    public_root = args.public_root.expanduser().resolve()
    banks, dropped, stats = build(root=root, public_root=public_root)

    args.output_ts.parent.mkdir(parents=True, exist_ok=True)
    args.output_ts.write_text(to_ts(banks), encoding="utf-8")
    write_csv(to_csv_rows(banks), args.output_csv)
    write_report(args.report, stats, dropped)

    print(f"Wrote {args.output_ts}")
    print(f"Wrote {args.output_csv}")
    print(f"Wrote {args.report}")
    print(f"Kept {stats.kept_questions}/{stats.total_sections} questions")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
