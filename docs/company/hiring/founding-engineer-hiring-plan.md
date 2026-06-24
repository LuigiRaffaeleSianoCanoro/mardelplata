# Founding Engineer Hiring Plan (Delegated CTO Execution)

**Parent issue:** MAR-1 - Hire your first engineer and create a hiring plan  
**Delegation context:** CEO -> CTO (execution artifact)  
**Document owner:** CTO  
**Status:** Ready for execution  
**Last updated:** 2026-06-22

---

## 1) Hiring objective and role scope

### Role title
Founding Engineer (Full-Stack, Product + Platform)

### Mission
Ship the first 6-12 months of the Nomad & IT Hub roadmap with startup-level speed while building a maintainable technical foundation (Next.js + Supabase + SEO-ready architecture) that can support future team growth.

### Scope of ownership

| Area | In scope for founding engineer | Out of scope (for now) |
|---|---|---|
| Product delivery | End-to-end implementation of roadmap slices from spec -> production | Owning final product strategy decisions without CTO sign-off |
| Architecture | Maintainable full-stack architecture, DB schema hygiene, migration discipline, observability basics | Re-platforming core stack away from Next.js/Supabase |
| Quality | Test strategy for critical paths, CI hygiene, regression prevention, perf guardrails | Building a dedicated QA org/process |
| Collaboration | Work directly with CTO, collaborate with UXDesigner and CMO on implementation details | Managing people (no direct reports initially) |
| Security and reliability | RLS-safe data access patterns, secure defaults, production readiness | Formal security certification/compliance programs |

### Role success profile (first year)
1. Consistently ships roadmap milestones with predictable throughput.
2. Improves velocity over time (better component reuse, fewer regressions, smaller PR cycles).
3. Leaves the codebase easier to extend than they found it.
4. Operates as a force multiplier for CTO decision-making.

---

## 2) Candidate scorecard

Scoring scale per competency: **1 = below bar, 2 = mixed, 3 = strong, 4 = exceptional**.  
Hiring recommendation threshold: **>= 3.0 weighted score** and no critical red flags in collaboration/ownership.

| Competency | Weight | What "strong" looks like (score 3) | Evidence signals | Red flags |
|---|---:|---|---|---|
| Product-minded execution | 20% | Breaks ambiguous goals into deliverable slices with clear tradeoffs | Concrete examples of shipping under ambiguity, roadmap slicing | Over-indexes on perfection, weak prioritization |
| Full-stack technical depth (Next.js/Supabase/TypeScript) | 20% | Can design and implement production-quality app + data changes safely | Prior work with App Router, API/data modeling, SQL/RLS fundamentals | Only frontend or only backend depth |
| System design and architecture judgment | 15% | Chooses pragmatic architecture for current stage, avoids over-engineering | Can explain alternatives and why one is right now | Dogmatic decisions without constraints awareness |
| Quality and reliability ownership | 15% | Builds with testing, monitoring, and rollback awareness | Mentions CI, test pyramids, migration safety, incident handling | "Test later" mindset, no production ownership |
| Collaboration and communication | 15% | Proactive updates, async clarity, constructive collaboration with design/marketing | Examples of cross-functional shipping | Defensiveness, poor written communication |
| Founder mentality and accountability | 15% | Treats company outcomes as own, handles messy problems without hand-holding | Takes initiative, closes loops, learns fast | Waits for detailed instructions, low ownership |

### Must-have gate criteria
- Demonstrated ability to ship production features in a fast-moving startup context.
- Practical TypeScript + SQL competence (including safe schema evolution habits).
- Strong written communication for async execution.
- High ownership and low-ego collaboration style.

### Nice-to-have differentiators
- SEO implementation experience (metadata, JSON-LD, technical SEO for content products).
- Experience with marketplace/community products.
- Prior early-stage (0->1 or 1->10) startup execution.

---

## 3) Interview loop design

Target time-to-decision: **14 calendar days** from first conversation to offer decision.

| Stage | Format | Interviewers | Focus | Exit criteria |
|---|---|---|---|---|
| 0. Intake and profile fit | Resume + portfolio screen | CTO | Baseline fit, relevant stack and stage experience | Meets must-have baseline |
| 1. Intro call | 30 min video | CTO | Motivation, communication, role expectations | Clear interest + communication bar met |
| 2. Technical deep dive | 75 min live | CTO | Architecture, debugging, delivery decisions from past work | Demonstrates practical full-stack depth |
| 3. Work sample (paid if non-trivial) | 3-5 hour async exercise + write-up | Candidate, reviewed by CTO (+ UXDesigner optional review) | Roadmap slicing, code quality, product judgment, documentation quality | Submission is production-minded and coherent |
| 4. Pairing session | 60 min live pairing on scoped task | CTO | Collaboration style, iteration speed, response to feedback | Positive collaboration + technical bar |
| 5. Cross-functional loop | 45 min each | UXDesigner + CMO | Working with design and growth/SEO/content constraints | No major collaboration concerns |
| 6. Founder-fit final | 30 min | CEO + CTO | Mission alignment, ownership, long-term fit | Unanimous "yes" from CEO + CTO |
| 7. References | 2 calls | CTO | Reliability, ownership, communication pattern validation | No critical concerns |

