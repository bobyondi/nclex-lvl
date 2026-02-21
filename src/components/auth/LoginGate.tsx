import { useState } from "react";
import { Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { signIn, signUp } from "@/lib/auth";
import { consumePendingPlan, savePlan } from "@/lib/plan";

export default function LoginGate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, subtopic } = (location.state as { subject?: any; subtopic?: string }) || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.includes("@") && password.length >= 6 && !loading;

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      const pending = consumePendingPlan();
      if (pending) await savePlan(pending);
      navigate((location.state as any)?.from || "/study");
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const data = await signUp(email, password);
      if (!data.session) {
        setError("Check your email to confirm your account, then sign in.");
        return;
      }
      const pending = consumePendingPlan();
      if (pending) await savePlan(pending);
      navigate((location.state as any)?.from || "/study");
    } catch (e: any) {
      setError(e?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-[420px] w-full text-center" style={{ animation: "fadeUp 0.4s ease" }}>
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-4" style={{ background: "var(--accent-s)" }}>
          <Lock size={22} className="text-primary" />
        </div>
        <h2 className="text-[24px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>{subtopic || "Practice Questions"}</h2>
        <p className="text-[14px] leading-[1.5] mb-6" style={{ color: "var(--text-secondary)" }}>
          Sign in to access practice questions{subject ? <> for <strong>{subject.name} → {subtopic}</strong></> : ""}.
        </p>
        <div className="relative mb-3 text-left">
          <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input className="ei" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </div>
        <div className="relative mb-3 text-left">
          <KeyRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input className="ei" type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && (
          <div className="text-[12px] mb-3" style={{ color: "var(--nclex-red)" }}>{error}</div>
        )}
        <button className={`btn ${canSubmit ? "btn-p" : "btn-d"}`} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15, marginBottom: 8 }} onClick={handleSignIn}>
          {loading ? "Signing in..." : "Sign in"} <ArrowRight size={15} />
        </button>
        <button className={`btn ${canSubmit ? "btn-o" : "btn-d"}`} style={{ width: "100%", padding: 13, borderRadius: 12, fontSize: 14, marginBottom: 12 }} onClick={handleSignUp}>
          Create account
        </button>
        <button className="btn btn-g" onClick={() => navigate("/")}> <ArrowLeft size={14} /> Back to subjects </button>
      </div>
    </div>
  );
}
