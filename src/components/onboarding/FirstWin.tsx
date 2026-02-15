import { Check, ArrowRight } from "lucide-react";

interface Props {
  onNext: () => void;
  ProgressBar: React.FC;
}

export default function FirstWin({ onNext, ProgressBar }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-[440px] w-full text-center">
        <ProgressBar />
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-[14px]" style={{ background: "var(--green-s)" }}>
            <Check size={24} style={{ color: "var(--teal)" }} />
          </div>
          <h2 className="text-[26px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>Day 1: 20-min review + 5-question quiz</h2>
          <p className="text-[14px] mb-6 leading-[1.5]" style={{ color: "var(--text-secondary)" }}>Your first session is ready. Complete it now to lock in your streak and build momentum.</p>
          <button className="btn btn-p mb-[10px]" onClick={onNext} style={{ padding: "15px 36px" }}>Start Day 1 <ArrowRight size={16} /></button>
          <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Takes about 20 minutes</p>
        </div>
      </div>
    </div>
  );
}
