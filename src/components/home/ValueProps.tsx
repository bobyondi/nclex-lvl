import { Target, Brain, Zap } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

const cards = [
  { icon: <Target size={20} />, color: "var(--coral)", bg: "var(--accent-s)", title: "The Noise Filter", desc: "We've removed 1,500 \"low-yield\" topics. You only study what actually shows up on the NGN." },
  { icon: <Brain size={20} />, color: "var(--teal)", bg: "var(--teal-s)", title: "Personalized Logic", desc: "Our algorithm identifies how you think. We fix your prioritization gaps, not just your facts." },
  { icon: <Zap size={20} />, color: "var(--purple)", bg: "var(--purple-s)", title: "The Final Goal", desc: "Stop guessing. Start thinking like a safe, licensed RN. The 85-question finish is the target." },
];

export default function ValueProps() {
  return (
    <section className="border-t border-b" style={{ padding: "56px 0", background: "hsl(var(--background-alt))", borderColor: "hsl(var(--border))" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionHeading center sub={<>Most prep courses give you 3,000 questions and say 'good luck.' We give you the 3 things that actually move the needle.</>}>
          Your guided path to <span className="text-primary">passing.</span>
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {cards.map((c, i) => (
            <div key={i} className="nclex-card" style={{ borderTop: `2px solid ${c.color}` }}>
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
              <h3 className="font-bold text-[16px] mb-[6px]">{c.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
