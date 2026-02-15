import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50" style={{ background: "rgba(251,247,243,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid hsl(var(--border))" }}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-6 flex justify-between items-center h-14">
        <div className="flex items-center gap-[9px]">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #1A7A6E)" }}>
            <BookOpen size={13} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-[15px]" style={{ letterSpacing: "-0.02em" }}>
            NCLEX<span className="text-primary">Prep</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-5">
          <a href="#subjects" className="text-[13px] font-medium no-underline" style={{ color: "var(--text-secondary)" }}>Subjects</a>
          <a href="#method" className="text-[13px] font-medium no-underline" style={{ color: "var(--text-secondary)" }}>Method</a>
          <a href="#pricing" className="text-[13px] font-medium no-underline" style={{ color: "var(--text-secondary)" }}>Pricing</a>
          <button className="btn btn-p btn-sm" onClick={() => navigate("/onboarding")}>Get a Study Plan</button>
        </div>
      </div>
    </nav>
  );
}
