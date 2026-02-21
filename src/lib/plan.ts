import type { OnboardingData } from "@/types";
import { supabase } from "@/lib/supabase";

export interface StudyPlan {
  data: OnboardingData;
  studyDays: string[];
  createdAt: string;
}

const PENDING_KEY = "nclex_pending_plan";

export function stashPendingPlan(plan: StudyPlan) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(plan));
}

export function consumePendingPlan(): StudyPlan | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  window.localStorage.removeItem(PENDING_KEY);
  try {
    return JSON.parse(raw) as StudyPlan;
  } catch {
    return null;
  }
}

export async function savePlan(plan: StudyPlan) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  await supabase.from("study_plans").upsert({
    user_id: auth.user.id,
    data: plan.data,
    study_days: plan.studyDays,
  });
}

export async function loadPlan(): Promise<StudyPlan | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("study_plans")
    .select("data, study_days, created_at")
    .eq("user_id", auth.user.id)
    .single();
  if (error || !data) return null;
  return { data: data.data, studyDays: data.study_days || [], createdAt: data.created_at };
}
