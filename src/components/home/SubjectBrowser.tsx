import { useState } from "react";
import { ChevronDown, ChevronRight, Lock, Activity, Heart, Sparkles, Star, BookOpen, Brain, Shield, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "@/data/subjects";
import SectionHeading from "@/components/shared/SectionHeading";

const iconMap: Record<string, React.ElementType> = { Activity, Heart, Sparkles, Star, BookOpen, Brain, Shield, Target };

export default function SubjectBrowser() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);

  const handleSubtopicClick = (subject: typeof SUBJECTS[0], subtopic: string) => {
    navigate("/login", { state: { subject, subtopic } });
  };

  return (
    <section id="subjects" className="border-t border-b" style={{ padding: "56px 0", background: "hsl(var(--background-alt))", borderColor: "hsl(var(--border))" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionHeading center sub="Explore every NCLEX category. Click a subject to see subtopics — sign in to access practice questions.">All NCLEX subjects, organized.</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
          {SUBJECTS.map((s) => {
            const Icon = iconMap[s.icon] || BookOpen;
            return (
              <div key={s.id} className={`subj-card${open === s.id ? " open" : ""}`}>
                <button className="subj-btn" onClick={() => setOpen(open === s.id ? null : s.id)}>
                  <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--background-alt))", color: s.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14px]">{s.name}</div>
                    <div className="text-[11px] leading-tight" style={{ color: "var(--text-tertiary)" }}>{s.subtopics.length} subtopics</div>
                  </div>
                  <ChevronDown size={14} className="flex-shrink-0 transition-transform duration-200" style={{ color: "var(--text-tertiary)", transform: open === s.id ? "rotate(180deg)" : "none" }} />
                </button>
                {open === s.id && (
                  <div className="px-4 pb-4" style={{ animation: "fadeIn 0.2s ease" }}>
                    <div className="border-t pt-3" style={{ borderColor: "hsl(var(--border))" }}>
                      <p className="text-[12px] mb-[10px] leading-[1.4]" style={{ color: "var(--text-secondary)" }}>{s.description}</p>
                      <div className="flex flex-col gap-1">
                        {s.subtopics.map((st, j) => (
                          <button key={j} className="st-btn" onClick={() => handleSubtopicClick(s, st)}>
                            <span>{st}</span>
                            <div className="flex items-center gap-1">
                              <Lock size={10} style={{ color: "var(--text-tertiary)" }} />
                              <ChevronRight size={12} style={{ color: "var(--text-tertiary)" }} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
