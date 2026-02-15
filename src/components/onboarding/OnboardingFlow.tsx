import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { OnboardingData, UserAnswer } from "@/types";
import DiagnosticSetup from "./DiagnosticSetup";
import DiagnosticRun from "./DiagnosticRun";
import DiagnosticResults from "./DiagnosticResults";
import MicroIntake from "./MicroIntake";
import PlanPreview from "./PlanPreview";
import SavePlan from "./SavePlan";
import FirstWin from "./FirstWin";
import ScheduleSetup from "./ScheduleSetup";

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    focus: "mixed", nclexDate: null, readiness: null, dailyTime: null, email: "", reminderTime: "8:00 AM",
  });
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [ak, setAk] = useState(0);
  const [studyDays, setStudyDays] = useState(["Mon", "Tue", "Thu", "Sat"]);

  useEffect(() => { setAk((k) => k + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const totalSteps = 8;
  const progress = ((step + 1) / totalSteps) * 100;

  const ProgressBar = () => (
    <div className="flex items-center gap-3 mb-8">
      {step > 0 ? (
        <button className="btn btn-g" onClick={() => setStep(step - 1)} style={{ padding: "8px 10px", borderRadius: 8 }}><ArrowLeft size={16} /></button>
      ) : (
        <button className="btn btn-g" onClick={() => navigate("/")} style={{ padding: "8px 10px", borderRadius: 8 }}><ArrowLeft size={16} /></button>
      )}
      <div className="flex-1 h-[3px] rounded-[10px] overflow-hidden" style={{ background: "hsl(var(--border))" }}>
        <div className="h-full rounded-[10px] bg-primary transition-all duration-400" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>Step {step + 1}/{totalSteps}</span>
    </div>
  );

  if (step === 0) return <DiagnosticSetup key={ak} data={data} setData={setData} onNext={() => setStep(1)} onHome={() => navigate("/")} ProgressBar={ProgressBar} />;
  if (step === 1) return <DiagnosticRun bank={data.focus} onComplete={(ans, time) => { setAnswers(ans); setElapsed(time); setStep(2); }} />;
  if (step === 2) return <DiagnosticResults key={ak} answers={answers} elapsed={elapsed} onNext={() => setStep(3)} ProgressBar={ProgressBar} />;
  if (step === 3) return <MicroIntake key={ak} data={data} setData={setData} onNext={() => setStep(4)} ProgressBar={ProgressBar} />;
  if (step === 4) return <PlanPreview key={ak} data={data} answers={answers} onNext={() => setStep(5)} ProgressBar={ProgressBar} />;
  if (step === 5) return <SavePlan key={ak} data={data} setData={setData} onNext={() => setStep(6)} onSkip={() => setStep(6)} ProgressBar={ProgressBar} />;
  if (step === 6) return <FirstWin key={ak} onNext={() => setStep(7)} ProgressBar={ProgressBar} />;
  if (step === 7) return <ScheduleSetup key={ak} data={data} setData={setData} studyDays={studyDays} setStudyDays={setStudyDays} ProgressBar={ProgressBar} />;
  return null;
}
