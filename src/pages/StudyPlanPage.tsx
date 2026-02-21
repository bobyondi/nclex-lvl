import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ArrowRight, Target } from "lucide-react";
import { loadPlan, type StudyPlan } from "@/lib/plan";
import { SUBJECTS } from "@/data/subjects";

export default function StudyPlanPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await loadPlan();
      setPlan(p);
      setLoaded(true);
    })();
  }, []);

  const focusLabel = useMemo(() => {
    if (!plan) return "Mixed";
    const match = SUBJECTS.find((s) => s.id === plan.data.focus);
    return match ? match.name : "Mixed";
  }, [plan]);

  if (!loaded) return <div className="min-h-screen" />;

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10">
        <div className="max-w-[520px] w-full text-center">
          <h1 className="text-[28px] font-extrabold mb-2" style={{ letterSpacing: "-0.03em" }}>No plan yet</h1>
          <p className="text-[14px] mb-6" style={{ color: "var(--text-secondary)" }}>Complete onboarding to build your personalized study plan.</p>
          <button className="btn btn-p" onClick={() => navigate("/onboarding")} style={{ padding: "12px 18px", borderRadius: 12 }}>
            Build my plan <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-[980px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: "var(--text-tertiary)" }}>Your plan</div>
            <h1 className="text-[30px] font-extrabold" style={{ letterSpacing: "-0.03em" }}>Personalized Study Plan</h1>
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>Built from your diagnostic and preferences.</p>
          </div>
          <button className="btn btn-o" onClick={() => navigate("/study")}>
            Back to dashboard <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="nclex-card" style={{ padding: "18px 20px" }}>
            <div className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Primary focus</div>
            <div className="text-[18px] font-bold">{focusLabel}</div>
          </div>
          <div className="nclex-card" style={{ padding: "18px 20px" }}>
            <div className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Daily time</div>
            <div className="text-[18px] font-bold">{plan.data.dailyTime || "15"} minutes</div>
          </div>
          <div className="nclex-card" style={{ padding: "18px 20px" }}>
            <div className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Exam date</div>
            <div className="text-[18px] font-bold">{plan.data.nclexDate || "Not set"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
          <div className="nclex-card" style={{ padding: "22px 24px" }}>
            <div className="text-[16px] font-bold mb-2">Weekly schedule</div>
            <div className="text-[12px] mb-4" style={{ color: "var(--text-secondary)" }}>Reminders at {plan.data.reminderTime}</div>
            <div className="flex gap-2 flex-wrap">
              {days.map((d) => (
                <div key={d} className="px-3 py-2 rounded-lg text-[12px] font-semibold" style={{ border: "1px solid hsl(var(--border))", background: plan.studyDays.includes(d) ? "var(--accent-s)" : "hsl(var(--card))", color: plan.studyDays.includes(d) ? "hsl(var(--primary))" : "var(--text-tertiary)" }}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="nclex-card" style={{ padding: "22px 24px" }}>
            <div className="text-[16px] font-bold mb-2">Next steps</div>
            <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
              Complete a focused practice set, then review your rationales and key concepts.
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-p" onClick={() => navigate("/practice/mixed")} style={{ padding: "10px 14px" }}>
                Start practice <Target size={14} />
              </button>
              <button className="btn btn-g" onClick={() => navigate("/study")} style={{ padding: "10px 14px" }}>
                View dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="nclex-card" style={{ padding: "22px 24px", marginTop: 16 }}>
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={16} style={{ color: "var(--text-tertiary)" }} />
            <div className="text-[16px] font-bold">Plan cadence</div>
          </div>
          <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            Short daily sessions (15–30 min) outperform long, infrequent sessions. Stay consistent and use your dashboard readiness score to adjust difficulty.
          </div>
        </div>
      </div>
    </div>
  );
}
