import type { UserAnswer } from "@/types";
import { supabase } from "@/lib/supabase";

export interface PracticeSession {
  id: string;
  date: string; // ISO
  bank: string;
  correct: number;
  total: number;
  score: number; // 0-100
  duration: number; // seconds
  strengths: string[];
  gaps: string[];
}

export function computeStrengthsAndGaps(answers: UserAnswer[]) {
  const cats: Record<string, { t: number; c: number }> = {};
  answers.forEach((a) => {
    if (!cats[a.cat]) cats[a.cat] = { t: 0, c: 0 };
    cats[a.cat].t++;
    if (a.correct) cats[a.cat].c++;
  });
  const sorted = Object.entries(cats)
    .map(([n, d]) => ({ name: n, pct: Math.round((d.c / d.t) * 100) }))
    .sort((a, b) => a.pct - b.pct);
  const strengths = sorted.filter((c) => c.pct >= 80).map((s) => s.name);
  const gaps = sorted.filter((c) => c.pct < 80).map((g) => g.name);
  return { strengths, gaps };
}

export async function loadSessions(): Promise<PracticeSession[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data, error } = await supabase
    .from("practice_sessions")
    .select("id, created_at, bank, correct, total, score, duration, strengths, gaps")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row: any) => ({
    id: row.id,
    date: row.created_at,
    bank: row.bank,
    correct: row.correct,
    total: row.total,
    score: row.score,
    duration: row.duration,
    strengths: row.strengths || [],
    gaps: row.gaps || [],
  }));
}

export async function saveSession(session: PracticeSession) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  await supabase.from("practice_sessions").insert({
    user_id: auth.user.id,
    bank: session.bank,
    correct: session.correct,
    total: session.total,
    score: session.score,
    duration: session.duration,
    strengths: session.strengths,
    gaps: session.gaps,
  });
}

export function computeReadiness(sessions: PracticeSession[]) {
  const now = Date.now();
  const last7 = sessions.filter((s) => (now - new Date(s.date).getTime()) / 86400000 <= 7);
  const last14 = sessions.filter((s) => (now - new Date(s.date).getTime()) / 86400000 <= 14);
  const avg = (arr: PracticeSession[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b.score, 0) / arr.length) : 0;
  const readiness = Math.round(avg(last7) * 0.7 + avg(last14) * 0.3);
  const consistency = Math.min(100, Math.round((last7.length / 7) * 100));
  const totalQs = last14.reduce((a, b) => a + b.total, 0);
  return { readiness, consistency, last7, last14, totalQs };
}
