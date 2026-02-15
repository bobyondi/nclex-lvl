import { ArrowRight } from "lucide-react";
import type { UserAnswer } from "@/types";
import { formatTime } from "@/lib/utils";

interface Props {
  answers: UserAnswer[];
  elapsed: number;
  onNext: () => void;
  ProgressBar: React.FC;
}

export default function DiagnosticResults({ answers, elapsed, onNext, ProgressBar }: Props) {
  const ok = answers.filter((a) => a.correct).length;
  const pct = Math.round((ok / answers.length) * 100);
  const cats: Record<string, { t: number; c: number }> = {};
  answers.forEach((a) => { if (!cats[a.cat]) cats[a.cat] = { t: 0, c: 0 }; cats[a.cat].t++; if (a.correct) cats[a.cat].c++; });
  const sorted = Object.entries(cats).map(([n, d]) => ({ name: n, pct: Math.round((d.c / d.t) * 100), c: d.c, t: d.t })).sort((a, b) => a.pct - b.pct);
  const strengths = sorted.filter((c) => c.pct >= 80);
  const gaps = sorted.filter((c) => c.pct < 80);

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-[480px] w-full">
        <ProgressBar />
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <h2 className="text-[26px] font-extrabold mb-1" style={{ letterSpacing: "-0.03em" }}>Here's what your diagnostic says.</h2>
          <p className="text-[14px] mb-5" style={{ color: "var(--text-secondary)" }}>Completed in {formatTime(elapsed)} · {pct}% correct</p>
          <div className="nclex-card mb-3">
            <div className="text-center mb-4">
              <div className="text-[56px] font-extrabold" style={{ color: pct >= 70 ? "var(--teal)" : pct >= 50 ? "hsl(var(--primary))" : "var(--nclex-red)", letterSpacing: "-0.03em" }}>{pct}%</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{ok} of {answers.length} correct</div>
            </div>
            {sorted.map((cat) => (
              <div key={cat.name} className="mb-[10px]">
                <div className="flex justify-between mb-1">
                  <span className="text-[13px] font-semibold">{cat.name}</span>
                  <span className="text-[12px] font-semibold" style={{ color: cat.pct >= 80 ? "var(--teal)" : "hsl(var(--primary))" }}>{cat.c}/{cat.t}</span>
                </div>
                <div className="h-1 rounded-[10px]" style={{ background: "hsl(var(--background-alt))" }}>
                  <div className="h-full rounded-[10px]" style={{ width: `${cat.pct}%`, background: cat.pct >= 80 ? "var(--teal)" : "hsl(var(--primary))", animation: "growBar 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
          {strengths.length > 0 && (
            <div className="rounded-xl mb-2" style={{ background: "var(--teal-s)", border: "1px solid rgba(26,122,110,0.12)", padding: "14px 16px" }}>
              <p className="text-[13px] leading-[1.5]"><strong style={{ color: "var(--teal)" }}>Strengths:</strong> {strengths.map((s) => s.name).join(", ")}</p>
            </div>
          )}
          {gaps.length > 0 && (
            <div className="rounded-xl mb-4" style={{ background: "var(--accent-s)", border: "1px solid rgba(45,139,131,0.12)", padding: "14px 16px" }}>
              <p className="text-[13px] leading-[1.5]"><strong className="text-primary">Focus areas:</strong> {gaps.map((g) => g.name).join(", ")}. <span style={{ color: "var(--text-secondary)" }}>We'll start with {gaps[0]?.name} and build momentum.</span></p>
            </div>
          )}
          <button className="btn btn-p" onClick={onNext} style={{ width: "100%", padding: 15, borderRadius: 12 }}>Customize my plan <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
