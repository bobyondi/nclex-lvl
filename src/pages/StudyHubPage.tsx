import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Flame, Target, CalendarDays, LineChart, Activity, Zap } from "lucide-react";
import { SUBJECTS } from "@/data/subjects";
import { PRACTICE_CATEGORIES } from "@/data/questionBank";
import { computeReadiness, loadSessions, type PracticeSession } from "@/lib/progress";

export default function StudyHubPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  useEffect(() => {
    (async () => {
      const data = await loadSessions();
      setSessions(data);
    })();
  }, []);

  const todayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date());
  const readiness = useMemo(() => computeReadiness(sessions), [sessions]);
  const lastSession = sessions[0];
  const labelMap = useMemo(() => {
    const map = new Map<string, string>();
    SUBJECTS.forEach((s) => map.set(s.id, s.name));
    PRACTICE_CATEGORIES.forEach((c) => map.set(c.id, c.name));
    map.set("mixed", "Mixed");
    return map;
  }, []);
  const labelFor = (id: string) => labelMap.get(id) || id;

  const quickStats = [
    { label: "Today's target", value: "20 questions", icon: <Target size={14} />, color: "var(--teal)", bg: "var(--teal-s)" },
    { label: "Streak", value: `${readiness.last7.length} days`, icon: <Flame size={14} />, color: "var(--coral)", bg: "var(--coral-s)" },
    { label: "Time planned", value: "30 min", icon: <Clock size={14} />, color: "var(--purple)", bg: "var(--purple-s)" },
  ];

  const todaysPlan = [
    "10 mixed practice questions",
    "Review 3 missed rationales",
    "Deep dive: Pharmacology safety",
  ];

  const topCategories = useMemo(() => {
    const sorted = [...PRACTICE_CATEGORIES].sort((a, b) => b.count - a.count);
    return sorted.slice(0, 12);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-[1120px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: "var(--text-tertiary)" }}>Student dashboard</div>
            <h1 className="text-[32px] font-extrabold" style={{ letterSpacing: "-0.03em" }}>Your practice hub</h1>
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>Stay consistent, get feedback fast, and track readiness.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-g" onClick={() => navigate("/plan")}>
              View plan
            </button>
            <button className="btn btn-o" onClick={() => navigate("/practice/mixed")}>
              Start 10-question set <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="nclex-card" style={{ padding: "18px 20px" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-bold">Readiness</div>
              <LineChart size={16} style={{ color: "var(--text-tertiary)" }} />
            </div>
            <div className="text-[30px] font-extrabold" style={{ color: readiness.readiness >= 75 ? "var(--teal)" : readiness.readiness >= 55 ? "hsl(var(--primary))" : "var(--nclex-red)" }}>{readiness.readiness || 0}%</div>
            <div className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Weighted avg (last 14 days)</div>
            <div className="mt-3 h-[6px] rounded-full" style={{ background: "hsl(var(--background-alt))" }}>
              <div className="h-full rounded-full" style={{ width: `${readiness.readiness || 0}%`, background: "linear-gradient(90deg, hsl(var(--primary)), var(--teal))" }} />
            </div>
          </div>
          <div className="nclex-card" style={{ padding: "18px 20px" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "var(--accent-s)", color: "hsl(var(--primary))" }}>
                <Zap size={16} />
              </div>
              <div>
                <div className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Consistency</div>
                <div className="text-[18px] font-bold">{readiness.consistency}%</div>
              </div>
            </div>
            <div className="text-[12px] mt-2" style={{ color: "var(--text-secondary)" }}>Sessions in last 7 days: {readiness.last7.length}</div>
          </div>
          <div className="nclex-card" style={{ padding: "18px 20px" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "var(--gold-s)", color: "var(--gold)" }}>
                <Target size={16} />
              </div>
              <div>
                <div className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Questions (14 days)</div>
                <div className="text-[18px] font-bold">{readiness.totalQs}</div>
              </div>
            </div>
            <div className="text-[12px] mt-2" style={{ color: "var(--text-secondary)" }}>Keep 200+ for strong momentum.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 mb-8">
          <div className="nclex-card" style={{ padding: "22px 24px" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[16px] font-bold">Today's plan</div>
              <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "var(--text-tertiary)" }}>
                <CalendarDays size={14} /> {todayLabel}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {todaysPlan.map((t) => (
                <div key={t} className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
                  <span className="text-[13px]">{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="btn btn-p" onClick={() => navigate("/practice/mixed")} style={{ padding: "12px 18px", borderRadius: 12 }}>
                Start today's set <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="nclex-card" style={{ padding: "22px 24px" }}>
            <div className="text-[16px] font-bold mb-3">Focus loop</div>
            <div className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              {lastSession ? (
                <>Last session score: <strong>{lastSession.score}%</strong> · Focus: {lastSession.gaps?.slice(0, 2).join(", ") || "None"}</>
              ) : (
                <>Complete a practice set to unlock your feedback loop.</>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-o" onClick={() => navigate("/practice/mixed")} style={{ padding: "10px 14px" }}>
                Repeat mixed set
              </button>
              <button className="btn btn-g" onClick={() => navigate("/practice/pharm")} style={{ padding: "10px 14px" }}>
                Focus drill
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 mb-8">
          <div className="nclex-card" style={{ padding: "22px 24px" }}>
            <div className="text-[16px] font-bold mb-3">Recent sessions</div>
            <div className="flex flex-col gap-2">
              {sessions.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", padding: "10px 12px" }}>
                  <div>
                    <div className="text-[13px] font-semibold">{labelFor(s.bank)}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{new Date(s.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-[13px] font-bold" style={{ color: s.score >= 75 ? "var(--teal)" : s.score >= 55 ? "hsl(var(--primary))" : "var(--nclex-red)" }}>{s.score}%</div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>No sessions yet. Start your first set.</div>
              )}
            </div>
          </div>

          <div className="nclex-card" style={{ padding: "22px 24px" }}>
            <div className="text-[16px] font-bold mb-3">Subject drills</div>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.slice(0, 6).map((s) => (
                <button key={s.id} className="mo" onClick={() => navigate(`/practice/${s.id}`)}>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold">{s.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{s.subtopics.length} topics</div>
                  </div>
                  <ArrowRight size={12} style={{ color: "var(--text-tertiary)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="nclex-card" style={{ padding: "22px 24px" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[18px] font-bold">Question bank</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Top categories from your full database.</div>
            </div>
            <button className="btn btn-g" onClick={() => navigate("/practice/mixed")}>
              Browse all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
            {topCategories.map((c) => (
              <div key={c.id} className="nclex-card" style={{ padding: "16px 14px" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "hsl(var(--background-alt))", color: "var(--teal)" }}>
                    <Activity size={16} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{c.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{c.count} questions</div>
                  </div>
                </div>
                <button className="btn btn-o" onClick={() => navigate(`/practice/${c.id}`)} style={{ padding: "8px 10px", width: "100%" }}>
                  Start category <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="nclex-card" style={{ padding: "24px 26px", background: "linear-gradient(135deg, rgba(45,139,131,0.08), rgba(107,92,197,0.08))", marginTop: 16 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-[18px] font-bold">Study resources</div>
              <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Save key concepts, review misses, and track your focus areas.</div>
            </div>
            <button className="btn btn-p" onClick={() => navigate("/practice/mixed")} style={{ padding: "12px 18px", borderRadius: 12 }}>
              Open practice center <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
