

# NCLEXExamPrep.com — Production Build Plan

## Overview
Split your working 969-line single-file React prototype into a production-ready, multi-file TypeScript project with Tailwind CSS styling, proper routing, and Supabase-ready mock data.

---

## Phase 1: Foundation & Design System

**Custom color palette & typography**
- Configure Tailwind with nursing-friendly palette (teal #2D8B83, coral #D07040, warm cream #FBF7F3 backgrounds, warm brown #2C2420 text)
- Set up Plus Jakarta Sans (200–800 weights) via Google Fonts
- Add custom CSS animations: fadeUp, fadeIn, scaleIn, growBar, pulseRing
- Add paper-like noise texture overlay, custom scrollbar, ::selection styling

**TypeScript types**
- Define all data interfaces: Subject, Question, Choice, Testimonial, PricingPlan, UserAnswer, OnboardingData

---

## Phase 2: Mock Data Files

- `subjects.ts` — 8 NCLEX subjects with icons, colors, descriptions, and subtopics
- `questions.ts` — Diagnostic question banks (mixed + per-subject) and hero questions
- `testimonials.ts` — 6 reviews (2 TikTok, 2 Reddit, 2 Instagram) with platform metadata
- `pricing.ts` — 3 plans (Free, Pro $69, Intensive $99)

---

## Phase 3: Shared & Layout Components

- **Nav** — Logo, subject/method/pricing anchor links, "Get a Study Plan" CTA button
- **Footer** — Logo + copyright disclaimer
- **SectionHeading** — Reusable h2 + subtitle component
- **Badge** — Small pill badge (used in hero)
- **QuestionCard** — Shared NCLEX question UI with 3-section answer layout (rationale → why wrong → key takeaway)

---

## Phase 4: Homepage Sections

- **Hero** — Two-column layout: headline + stats + CTA on left; interactive question card with subject dropdown on right (pulsing green dot, instant question swap on dropdown change)
- **SubjectBrowser** — 4-column grid of expandable subject cards with lock icons on subtopics
- **ValueProps** — 3 cards: Noise Filter, Personalized Logic, The Final Goal
- **HowItWorks** — 4-step guide (diagnostic → plan → practice → 85-question finish)
- **Testimonials** — 6 platform-accurate cards (TikTok with hearts/badges, Reddit with upvotes/awards, Instagram with gradient rings/verified checkmarks)
- **Pricing** — 3-tier layout with "Most popular" badge and coral glow on Pro plan
- **FinalCTA** — "Every nurse you admire passed this exam. Your turn."

---

## Phase 5: Authentication Gate

- **LoginGate** — Centered magic link email input, shown when clicking locked subtopics; "Back to subjects" navigation

---

## Phase 6: Onboarding Flow (8 Steps)

- **OnboardingFlow** — State machine with progress bar and back navigation across all steps
- **Step 0: DiagnosticSetup** — Subject focus dropdown + "Start diagnostic" CTA
- **Step 1: DiagnosticRun** — Timed question engine (7 questions), elapsed timer, confidence tracking (optional), gradient progress bar, 3-section answer display after each answer
- **Step 2: DiagnosticResults** — Score percentage, animated category breakdown bars, strengths/gaps callouts
- **Step 3: MicroIntake** — NCLEX date picker, readiness emoji selector, daily study time toggle
- **Step 4: PlanPreview** — 3-day personalized plan cards generated from diagnostic gaps
- **Step 5: SavePlan** — Email magic link input with "Continue without saving" skip option
- **Step 6: FirstWin** — Day 1 session prompt with streak motivation
- **Step 7: ScheduleSetup** — Study days toggle (default Mon/Tue/Thu/Sat) + reminder time selector

---

## Phase 7: Routing & App Shell

- **3 routes**: `/` (homepage), `/login` (login gate), `/onboarding` (onboarding flow)
- React Router with phase-based navigation between home, login, and onboarding

---

## Custom Hooks

- `useOnboarding` — Manages onboarding step state, form data, and navigation
- `useDiagnostic` — Handles timer, answer tracking, scoring, and question cycling

---

## What's NOT Included (by design)
- No Supabase connection yet — all data stays in mock files
- No component library (MUI, Chakra) — custom Tailwind styling only
- No new features beyond what exists in the prototype
- All copy, colors, spacing, and visual decisions preserved exactly

