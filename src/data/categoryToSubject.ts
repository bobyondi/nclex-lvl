import type { Subject } from "@/types";

type SubjectId = Subject["id"];

// Every imported bank id is explicitly assigned to one of the 8 homepage subjects.
export const SUBJECT_TO_BANK_IDS: Record<SubjectId, string[]> = {
  pharm: [
    "physiology_integrity_pharmacological",
    "nclex_15_endoctrine",
  ],
  medsurg: [
    "hematologic",
    "integuement",
    "muscoskeletal",
    "nclex_12_cardiovascular",
    "nclex_13_critical_care",
    "nclex_16_gastrointenstinal",
    "nclex_21_immune_system",
    "neurological",
    "physiological_adaptation",
    "physiological_integrity_basic_care_integrity",
    "physiological_integrity_reduction_of_risk_potential",
    "gerontology",
    "nutrition",
  ],
  maternity: [
    "genital_reproductive",
    "nclex_10_ante_neonatal_care",
  ],
  peds: [
    "paediatrics",
  ],
  fundamentals: [
    "nclex_1",
    "nclex_11_audio_questions",
    "nclex_2",
    "nclex_3",
    "nclex_4",
    "nclex_6",
    "nclex_7",
    "nclex_8",
    "nclex_9",
    "ncleex_5",
    "pre_post_operative",
  ],
  mental: [
    "psychiatric",
    "psychosocial_integrity",
  ],
  safety: [
    "emergency_care",
    "safe_and_effective_care_environment",
  ],
  management: [
    "leadership",
    "nclex_19_health_promotion_maint",
    "nclex_24_leadership_mgt",
  ],
};

const ALL_MAPPED_BANK_IDS = new Set(
  Object.values(SUBJECT_TO_BANK_IDS).flat(),
);

export const getSubjectBankIds = (subjectId: SubjectId): string[] =>
  SUBJECT_TO_BANK_IDS[subjectId] || [];

export const getSubjectBankIdsByKey = (subjectKey: string): string[] => {
  if (subjectKey in SUBJECT_TO_BANK_IDS) {
    return SUBJECT_TO_BANK_IDS[subjectKey as SubjectId];
  }
  return [];
};

export const getSubjectIdForBank = (bankId: string): SubjectId | null => {
  const entry = Object.entries(SUBJECT_TO_BANK_IDS).find(([, ids]) => ids.includes(bankId));
  return (entry?.[0] as SubjectId) || null;
};

export const getUnmappedCategoryIds = (categoryIds: string[]): string[] =>
  categoryIds.filter((id) => !ALL_MAPPED_BANK_IDS.has(id));

export const countQuestionsBySubject = (categories: { id: string; count: number }[]) => {
  const out: Record<SubjectId, number> = {
    pharm: 0,
    medsurg: 0,
    maternity: 0,
    peds: 0,
    fundamentals: 0,
    mental: 0,
    safety: 0,
    management: 0,
  };

  for (const c of categories) {
    const sid = getSubjectIdForBank(c.id);
    if (!sid) continue;
    out[sid] += c.count;
  }
  return out;
};
