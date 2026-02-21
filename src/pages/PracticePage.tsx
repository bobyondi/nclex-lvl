import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PracticeRun from "@/components/practice/PracticeRun";
import PracticeResults from "@/components/practice/PracticeResults";
import { SUBJECTS } from "@/data/subjects";
import { PRACTICE_CATEGORIES } from "@/data/questionBank";
import type { UserAnswer, Question } from "@/types";
import { computeStrengthsAndGaps, saveSession } from "@/lib/progress";
import { fetchQuestions } from "@/lib/questions";

export default function PracticePage() {
  const navigate = useNavigate();
  const { bank } = useParams();
  const [results, setResults] = useState<{ answers: UserAnswer[]; elapsed: number } | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  const label = useMemo(() => {
    const match = SUBJECTS.find((s) => s.id === bank);
    if (match) return `${match.name} drill`;
    const cat = PRACTICE_CATEGORIES.find((c) => c.id === bank);
    return cat ? `${cat.name} drill` : "Mixed practice";
  }, [bank]);

  useEffect(() => {
    (async () => {
      const qs = await fetchQuestions(bank || "mixed", 10);
      setQuestions(qs);
    })();
  }, [bank, sessionKey]);

  if (!results) {
    if (!questions) return <div className="min-h-screen" />;
    return (
      <PracticeRun
        key={sessionKey}
        bank={bank || "mixed"}
        questions={questions}
        sessionLabel={label}
        onExit={() => navigate("/study")}
        onComplete={async (answers, elapsed) => {
          const correct = answers.filter((a) => a.correct).length;
          const total = answers.length;
          const score = total ? Math.round((correct / total) * 100) : 0;
          const { strengths, gaps } = computeStrengthsAndGaps(answers);
          await saveSession({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            date: new Date().toISOString(),
            bank: bank || "mixed",
            correct,
            total,
            score,
            duration: elapsed,
            strengths,
            gaps,
          });
          setResults({ answers, elapsed });
        }}
      />
    );
  }

  return (
    <PracticeResults
      answers={results.answers}
      elapsed={results.elapsed}
      label={label}
      onBack={() => navigate("/study")}
      onRestart={() => { setResults(null); setQuestions(null); setSessionKey((k) => k + 1); }}
    />
  );
}
