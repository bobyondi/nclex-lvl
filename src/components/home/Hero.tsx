import { useState } from "react";
import { ArrowRight, Activity, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HERO_QUESTIONS } from "@/data/questions";
import HeroQuestion from "./HeroQuestion";

const focusOpts = [
  { k: "mixed", l: "All Subjects" },
  { k: "pharm", l: "Pharmacology" },
  { k: "medsurg", l: "Med-Surg" },
  { k: "maternity", l: "Maternal-Newborn" },
  { k: "peds", l: "Pediatrics" },
  { k: "fundamentals", l: "Fundamentals" },
  { k: "mental", l: "Mental Health" },
  { k: "safety", l: "Safety & Infection Control" },
  { k: "management", l: "Management of Care" },
];

export default function Hero() {
  const navigate = useNavigate();
  const [focus, setFocus] = useState("mixed");
  const [qi, setQi] = useState(0);
  const [k, setK] = useState(0);

  const qs = HERO_QUESTIONS[focus] || HERO_QUESTIONS.mixed;
  const handleFocusChange = (newFocus: string) => { setFocus(newFocus); setQi(0); setK((k) => k + 1); };
  const next = () => { setQi((i) => (i + 1) % qs.length); setK((k) => k + 1); };

  return (
    <section className="relative overflow-hidden" style={{ padding: "56px 0 48px" }}>
      <div className="absolute pointer-events-none" style={{ top: -180, left: "10%", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(45,139,131,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="max-w-[1100px] mx-auto px-6 relative z-[1]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-11 items-center">
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <span className="inline-flex items-center gap-[6px] text-[12px] font-bold text-primary" style={{ background: "var(--accent-s)", border: "1px solid rgba(45,139,131,0.12)", padding: "5px 14px", borderRadius: 100 }}>
              <Activity size={11} /> Built for the Next-Gen NCLEX
            </span>
            <h1 className="font-extrabold leading-[1.1]" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", letterSpacing: "-0.03em", marginTop: 20, marginBottom: 16 }}>
              Stop studying everything.<br /><span className="text-primary">Start studying what matters.</span>
            </h1>
            <p className="text-[17px] leading-relaxed max-w-[460px] mb-7" style={{ color: "var(--text-secondary)" }}>
              The NCLEX isn't about how much you know — it's about how you think. Take a free diagnostic and get a guided study plan in under 5 minutes.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="btn btn-p" onClick={() => navigate("/onboarding")} style={{ fontSize: 16, padding: "15px 32px" }}>Get a Study Plan <ArrowRight size={17} /></button>
              <span className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>No account required</span>
            </div>
            <div className="flex gap-7 mt-8 flex-wrap">
              {[{ n: "10K+", l: "practice questions" }, { n: "8", l: "NCLEX categories" }, { n: "4.8★", l: "student rating" }].map((s, i) => (
                <div key={i}>
                  <div className="text-[22px] font-extrabold text-primary" style={{ letterSpacing: "-0.03em" }}>{s.n}</div>
                  <div className="text-[12px] font-medium mt-[1px]" style={{ color: "var(--text-tertiary)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ animation: "fadeUp 0.5s ease 0.1s forwards", opacity: 0 }}>
            <div className="rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid rgba(0,0,0,0.13)", padding: "20px 20px 22px", boxShadow: "0 12px 40px rgba(0,0,0,0.07)" }}>
              <div className="flex items-center justify-between mb-[14px]">
                <div className="flex items-center gap-[7px]">
                  <div className="w-[7px] h-[7px] rounded-full bg-primary animate-pulseRing" />
                  <span className="text-[11px] font-bold text-primary uppercase" style={{ letterSpacing: "0.06em" }}>Try a question</span>
                </div>
                <div className="relative">
                  <select value={focus} onChange={(e) => handleFocusChange(e.target.value)} className="cursor-pointer" style={{ padding: "5px 26px 5px 8px", background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 7, color: "hsl(var(--foreground))", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 11, fontWeight: 600, outline: "none", appearance: "none" }}>
                    {focusOpts.map((f) => <option key={f.k} value={f.k}>{f.l}</option>)}
                  </select>
                  <ChevronDown size={11} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-tertiary)" }} />
                </div>
              </div>
              <div key={k}>
                <HeroQuestion q={qs[qi]} onNext={next} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
