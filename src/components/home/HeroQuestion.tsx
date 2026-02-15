import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import type { Question } from "@/types";

interface Props {
  q: Question;
  onNext: () => void;
}

export default function HeroQuestion({ q, onNext }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const isOk = sel === q.correct;

  return (
    <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
      <div className="flex justify-between items-center mb-[10px]">
        <span className="text-[11px] font-bold uppercase text-primary" style={{ letterSpacing: "0.08em" }}>{q.cat}</span>
        <span className="text-[11px] font-semibold" style={{ color: "var(--text-tertiary)" }}>NCLEX-Style</span>
      </div>
      <p className="text-[14px] font-semibold leading-[1.55] mb-[14px]">{q.stem}</p>
      <div className="flex flex-col gap-[5px] mb-3">
        {q.choices.map((c) => {
          let cls = "qc";
          if (done) { if (c.id === q.correct) cls += " ok"; else if (c.id === sel) cls += " no"; else cls += " dim"; }
          else if (sel === c.id) cls += " sel";
          return (
            <button key={c.id} className={cls} onClick={() => !done && setSel(c.id)} disabled={done} style={{ padding: "10px 12px", fontSize: 13 }}>
              <span className="ql" style={{ width: 20, height: 20, fontSize: 10 }}>
                {done && c.id === q.correct ? <Check size={11} /> : done && c.id === sel && !isOk ? <X size={11} /> : c.id.toUpperCase()}
              </span>
              <span>{c.t}</span>
            </button>
          );
        })}
      </div>
      {!done && <button className={`btn ${sel ? "btn-p" : "btn-d"}`} onClick={() => sel && setDone(true)} style={{ width: "100%", padding: 11, borderRadius: 10, fontSize: 13 }}>Check my answer</button>}
      {done && (
        <div className="flex flex-col gap-[6px]" style={{ animation: "scaleIn 0.3s ease" }}>
          <div style={{ background: isOk ? "var(--green-s)" : "var(--red-s)", border: `1px solid ${isOk ? "rgba(26,122,110,0.15)" : "rgba(201,68,82,0.12)"}`, borderRadius: 10, padding: "12px 14px" }}>
            <div className="font-bold text-[13px] mb-1" style={{ color: isOk ? "var(--teal)" : "var(--nclex-red)" }}>{isOk ? "Correct!" : "Not quite."}</div>
            <p className="text-[12px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>{q.rationale}</p>
          </div>
          {!isOk && sel && q.whyNot?.[sel] && (
            <div style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "10px 12px", animation: "fadeIn 0.3s ease 0.1s forwards", opacity: 0 }}>
              <div className="font-bold text-[11px] mb-[3px]">Why {sel.toUpperCase()} is wrong:</div>
              <p className="text-[11px] leading-[1.5]" style={{ color: "var(--text-secondary)" }}>{q.whyNot[sel]}</p>
            </div>
          )}
          {q.keyConcept && (
            <div style={{ background: "var(--gold-s)", border: "1px solid rgba(196,155,47,0.12)", borderRadius: 8, padding: "10px 12px", animation: "fadeIn 0.3s ease 0.15s forwards", opacity: 0 }}>
              <div className="font-bold text-[11px] mb-[3px]" style={{ color: "var(--gold)" }}>Key Takeaway</div>
              <p className="text-[11px] leading-[1.5]" style={{ color: "var(--text-secondary)" }}>{q.keyConcept}</p>
            </div>
          )}
          <button className="btn btn-o" onClick={onNext} style={{ width: "100%", padding: 10, borderRadius: 10, fontSize: 13 }}>Try another <ArrowRight size={13} /></button>
        </div>
      )}
    </div>
  );
}
