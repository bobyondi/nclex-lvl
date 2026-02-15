import { useState, useEffect, useRef } from "react";
import { Check, X, ArrowRight, Clock } from "lucide-react";
import type { UserAnswer } from "@/types";
import { DIAGNOSTIC_BANKS } from "@/data/questions";
import { shuffle, formatTime } from "@/lib/utils";

interface Props {
  bank: string;
  onComplete: (answers: UserAnswer[], elapsed: number) => void;
}

export default function DiagnosticRun({ bank, onComplete }: Props) {
  const [qs] = useState(() => shuffle(DIAGNOSTIC_BANKS[bank] || DIAGNOSTIC_BANKS.mixed).slice(0, 7));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [conf, setConf] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cfs = [
    { k: "guess", l: "Guessing", c: "var(--nclex-red)", bg: "var(--red-s)" },
    { k: "unsure", l: "Unsure", c: "hsl(var(--primary))", bg: "var(--accent-s)" },
    { k: "confident", l: "Confident", c: "var(--teal)", bg: "var(--teal-s)" },
  ];

  useEffect(() => { timer.current = setInterval(() => setElapsed((e) => e + 1), 1000); return () => { if (timer.current) clearInterval(timer.current); }; }, []);
  useEffect(() => { setSel(null); setConf(null); setDone(false); }, [idx]);

  const submit = () => { if (sel) setDone(true); };
  const next = () => {
    const q = qs[idx];
    const na: UserAnswer[] = [...answers, { questionId: q.id, selected: sel!, confidence: conf as any, correct: sel === q.correct, cat: q.cat }];
    setAnswers(na);
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else { if (timer.current) clearInterval(timer.current); onComplete(na, elapsed); }
  };

  const q = qs[idx];
  const isOk = sel === q.correct;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50" style={{ borderBottom: "1px solid hsl(var(--border))", background: "rgba(251,247,243,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-[1100px] mx-auto flex justify-between items-center" style={{ padding: "12px 24px" }}>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold">{idx + 1}<span style={{ color: "var(--text-tertiary)" }}>/{qs.length}</span></span>
            <span className="text-[11px] font-semibold text-primary" style={{ background: "var(--accent-s)", padding: "3px 10px", borderRadius: 100 }}>{q.cat}</span>
          </div>
          <div className="flex items-center gap-[10px]">
            <span className="text-[12px] hidden md:inline" style={{ color: "var(--text-secondary)" }}>Building your plan in real time</span>
            <span className="flex items-center gap-1 text-[13px]" style={{ color: "var(--text-tertiary)" }}><Clock size={13} />{formatTime(elapsed)}</span>
          </div>
        </div>
        <div className="h-[3px]" style={{ background: "hsl(var(--border))" }}>
          <div className="h-full transition-all duration-400" style={{ width: `${((idx + (done ? 1 : 0.5)) / qs.length) * 100}%`, background: "linear-gradient(90deg, hsl(var(--primary)), var(--teal))" }} />
        </div>
      </div>

      <div className="max-w-[640px] mx-auto flex-1 px-6 pt-7 pb-10" key={idx}>
        <h2 className="text-[17px] font-semibold leading-relaxed mb-5" style={{ animation: "fadeUp 0.35s ease" }}>{q.stem}</h2>
        <div className="flex flex-col gap-[7px] mb-5">
          {q.choices.map((c) => {
            let cls = "qc";
            if (done) { if (c.id === q.correct) cls += " ok"; else if (c.id === sel) cls += " no"; else cls += " dim"; }
            else if (sel === c.id) cls += " sel";
            return (
              <button key={c.id} className={cls} onClick={() => !done && setSel(c.id)} disabled={done}>
                <span className="ql">{done && c.id === q.correct ? <Check size={13} /> : done && c.id === sel && !isOk ? <X size={13} /> : c.id.toUpperCase()}</span>
                <span>{c.t}</span>
              </button>
            );
          })}
        </div>

        {!done && (
          <div>
            <div className="flex items-center justify-between mb-[7px]">
              <span className="text-[11px] font-bold uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.08em" }}>How confident are you?</span>
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Optional</span>
            </div>
            <div className="flex gap-[7px] mb-[14px]">
              {cfs.map((cl) => (
                <button key={cl.k} className="cf" onClick={() => setConf(cl.k)} style={{ color: conf === cl.k ? cl.c : undefined, borderColor: conf === cl.k ? cl.c : undefined, background: conf === cl.k ? cl.bg : undefined }}>{cl.l}</button>
              ))}
            </div>
            <button className={`btn ${sel ? "btn-p" : "btn-d"}`} onClick={submit} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15 }}>Check Answer</button>
          </div>
        )}

        {done && (
          <div className="flex flex-col gap-3" style={{ animation: "scaleIn 0.3s ease" }}>
            <div className="rounded-xl" style={{ background: isOk ? "var(--green-s)" : "var(--red-s)", border: `1px solid ${isOk ? "rgba(26,122,110,0.12)" : "rgba(201,68,82,0.1)"}`, padding: "18px 20px" }}>
              <div className="font-bold text-[15px] mb-2" style={{ color: isOk ? "var(--teal)" : "var(--nclex-red)" }}>{isOk ? "Correct!" : "Not quite."}</div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{q.rationale}</p>
            </div>
            {!isOk && sel && q.whyNot?.[sel] && (
              <div className="rounded-xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", padding: "16px 20px", animation: "fadeIn 0.3s ease 0.1s forwards", opacity: 0 }}>
                <div className="font-bold text-[13px] mb-[6px]">Why {sel.toUpperCase()} is wrong:</div>
                <p className="text-[13px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>{q.whyNot[sel]}</p>
              </div>
            )}
            {q.keyConcept && (
              <div className="rounded-xl" style={{ background: "var(--gold-s)", border: "1px solid rgba(196,155,47,0.15)", padding: "16px 20px", animation: "fadeIn 0.3s ease 0.15s forwards", opacity: 0 }}>
                <div className="font-bold text-[13px] mb-[6px]" style={{ color: "var(--gold)" }}>Key Takeaway</div>
                <p className="text-[13px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>{q.keyConcept}</p>
              </div>
            )}
            <button className="btn btn-p" onClick={next} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15 }}>
              {idx + 1 < qs.length ? "Next Question" : "See my results"} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
