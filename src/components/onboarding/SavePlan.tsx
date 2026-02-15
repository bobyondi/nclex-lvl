import { Mail, ArrowRight, Lock } from "lucide-react";
import type { OnboardingData } from "@/types";

interface Props {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onSkip: () => void;
  ProgressBar: React.FC;
}

export default function SavePlan({ data, setData, onNext, onSkip, ProgressBar }: Props) {
  const go = () => { if (data.email.includes("@")) onNext(); };

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-[420px] w-full text-center">
        <ProgressBar />
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <Mail size={22} className="text-primary mb-3" />
          <h2 className="text-[26px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>Save progress and get reminders.</h2>
          <p className="text-[14px] mb-5 leading-[1.5]" style={{ color: "var(--text-secondary)" }}>We'll send you a magic link — no password to remember.</p>
          <div className="relative mb-3 text-left">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
            <input className="ei" type="email" placeholder="your@email.com" value={data.email} onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && go()} autoFocus />
          </div>
          <button className={`btn ${data.email.includes("@") ? "btn-p" : "btn-d"}`} onClick={go} style={{ width: "100%", padding: 15, borderRadius: 12, marginBottom: 10 }}>Save my plan <ArrowRight size={16} /></button>
          <button className="btn btn-g" onClick={onSkip} style={{ fontSize: 13 }}>Continue without saving</button>
          <p className="text-[11px] mt-[10px] flex items-center justify-center gap-1" style={{ color: "var(--text-tertiary)" }}><Lock size={10} /> No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}
