import type { Subject } from "@/types";

export const SUBJECTS: Subject[] = [
  { id: "pharm", name: "Pharmacology", icon: "Activity", color: "var(--coral)", description: "Drug classes, interactions, and nursing implications",
    subtopics: ["Drug Classifications", "Side Effects & Adverse Reactions", "Drug Interactions", "Nursing Implications", "Dosage Calculations", "IV Medications", "High-Alert Medications", "Herbal & OTC Interactions"] },
  { id: "medsurg", name: "Med-Surg", icon: "Heart", color: "var(--teal)", description: "Assessment, interventions, and disease management",
    subtopics: ["Cardiovascular", "Respiratory", "Gastrointestinal", "Neurological", "Endocrine", "Renal & Urinary", "Musculoskeletal", "Hematology & Oncology", "Immune & Integumentary"] },
  { id: "maternity", name: "Maternal-Newborn", icon: "Sparkles", color: "var(--rose)", description: "Antepartum through postpartum and newborn care",
    subtopics: ["Antepartum Care", "Intrapartum & Labor", "Postpartum Recovery", "Newborn Assessment", "High-Risk Pregnancy", "Fetal Monitoring", "Breastfeeding & Nutrition"] },
  { id: "peds", name: "Pediatrics", icon: "Star", color: "var(--purple)", description: "Growth, development, and pediatric conditions",
    subtopics: ["Growth & Development", "Immunizations", "Respiratory Disorders", "GI & Nutrition", "Congenital Heart Defects", "Infectious Diseases", "Pain Management in Children"] },
  { id: "fundamentals", name: "Fundamentals", icon: "BookOpen", color: "var(--gold)", description: "Core nursing skills and foundational concepts",
    subtopics: ["Vital Signs & Assessment", "Infection Control", "Nutrition & Diet Therapy", "Fluid & Electrolytes", "Wound Care", "Pain Management", "Perioperative Care", "Death & Dying"] },
  { id: "mental", name: "Mental Health", icon: "Brain", color: "#8B6BB5", description: "Psychiatric nursing and therapeutic communication",
    subtopics: ["Anxiety Disorders", "Mood Disorders", "Schizophrenia & Psychosis", "Substance Use Disorders", "Therapeutic Communication", "Crisis Intervention", "Legal & Ethical Issues"] },
  { id: "safety", name: "Safety & Infection Control", icon: "Shield", color: "#B8863B", description: "Medication admin, error prevention, isolation precautions",
    subtopics: ["Standard Precautions", "Isolation Protocols", "Medication Safety", "Fall Prevention", "Restraint Use", "Error Reporting", "Surgical Safety Checklist"] },
  { id: "management", name: "Management of Care", icon: "Target", color: "#5A8E6B", description: "Delegation, prioritization, clinical judgment",
    subtopics: ["Delegation & Supervision", "Prioritization Frameworks", "ABCs & Maslow's", "Ethical Practice", "Legal Responsibilities", "Advance Directives", "Interprofessional Collaboration"] },
];
