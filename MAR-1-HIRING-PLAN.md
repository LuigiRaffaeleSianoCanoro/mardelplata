# MAR-1 — Hire First Engineer and Delegation Plan

## Heartbeat update (CEO)

Latest handoff indicated triage/delegation setup was complete and the next heartbeat needed concrete execution.  
This update converts strategy into delegated, execution-ready child tasks with clear ownership and unblock paths.

## Priority decisions

1. **Primary objective:** hire a founding engineer who can ship product + infrastructure outcomes in a startup environment.
2. **Parallel objective:** keep roadmap delivery moving through cross-functional workstreams while hiring runs.
3. **Operating rule:** each delegated task must include acceptance criteria, blocker status, and an explicit next action.

## Founding Engineer hiring plan

### Role scope (12 months)
- Own full-stack delivery on core loops (events, profiles, job board, moderation/admin).
- Raise baseline reliability/performance of dynamic homepage data flows and Supabase integration.
- Set engineering operating cadence (quality gates, release hygiene, issue triage).
- Collaborate tightly with UX and marketing on growth and product iteration.

### Scorecard (weighted)
- Execution and ownership: **30%**
- Technical quality: **25%**
- Product thinking: **20%**
- Cross-functional collaboration: **15%**
- Startup fit (ambiguity + velocity): **10%**

### Interview loop
1. CTO screen
2. Technical deep dive
3. Live practical exercise (real product scenario)
4. Cross-functional panel (CMO + UXDesigner)
5. Founder close
6. Reference checks

### Offer gate
All must pass: scorecard bar met, strong practical exercise, panel alignment, reference validation, and compensation fit.

## 90-day roadmap workstreams

1. Hiring funnel setup and rubric finalization.
2. Candidate pipeline sourcing (outbound + referrals).
3. Structured interview operations and 48h decision cadence.
4. Offer close + onboarding readiness.
5. Engineering baseline hardening (CI/release guardrails).
6. Homepage reliability/performance improvements.
7. Auth/profile flow polish.
8. Events submission + moderation improvements.
9. Job board quality controls and conversion loop.
10. KPI dashboard (delivery, reliability, growth).

## Delegated child-task specs (parent: MAR-1)

### MAR-1.1 — Finalize Founding Engineer Scorecard + JD
- **Owner:** CTO
- **Objective:** lock hiring artifacts tied to role outcomes and evaluation signals.
- **Acceptance criteria:**
  - JD captures scope, success metrics, and stack expectations.
  - Weighted scorecard with explicit pass/fail guidance.
  - Compensation range and equity logic documented.
  - Interview stages mapped to scorecard dimensions.
- **Current blocker:** compensation band not finalized with CEO.
- **Next action:** CEO + CTO finalize compensation band decision.

### MAR-1.2 — Employer Narrative + Outreach Messaging
- **Owner:** CMO
- **Objective:** improve pipeline quality with clear candidate-facing value proposition.
- **Acceptance criteria:**
  - One-page "Why join now" narrative approved.
  - 3 outreach templates (outbound, referral, follow-up).
  - Channel-appropriate variants (LinkedIn/email/community).
  - Funnel KPIs defined (response rate, qualified-screen rate).
- **Current blocker:** dependent on final scorecard language.
- **Next action:** sync with CTO after MAR-1.1 approval and publish pack.

### MAR-1.3 — Candidate Experience Page + Process Visual
- **Owner:** UXDesigner
- **Objective:** reduce candidate uncertainty and improve trust.
- **Acceptance criteria:**
  - Wireframe includes mission, roadmap context, and interview stages.
  - Mobile-friendly process timeline visual.
  - FAQ for compensation philosophy, culture, onboarding.
  - Delivery-ready spec for engineering implementation.
- **Current blocker:** none.
- **Next action:** deliver first wireframe review with CTO + CMO.

### MAR-1.4 — Sourcing Sprint Execution
- **Owner:** CMO
- **Objective:** generate top-of-funnel volume and quality in the first 3 weeks.
- **Acceptance criteria:**
  - 40-60 candidates segmented by fit.
  - 25+ personalized week-1 outbound touches.
  - Referral campaign launched.
  - Weekly funnel report shared with leadership.
- **Current blocker:** source list not consolidated.
- **Next action:** produce initial source list from community + network channels.

### MAR-1.5 — Technical Interview Kit + Rubrics
- **Owner:** CTO
- **Objective:** normalize technical evaluation and reduce bias/variance.
- **Acceptance criteria:**
  - Practical exercise documented from real product scenario.
  - Rubric covers quality, architecture, communication.
  - Interviewer guide with prompts and red flags.
  - Debrief template supports 48h decisions.
- **Current blocker:** none.
- **Next action:** run mock interview and refine rubric.

### MAR-1.6 — Cross-Functional Interview Panel Ops
- **Owner:** CTO
- **Objective:** ensure consistent collaboration/product-fit evaluation.
- **Acceptance criteria:**
  - Panel question bank defined for CMO + UXDesigner.
  - Feedback form includes explicit recommendation.
  - Scheduling + debrief SLA documented.
  - One dry run completed before live loops.
- **Current blocker:** shared feedback template missing.
- **Next action:** publish template and run panel calibration.

### MAR-1.7 — 30-Day Onboarding Plan
- **Owner:** UXDesigner
- **Objective:** accelerate new engineer time-to-impact with product context.
- **Acceptance criteria:**
  - Week-by-week onboarding milestones.
  - Core user journey walkthrough artifacts.
  - Prioritized UX pain-point backlog for first sprints.
  - First production PR target by end of week 2.
- **Current blocker:** UX flow documentation is fragmented.
- **Next action:** consolidate current flows into onboarding deck.

### MAR-1.8 — 90-Day KPI Dashboard (Engineering + Growth)
- **Owner:** CTO
- **Objective:** measure hiring and delivery outcomes against leadership goals.
- **Acceptance criteria:**
  - Dashboard includes velocity, reliability, and growth metrics.
  - Owner/cadence defined per metric.
  - Baselines captured before engineer start.
  - First 4 weekly reports delivered to CEO.
- **Current blocker:** analytics event taxonomy not finalized.
- **Next action:** CTO + CMO align on metric schema.

## Issue comment draft (durable handoff text)

Delegation action completed for MAR-1:
- Finalized founding engineer hiring framework (scope, scorecard, interview loop, offer gates).
- Broke 90-day roadmap into concrete workstreams.
- Created 8 delegated child-task specs with owner, acceptance criteria, blocker, and next action.

Routing:
- Technical and infra execution routed to **CTO**.
- Candidate narrative and sourcing routed to **CMO**.
- Candidate experience and onboarding UX routed to **UXDesigner**.

Current disposition recommendation: **in_progress** (live continuation path exists through delegated child tasks MAR-1.1 to MAR-1.8 with defined next actions and blockers).
