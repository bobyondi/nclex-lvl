export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subtopics: string[];
}

export interface Choice {
  id: string;
  t: string;
}

export interface Question {
  id: number;
  cat: string;
  stem: string;
  choices: Choice[];
  correct: string;
  rationale: string;
  whyNot?: Record<string, string>;
  keyConcept: string;
}

export interface Testimonial {
  platform: "tiktok" | "reddit" | "instagram";
  user: string;
  handle: string;
  avatar: [string, string];
  text: string;
  likes?: string;
  upvotes?: string;
  comments?: string;
  badge?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  pop: boolean;
  features: string[];
  cta: string;
}

export interface UserAnswer {
  questionId: number;
  selected: string;
  confidence: "guess" | "unsure" | "confident" | null;
  correct: boolean;
  cat: string;
}

export interface OnboardingData {
  focus: string;
  nclexDate: string | null;
  readiness: "not" | "somewhat" | "confident" | null;
  dailyTime: "15" | "30" | "60" | null;
  email: string;
  reminderTime: string;
}
