import type { Question } from "@/types";

const STEM_BAD_PATTERNS = [
  /student\.atitesting/i,
  /Browse Questions/i,
  /Dashboard Quiz/i,
  /Tutorial:/i,
  /Module:/i,
  /Close Explanation/i,
  /Inbox/i,
  /Google/i,
  /TEASP/i,
  /Untitle/i,
  /Finish update/i,
  /Qa \* ws/i,
  /Peer Comparison/i,
  /Difficulty level/i,
];

const TEXT_BAD_PATTERNS = [
  /student\.atitesting/i,
  /Browse Questions/i,
  /Dashboard Quiz/i,
  /Tutorial:/i,
  /Module:/i,
  /Close Explanation/i,
  /Peer Comparison/i,
  /Difficulty level/i,
  /Correct Answer/i,
  /\b(?:Easy|Moderate|Hard)\b/i,
  /A I \d/i,
];

const countArtifactChars = (text: string) => (text.match(/[@©™{}[\]]/g) || []).length;

const normalizeCorrectIds = (correct: Question["correct"]) =>
  (Array.isArray(correct) ? correct : [correct])
    .map((id) => String(id || "").trim().toLowerCase())
    .filter(Boolean);

export function isRenderableQuestion(q: Question, opts: { hero?: boolean } = {}): boolean {
  const hero = opts.hero === true;
  const stem = (q.stem || "").trim();
  if (!stem || stem.length < 35 || stem.length > 600) return false;
  if (STEM_BAD_PATTERNS.some((re) => re.test(stem))) return false;
  if (countArtifactChars(stem) >= 2) return false;

  const choices = Array.isArray(q.choices) ? q.choices : [];
  if (choices.length < 4 || choices.length > 6) return false;

  const maxChoiceLength = hero ? 110 : 160;
  for (const choice of choices) {
    const text = (choice?.t || "").trim();
    if (!text || text.length < 2 || text.length > maxChoiceLength) return false;
    if (TEXT_BAD_PATTERNS.some((re) => re.test(text))) return false;
    if (countArtifactChars(text) >= 2) return false;
  }

  const validChoiceIds = new Set(choices.map((choice) => String(choice.id || "").trim().toLowerCase()));
  const correctIds = normalizeCorrectIds(q.correct);
  if (!correctIds.length) return false;
  if (correctIds.some((id) => !validChoiceIds.has(id))) return false;

  const rationale = (q.rationale || "").trim();
  if (!rationale || rationale.length < 20 || rationale.length > 1500) return false;
  if (TEXT_BAD_PATTERNS.some((re) => re.test(rationale))) return false;

  return true;
}

export function filterRenderableQuestions<T extends Question>(questions: T[], opts: { hero?: boolean } = {}) {
  return questions.filter((q) => isRenderableQuestion(q, opts));
}
