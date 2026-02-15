import { ArrowRight, BarChart3, ChevronDown } from "lucide-react";
import type { OnboardingData } from "@/types";

const focuses = [
  { k: "mixed", l: "Mixed — Full snapshot" },
  { k: "pharm", l: "Pharmacology" },
  { k: "medsurg", l: "Med-Surg" },
  { k: "maternity", l: "Maternal-Newborn" },
  { k: "peds", l: "Pediatrics" },
  { k: "fundamentals", l: "Fundamentals" },
  { k: "mental", l: "Mental Health" },
  { k: "safety", l: "Safety & Infection Control" },
  { k: "management", l: "Management of Care" },
];

interface Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onHome: () => void;
  ProgressBar: React.FC;
}

export default function DiagnosticSetup({ data, setData, onNext, onHome, ProgressBar }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-[460px] w-full">
        <ProgressBar />
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4" style={{ background: "var(--accent-s)" }}>
            <BarChart3 size={22} className="text-primary" />
          </div>
          <h2 className="text-[26px] font-extrabold mb-1" style={{ letterSpacing: "-0.03em" }}>Choose a focus for your diagnostic</h2>
          <p className="text-[14px] mb-6" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Pick your weakest area or go Mixed for a full snapshot.</p>
          <label className="text-[13px] font-bold mb-2 block">Subject focus</label>
          <div className="relative mb-5">
            <select
              value={data.focus}
              onChange={(e) => setData((d) => ({ ...d, focus: e.target.value }))}
              className="w-full cursor-pointer"
              style={{ padding: "16px 44px 16px 18px", background: "hsl(var(--card))", border: "1.5px solid hsl(var(--border))", borderRadius: 12, color: "hsl(var(--foreground))", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 16, fontWeight: 600, outline: "none", appearance: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              {focuses.map((f) => <option key={f.k} value={f.k}>{f.l}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
          </div>
          <button className="btn btn-p" onClick={onNext} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15 }}>Start diagnostic <ArrowRight size={16} /></button>
          <p className="text-center text-[12px] mt-3" style={{ color: "var(--text-tertiary)" }}>5–7 questions · Under 5 minutes · Instant results</p>
        </div>
      </div>
    </div>
  );
}
