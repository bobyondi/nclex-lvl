import type { Question } from "@/types";
import { supabase } from "@/lib/supabase";
import { shuffle } from "@/lib/utils";
import { PRACTICE_BANKS } from "@/data/questionBank";
import { getSubjectBankIdsByKey } from "@/data/categoryToSubject";

const parseJsonMaybe = <T,>(value: any, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        return JSON.parse(trimmed) as T;
      } catch {
        return fallback;
      }
    }
  }
  return value as T;
};

const splitSection = (text: string, label: string) => {
  const idx = text.indexOf(label);
  if (idx === -1) return null;
  return text.slice(idx + label.length).trim();
};

const parseChoiceLines = (text: string) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (l.startsWith("-") ? l.slice(1).trim() : l));
  const out: { id: string; t: string }[] = [];
  lines.forEach((ln) => {
    const m = ln.match(/^([A-E])\s*[\.)]\s*(.+)$/);
    if (!m) return;
    out.push({ id: m[1].toLowerCase(), t: m[2].trim() });
  });
  return out;
};

const normalizeFromStem = (row: any) => {
  const raw = typeof row.stem === "string" ? row.stem : "";
  if (!raw) return null;

  const choicesSection = splitSection(raw, "**Choices**") || splitSection(raw, "Choices");
  const correctSection = splitSection(raw, "**Correct Answer**") || splitSection(raw, "Correct Answer");
  const rationaleSection = splitSection(raw, "**Rationale**") || splitSection(raw, "Rationale");

  const stemPart = raw.split("**Choices**")[0].split("Choices")[0].trim();
  const choices = choicesSection ? parseChoiceLines(choicesSection) : [];
  const correct = correctSection ? (correctSection.match(/\b([A-E])\./g) || []).map((x) => x[0].toLowerCase()) : [];
  const rationale = rationaleSection ? rationaleSection.split("**")[0].trim() : "";

  if (choices.length < 3) return null;
  return {
    stem: stemPart || raw,
    choices,
    correct: correct.length ? correct : row.correct,
    rationale: rationale || row.rationale,
  };
};

export async function fetchQuestions(bank: string, count: number): Promise<Question[]> {
  const mappedBanks = getSubjectBankIdsByKey(bank);
  const bankFilter = mappedBanks.length ? mappedBanks : [bank];

  const { data, error } = await supabase
    .from("questions")
    .select("id, bank, cat, stem, choices, correct, rationale, why_not, key_concept, image_url, image_alt")
    .in("bank", bankFilter);

  if (!error && data && data.length > 0) {
    const mapped = data.map((row: any) => ({
      id: Number(row.id),
      cat: row.cat,
      stem: row.stem,
      choices: parseJsonMaybe(row.choices, []),
      correct: parseJsonMaybe(row.correct, ""),
      rationale: row.rationale,
      whyNot: parseJsonMaybe(row.why_not, null),
      keyConcept: row.key_concept,
      imageUrl: row.image_url ?? undefined,
      imageAlt: row.image_alt ?? undefined,
    })) as Question[];

    const normalized = mapped.map((q, i) => {
      if (Array.isArray(q.choices) && q.choices.length >= 3) return q;
      const repaired = normalizeFromStem(data[i]);
      if (!repaired) return q;
      return { ...q, ...repaired };
    });
    return shuffle(normalized).slice(0, count);
  }

  if (mappedBanks.length) {
    const merged = mappedBanks.flatMap((id) => PRACTICE_BANKS[id] || []);
    if (merged.length) return shuffle(merged).slice(0, count);
  }

  const local = PRACTICE_BANKS[bank] || PRACTICE_BANKS.mixed || [];
  return shuffle(local).slice(0, count);
}
