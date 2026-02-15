import { ArrowRight, Sparkles } from "lucide-react";
import type { OnboardingData, UserAnswer } from "@/types";

interface Props {
  data: OnboardingData;
  answers: UserAnswer[];
  onNext: () => void;
  ProgressBar: React.FC;
}

export default function PlanPreview({ data, answers, onNext, ProgressBar }: Props) {
  const cats: Record<string, { t: number; c: number }> = {};
  answers.forEach((a) => { if (!cats[a.cat]) cats[a.cat] = { t: 0, c: 0 }; cats[a.cat].t++; if (a.correct) cats[a.cat].c++; });
  const gaps = Object.entries(cats).filter(([, d]) => Math.round((d.c / d.t) * 100) < 80).map(([n]) => n);
  const topGap = gaps[0] || "Mixed Review";
  const mins = data.dailyTime === "15" ? "15-min" : data.dailyTime === "30" ? "30-min" : "60-min";
  const dayPlans = [
    { d: 1, title: `${topGap} Deep Dive`, tasks: [`${data.dailyTime || 15} practice questions on ${topGap}`, "Review rationales for missed questions", `Key concept: ${topGap} essentials`] },
    { d: 2, title: gaps[1] || "Mixed Review", tasks: [`${data.dailyTime || 15} adaptive questions`, "Confidence-tracked practice", "1 clinical scenario walkthrough"] },
    { d: 3, title: "Progress Check", tasks: ["Mini-diagnostic (5 questions)", "Gap analysis update", "Plan adjusts based on progress"] },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-[480px] w-full">
        <ProgressBar />
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div className="flex items-center gap-2 mb-[14px]">
            <Sparkles size={18} className="text-primary" />
            <span className="text-[13px] font-bold text-primary">Your guided plan is ready.</span>
          </div>
          <h2 className="text-[26px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>You'll always know what to do next.</h2>
          <p className="text-[14px] mb-5 leading-[1.5]" style={{ color: "var(--text-secondary)" }}>Here's your first 3 days. Each session is {mins} and targets your weakest areas first.</p>
          {dayPlans.map((day) => (
            <div key={day.d} className="nclex-card mb-[10px]" style={{ padding: "20px 22px" }}>
              <div className="flex items-center gap-2 mb-[10px]">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-extrabold" style={{ background: day.d === 1 ? "var(--accent-s)" : "hsl(var(--background-alt))", color: day.d === 1 ? "hsl(var(--primary))" : "var(--text-tertiary)" }}>{day.d}</div>
                <span className="font-bold text-[14px]">Day {day.d}: {day.title}</span>
              </div>
              {day.tasks.map((t, j) => (
                <div key={j} className="flex items-center gap-2 py-[5px] text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />{t}
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-p mt-[6px]" onClick={onNext} style={{ width: "100%", padding: 15, borderRadius: 12 }}>Save my plan <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
