import { DIAGNOSTIC_BANKS } from "@/data/questions";
import { IMPORTED_BANKS, IMPORTED_CATEGORIES } from "@/data/imported_questions";
import type { Question } from "@/types";

const mergeBanks = (a: Record<string, Question[]>, b: Record<string, Question[]>) => {
  const out: Record<string, Question[]> = {};
  [a, b].forEach((src) => {
    Object.entries(src).forEach(([k, v]) => {
      if (!out[k]) out[k] = [];
      out[k] = out[k].concat(v);
    });
  });
  return out;
};

export const PRACTICE_BANKS: Record<string, Question[]> = mergeBanks(DIAGNOSTIC_BANKS, IMPORTED_BANKS);

export const PRACTICE_CATEGORIES = IMPORTED_CATEGORIES;
