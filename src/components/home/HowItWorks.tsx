import { BarChart3, Target, Brain, Zap } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = [
  { n: "01", icon: <BarChart3 size={18} />, title: "5-min diagnostic", desc: "We find your exact gaps — not a generic test. You'll know what to fix before you open a single textbook." },
  { n: "02", icon: <Target size={18} />, title: "Your guided plan", desc: "A day-by-day study path built from YOUR results. You'll always know what to do next." },
  { n: "03", icon: <Brain size={18} />, title: "Adaptive practice", desc: "Questions get harder as you improve. Our engine tracks confidence, not just answers." },
  { n: "04", icon: <Zap size={18} />, title: "85-question finish", desc: "The final goal: shut down the exam in 85 questions. Every session moves you closer." },
];

export default function HowItWorks() {
  return (
    <section id="method" style={{ padding: "56px 0" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionHeading center sub="A simple process to passing NCLEX and becoming the nurse the world needs!">How it works</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s, i) => (
            <div key={i} className="nclex-card relative pt-6">
              <div className="text-[28px] font-extrabold mb-3" style={{ letterSpacing: "-0.03em", color: i === 0 ? "hsl(var(--primary))" : "var(--text-tertiary)", opacity: i === 0 ? 1 : 0.4 }}>{s.n}</div>
              <h3 className="font-bold text-[15px] mb-[6px]">{s.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