### Interview packet guidelines
- Every interviewer submits scorecard notes within 24h.
- Use evidence-based notes ("candidate did X"), not vibe-only judgments.
- Debrief runs once all notes are submitted; no premature group biasing.

---

## 4) Technical sourcing channels and funnel strategy

### Channel mix (technical-first)

| Channel | Tactic | Weekly target | Owner |
|---|---|---:|---|
| Founder/CTO outbound on GitHub/LinkedIn | Source engineers with visible OSS/startup shipping history | 20 targeted outreaches | CTO |
| Local and regional tech communities | ATICMA network, engineering communities, meetup speakers | 5 warm intros | CTO |
| Specialized startup talent networks | Curated pools for early-stage engineers | 10 profiles reviewed | CTO |
| Inbound job post (quality-focused) | Public role page with realistic scope + stack + ownership expectations | 5-10 applicants/week | CTO + CMO |
| Referral loop | Ask trusted founders/operators for high-signal referrals | 3 referral asks/week | CEO + CTO |

### Candidate profile targeting filters
- Built and shipped product features, not only platform/internal tooling.
- Comfortable owning frontend + backend + data layers in one sprint.
- Works well in async and documents decisions clearly.
- Prefers startup ambiguity and high ownership over narrow role boundaries.

### Funnel health metrics
- Response rate to outbound >= 20%.
- Screen-to-onsite (stage 2+) >= 35%.
- Onsite-to-offer >= 25%.
- Offer acceptance >= 70%.
- Time-to-fill target: <= 8 weeks.

---

## 5) Compensation band strategy guidance (non-legal)

> This is strategic guidance, not legal/tax advice. Final offers must be validated with legal/payroll/accounting in the relevant jurisdiction.

### Philosophy
1. Pay for impact and ownership, not just years of experience.
2. Keep cash competitive enough for focus and retention.
3. Use meaningful equity to align with founding-stage risk and upside.
4. Keep banding explicit to avoid ad-hoc negotiation drift.

### Suggested offer bands (guidance)

| Candidate profile | Annual cash (USD gross equivalent) | Equity guidance (fully diluted) | Notes |
|---|---:|---:|---|
| Strong local/regional founding engineer | 45,000-70,000 | 0.50%-1.20% | Typical first-hire bracket in LATAM-weighted context |
| Exceptional proven startup shipper | 70,000-95,000 | 0.80%-1.80% | Higher bar, likely faster roadmap de-risking |
| Global high-signal candidate | 95,000-130,000 | 0.50%-1.20% | May require remote-premium cash with tighter equity range |

### Offer construction guidance
- Prefer **clear bands + rationale** instead of open-ended negotiation.
- Include milestone-based compensation review at month 6.
- Document vesting, cliff, and acceleration terms in formal legal docs before signing.
- Align title/scope/equity narrative to avoid mismatch expectations.

---

## 6) 30/60/90 day onboarding outcomes

### Day 0 readiness (before start date)
- Access provisioned: repo, environments, Supabase, analytics, incident channels.
- Technical onboarding brief: architecture, roadmap, release process, definition of done.
- First two sprint goals pre-scoped by CTO.

### 30/60/90 outcomes

| Window | Expected outcomes | Evidence of success |
|---|---|---|
| Day 1-30 | Understand architecture and delivery process; ship at least 1 production task from prioritized backlog; participate in code review rhythm | 1 merged production PR in core roadmap, clear technical notes, positive collaboration feedback |
| Day 31-60 | Own a full roadmap slice end-to-end (spec refinement -> implementation -> QA -> release); reduce CTO implementation bottlenecks | 1-2 roadmap slices shipped with tests/docs and stable rollout |
| Day 61-90 | Operate as autonomous execution owner for sprint planning and technical delivery; propose and implement at least one velocity/reliability improvement | Predictable sprint throughput, fewer regressions, one approved engineering improvement in production |

---

## 7) Acceptance criteria for "hire complete"

Hire is considered complete only when all criteria below are satisfied:

1. **Role and scorecard finalized** and approved by CEO + CTO.
2. **Interview loop executed** with evidence-based notes across all required stages.
3. **Reference checks completed** with no unresolved critical concerns.
4. **Offer accepted and signed** (including legal employment/contracting docs).
5. **Compensation/equity package documented** in signed formal agreements.
6. **Start date confirmed** and onboarding plan scheduled.
7. **Day-0 access plan prepared** (tools, repos, environments, communication channels).
8. **90-day outcomes agreed** by CTO and new hire before week 1 ends.

---

## 8) Execution cadence and decision rights

| Cadence | Owner | Output |
|---|---|---|
| Weekly hiring sync | CTO + CEO | Funnel metrics, stage progression, blockers, decision log |
| Interview debrief per finalist | CTO-led panel | Hire/no-hire decision with documented rationale |
| Offer approval checkpoint | CEO + CTO | Final compensation and scope sign-off |
| Onboarding checkpoint (30/60/90) | CTO | Outcome tracking and support actions |

### Decision rights
- **CTO**: owns role spec, scorecard operation, technical bar, and hiring recommendation.
- **CEO**: final approval for compensation and final hire decision.
- **CMO + UXDesigner**: veto only on critical cross-functional collaboration concerns.

