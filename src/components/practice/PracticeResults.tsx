import { ArrowRight, RotateCcw } from "lucide-react";
import type { UserAnswer } from "@/types";
import { formatTime } from "@/lib/utils";

interface Props {
  answers: UserAnswer[];
  elapsed: number;
  onRestart: () => void;
  onBack: () => void;
  label?: string;
}

export default function PracticeResults({ answers, elapsed, onRestart, onBack, label }: Props) {
  const ok = answers.filter((a) => a.correct).length;
  const pct = Math.round((ok / answers.length) * 100);
  const cats: Record<string, { t: number; c: number }> = {};
  answers.forEach((a) => { if (!cats[a.cat]) cats[a.cat] = { t: 0, c: 0 }; cats[a.cat].t++; if (a.correct) cats[a.cat].c++; });
  const sorted = Object.entries(cats).map(([n, d]) => ({ name: n, pct: Math.round((d.c / d.t) * 100), c: d.c, t: d.t })).sort((a, b) => a.pct - b.pct);
  const strengths = sorted.filter((c) => c.pct >= 80).map((s) => s.name);
  const gaps = sorted.filter((c) => c.pct < 80).map((g) => g.name);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-[920px] mx-auto px-6 py-10">
        <div className="flex flex-col gap-1 mb-6">
          <div className="text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: "var(--text-tertiary)" }}>Practice Results</div>
          <h1 className="text-[28px] font-extrabold" style={{ letterSpacing: "-0.03em" }}>{label || "Session complete"}</h1>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>Completed in {formatTime(elapsed)} · {pct}% correct</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
          <div className="nclex-card">
            <div className="text-center mb-6">
              <div className="text-[64px] font-extrabold" style={{ color: pct >= 75 ? "var(--teal)" : pct >= 55 ? "hsl(var(--primary))" : "var(--nclex-red)", letterSpacing: "-0.03em" }}>{pct}%</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{ok} of {answers.length} correct</div>
            </div>
            {sorted.map((cat) => (
              <div key={cat.name} className="mb-[12px]">
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

          <div className="flex flex-col gap-3">
            <div className="nclex-card">
              <div className="text-[14px] font-bold mb-2">Quick summary</div>
              <div className="text-[13px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
                {strengths.length > 0 ? <p><strong style={{ color: "var(--teal)" }}>Strengths:</strong> {strengths.join(", ")}.</p> : <p><strong style={{ color: "var(--teal)" }}>Strengths:</strong> Building — keep your streak going.</p>}
                {gaps.length > 0 ? <p className="mt-2"><strong className="text-primary">Focus areas:</strong> {gaps.join(", ")}. Prioritize the lowest score next.</p> : <p className="mt-2"><strong className="text-primary">Focus areas:</strong> None flagged — try harder sets.</p>}
              </div>
            </div>
            <div className="nclex-card" style={{ background: "linear-gradient(135deg, rgba(45,139,131,0.06), rgba(196,155,47,0.08))" }}>
              <div className="text-[14px] font-bold mb-2">Next steps</div>
              <div className="text-[13px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
                Do another set or jump into a focused subject drill to build depth.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn btn-p" onClick={onRestart} style={{ width: "100%", padding: 14, borderRadius: 12 }}><RotateCcw size={15} /> Start another set</button>
              <button className="btn btn-g" onClick={onBack} style={{ width: "100%", padding: 12, borderRadius: 12 }}><ArrowRight size={14} /> Back to dashboard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
