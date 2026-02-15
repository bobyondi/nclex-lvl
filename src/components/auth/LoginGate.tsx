import { useState } from "react";
import { Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginGate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, subtopic } = (location.state as { subject?: any; subtopic?: string }) || {};
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-10" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-[420px] w-full text-center" style={{ animation: "fadeUp 0.4s ease" }}>
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-4" style={{ background: "var(--accent-s)" }}>
          <Lock size={22} className="text-primary" />
        </div>
        <h2 className="text-[24px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>{subtopic || "Practice Questions"}</h2>
        <p className="text-[14px] leading-[1.5] mb-6" style={{ color: "var(--text-secondary)" }}>
          Sign in to access practice questions{subject ? <> for <strong>{subject.name} → {subtopic}</strong></> : ""}. We'll send you a magic link — no password needed.
        </p>
        <div className="relative mb-3 text-left">
          <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input className="ei" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </div>
        <button className={`btn ${email.includes("@") ? "btn-p" : "btn-d"}`} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15, marginBottom: 12 }}>
          Send magic link <ArrowRight size={15} />
        </button>
        <button className="btn btn-g" onClick={() => navigate("/")}>
          <ArrowLeft size={14} /> Back to subjects
        </button>
      </div>
    </div>
  );
}
