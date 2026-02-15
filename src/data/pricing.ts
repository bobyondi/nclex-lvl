import type { PricingPlan } from "@/types";

export const PLANS: PricingPlan[] = [
  { name: "Starter", price: "Free", period: "", pop: false, features: ["Full diagnostic", "Personalized study plan", "20 practice questions", "Basic rationales"], cta: "Start free" },
  { name: "Pro", price: "$69", period: "/30 days", pop: true, features: ["Full 10K+ question bank", "Adaptive difficulty engine", "'Why wrong' deep rationales", "Category analytics", "Confidence tracking", "Unlimited practice tests"], cta: "Start 7-day free trial" },
  { name: "Intensive", price: "$99", period: "one-time", pop: false, features: ["Everything in Pro", "90-day all-access", "NGN case study simulations", "Exam readiness predictor", "Priority content updates"], cta: "Get full access" },
];
