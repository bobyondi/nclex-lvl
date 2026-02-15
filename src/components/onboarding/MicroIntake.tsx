import { ArrowRight } from "lucide-react";
import type { OnboardingData } from "@/types";

interface Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  ProgressBar: React.FC;
}

const readiness = [{ k: "not", l: "Not ready", e: "😰" }, { k: "somewhat", l: "Somewhat", e: "😐" }, { k: "confident", l: "Confident", e: "💪" }];
const times = [{ k: "15", l: "15 min/day" }, { k: "30", l: "30 min/day" }, { k: "60", l: "60+ min/day" }];

export default function MicroIntake({ data, setData, onNext, ProgressBar }: Props) {
  const allDone = data.readiness && data.dailyTime;

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-[460px] w-full">
        <ProgressBar />
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <h2 className="text-[26px] font-extrabold mb-1" style={{ letterSpacing: "-0.03em" }}>A few quick questions</h2>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>This customizes your pace and daily workload.</p>

          <div className="mb-5">
            <label className="text-[13px] font-bold mb-2 block">When is your NCLEX?</label>
            <div className="flex gap-2">
              <input type="date" className="ei flex-1" style={{ paddingLeft: 16 }} value={data.nclexDate === "none" ? "" : data.nclexDate || ""} onChange={(e) => setData((d) => ({ ...d, nclexDate: e.target.value }))} />
              <button className={`mo${data.nclexDate === "none" ? " on" : ""}`} onClick={() => setData((d) => ({ ...d, nclexDate: "none" }))} style={{ flex: "none", width: "auto", padding: "12px 16px", fontSize: 13, whiteSpace: "nowrap" }}>Not scheduled</button>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[13px] font-bold mb-2 block">How ready do you feel?</label>
            <div className="flex gap-2">
              {readiness.map((r) => (
                <button key={r.k} className={`mo${data.readiness === r.k ? " on" : ""}`} onClick={() => setData((d) => ({ ...d, readiness: r.k as any }))} style={{ flex: 1, justifyContent: "center", padding: "14px 10px", flexDirection: "column", gap: 4, textAlign: "center" }}>
                  <span className="text-[20px]">{r.e}</span>
                  <span className="text-[12px]">{r.l}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[13px] font-bold mb-2 block">Daily study time?</label>
            <div className="flex gap-2">
              {times.map((t) => (
                <button key={t.k} className={`mo${data.dailyTime === t.k ? " on" : ""}`} onClick={() => setData((d) => ({ ...d, dailyTime: t.k as any }))} style={{ flex: 1, justifyContent: "center" }}>{t.l}</button>
              ))}
            </div>
          </div>

          <button className={`btn ${allDone ? "btn-p" : "btn-d"}`} onClick={() => allDone && onNext()} style={{ width: "100%", padding: 15, borderRadius: 12 }}>See my plan <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
