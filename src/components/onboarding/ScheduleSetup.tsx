import { ArrowRight, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { savePlan, stashPendingPlan } from "@/lib/plan";
import { supabase } from "@/lib/supabase";
import type { OnboardingData } from "@/types";

interface Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  studyDays: string[];
  setStudyDays: React.Dispatch<React.SetStateAction<string[]>>;
  ProgressBar: React.FC;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ScheduleSetup({ data, setData, studyDays, setStudyDays, ProgressBar }: Props) {
  const navigate = useNavigate();
  const toggle = (d: string) => setStudyDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-[440px] w-full">
        <ProgressBar />
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <Bell size={20} className="text-primary mb-[10px]" />
          <h2 className="text-[26px] font-extrabold mb-1" style={{ letterSpacing: "-0.03em" }}>Set your study schedule</h2>
          <p className="text-[13px] mb-6 leading-[1.5]" style={{ color: "var(--text-secondary)" }}>We'll send reminders on your study days. You can always change this later.</p>

          <div className="mb-5">
            <label className="text-[13px] font-bold mb-[10px] block">Study days</label>
            <div className="flex gap-[6px]">
              {days.map((d) => (
                <button key={d} onClick={() => toggle(d)} className="flex-1 font-semibold text-[12px] cursor-pointer transition-all duration-150" style={{
                  padding: "12px 4px", borderRadius: 10,
                  border: `1.5px solid ${studyDays.includes(d) ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                  background: studyDays.includes(d) ? "var(--accent-s)" : "hsl(var(--card))",
                  color: studyDays.includes(d) ? "hsl(var(--primary))" : "var(--text-tertiary)",
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                }}>{d}</button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[13px] font-bold mb-2 block">Reminder time</label>
            <div className="flex gap-2">
              {["8:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"].map((t) => (
                <button key={t} className={`mo${data.reminderTime === t ? " on" : ""}`} onClick={() => setData((d) => ({ ...d, reminderTime: t }))} style={{ flex: 1, justifyContent: "center", padding: "12px 8px", fontSize: 12 }}>{t}</button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-p"
            onClick={async () => {
              const { data: auth } = await supabase.auth.getSession();
              const plan = { data, studyDays, createdAt: new Date().toISOString() };
              if (!auth.session) {
                stashPendingPlan(plan);
                navigate("/login", { state: { from: "/study" } });
                return;
              }
              await savePlan(plan);
              navigate("/study");
            }}
            style={{ width: "100%", padding: 15, borderRadius: 12 }}
          >
            Start my plan <ArrowRight size={16} />
          </button>
          <p className="text-center text-[12px] mt-[10px]" style={{ color: "var(--text-tertiary)" }}>You're on track — your next step is always ready.</p>
        </div>
      </div>
    </div>
  );
}
