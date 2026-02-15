import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section style={{ padding: "56px 0" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center rounded-[18px]" style={{ padding: "48px 28px", background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h2 className="font-extrabold mb-[10px]" style={{ fontSize: "clamp(24px, 3.5vw, 32px)", letterSpacing: "-0.03em" }}>
            Every nurse you admire passed this exam. <span className="text-primary">Your turn.</span>
          </h2>
          <p className="text-[15px] leading-relaxed max-w-[440px] mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
            5 minutes to a plan that tells you exactly what to do next.
          </p>
          <button className="btn btn-p" onClick={() => navigate("/onboarding")} style={{ padding: "15px 36px" }}>Get a Study Plan <ArrowRight size={17} /></button>
        </div>
      </div>
    </section>
  );
}
