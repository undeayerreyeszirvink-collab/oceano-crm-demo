# WowHome POC Design

**Date:** 2026-03-29
**Status:** Approved
**Timeline:** 8 weeks (1-2 months)

---

## Executive Summary

WowHome is an AI-native home renovation operating system for China's residential market. Unlike vertically integrated "Apple-style" players (e.g., Habitat), WowHome aims to be the "Android" of home renovation: an open platform that standardizes the renovation journey into modular nodes, orchestrated by AI with human-in-the-loop (HITL) execution.

The POC focuses on the "理" (Understand) phase, validating the core hypothesis: **AI-powered conversational need discovery can generate artifacts that enable junior designers to deliver senior-level work**.

---

## Context

### Industry Pain Points

1. **Design is an information island** — Lack of standardization at the design stage causes downstream chaos
2. **High customer acquisition cost** — Content-driven acquisition needed to break cost structure
3. **Uncontrollable service quality** — No platform-level monitoring of node-level delivery

### Competitive Positioning

| Dimension | Habitat (Apple) | WowHome (Android) |
|-----------|-----------------|-------------------|
| Control | Self-operated, closed | Platform orchestration, open |
| Participants | Only Habitat | Designers, contractors, suppliers can join |
| Product | Standardized package | Standardized nodes, flexible combination |
| Pricing | Unified pricing | Transparent, market competition |
| Scalability | Slow (self-built) | Fast (network effects) |
| Asset Model | Heavy | Light |

### Differentiation vs. Existing Platforms (Tubatu, Qijia)

| Dimension | Tubatu/Qijia | WowHome |
|-----------|--------------|---------|
| Model | Lead matching | Full-process standardization |
| Quality Control | None | AI + HITL monitoring per node |
| Collaboration | Participants compete | ACN-style collaboration network |
| Essence | Information platform | Operating system |

---

## Target Users

- **Primary:** C-end homeowners (mid-to-high-end)
- **Geography:** Tier-1, New Tier-1 cities + Overseas Chinese
- **Acquisition:** Content/community-driven

---

## Business Model

- **Transaction commission:** Percentage from materials and labor
- **Node service fee:** Fee per completed node (ACN-style)

---

## POC Scope

### What We're Building

Minimum closed loop: User conversation → Artifacts → Designer uses → Design output

### What We're NOT Building (POC)

- Auto-matching algorithm (manual assignment)
- Payment/settlement system (offline)
- Multi-role permissions (simple separation)
- Designer design upload (offline delivery)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        WowHome POC                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   User Side  │    │   Platform   │    │ Designer Side│  │
│  │              │    │              │    │              │  │
│  │   AI Bot    │───▶│  Artifact    │───▶│  Workbench   │  │
│  │  (Dialog)   │    │   Engine     │    │ (View+Feedback)│ │
│  │              │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Data Layer                        │   │
│  │  Conversations │ Artifacts │ Feedback │ Projects     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Designs

### 1. Bot Conversation System

**Approach:** Natural conversation, not structured questionnaire

**Technical Foundation:**
- LLM (Claude/GPT-4) with custom system prompt
- Conversation memory and context tracking
- Topic coverage tracking
- Convergence detection

**Note:** Conversation logic based on team's existing methodology. Tech side provides LLM integration, storage, and topic tracking infrastructure. Specific conversation strategy defined by business side.

**Target:** 20-40 minute deep conversation, 30-60 message turns

---

### 2. Artifact System

#### Two-Layer Artifacts

**Layer 1: User-Facing (Warm, Emotional)**

| Artifact | Content | Emotional Value |
|----------|---------|-----------------|
| Family Story Report | Who this family is, how they live | "I feel understood" |
| Future Home Scenarios | Ideal life scenes - morning, weekend, guests | "I can see my future" |
| Preference Map | Likes, dislikes, priorities, indifferences | "I know myself better" |

**Layer 2: Designer-Facing (Actionable)**

| Artifact | Content | Design Value |
|----------|---------|--------------|
| Design Brief | Core needs, priorities, must-have vs nice-to-have | Direction clarity |
| Space Requirements | Per-space functions, scenarios, special needs | No missed requirements |
| Style Anchors | Keywords, references, colors, materials, avoid-list | Aesthetic direction |
| Budget Framework | Total, allocation, flexibility, value priorities | Quotation basis |

**Note:** Artifact structure is initial framework. Will be adjusted based on team's methodology.

**Generation Flow:**
1. Conversation ends
2. AI analyzes and extracts
3. Generate Layer 1 (user preview/confirm)
4. User confirms/supplements
5. Generate Layer 2 (translate to design language)
6. Deliver to designer

---

### 3. Designer Workbench

**POC Scope (Minimal):**

| Page | Function |
|------|----------|
| Project List | View assigned projects, status |
| Artifact Viewer | Read all artifacts |
| Feedback Form | Rate usefulness, note missing info, corrections |

**Not in POC:**
- Design upload
- Direct user communication
- Auto-dispatch
- Settlement

---

## Closed Loop Flow

```
User Side              Platform              Designer Side
─────────              ────────              ─────────────

1. Content channel → Enter
2. Start Bot conversation (20-40 min)
3. ← Generate artifacts (user version)
4. User confirms/supplements →
5.                    Generate artifacts (designer version) →
6.                    Manual designer assignment →
7.                                          View artifacts
8.                                          Create design (offline)
9.                    ← Submit feedback
10. ← Receive design (offline delivery)
11. User satisfaction feedback →
```

---

## Technical Implementation

### Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js + React | Fast dev, SSR, unified codebase |
| Backend | Next.js API Routes | Unified stack, sufficient for POC |
| Database | PostgreSQL (Supabase) | Managed, includes Auth |
| LLM | Claude API | Long context, strong conversation |
| Deployment | Vercel | Seamless Next.js integration |
| Storage | Supabase Storage | Artifacts, PDFs, images |

### Data Model

```
User ◀──▶ Project ◀──▶ Designer
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
Conversation  Artifact  Feedback
```

### Development Estimate

| Module | Effort | Priority |
|--------|--------|----------|
| Bot conversation UI | 3-5 days | P0 |
| Conversation engine (LLM) | 5-7 days | P0 |
| Artifact generation | 5-7 days | P0 |
| Designer workbench | 3-5 days | P1 |
| User confirmation page | 2-3 days | P1 |
| Feedback collection | 2-3 days | P2 |
| Admin panel (simple) | 3-5 days | P2 |

**Total:** ~4-6 weeks (1-2 full-time developers)

---

## Execution Plan

### Timeline (8 Weeks)

| Phase | Week | Focus | Deliverable |
|-------|------|-------|-------------|
| Foundation | 1-2 | Tech setup | Architecture, data model, LLM integration |
| Core Build | 3-4 | Features | Bot, artifacts, workbench |
| Validation | 5-6 | Closed loop | First case end-to-end |
| Scale | 7-8 | Cases | 3 cases + data report |

### Milestones

| Time | Milestone | Deliverable |
|------|-----------|-------------|
| Week 2 | M1: Tech Ready | Architecture complete, LLM dialog working |
| Week 4 | M2: Feature Ready | Bot + Artifacts + Workbench usable |
| Week 6 | M3: Loop Validated | First case completed |
| Week 8 | M4: POC Complete | 3 cases + data report |

---

## Success Criteria

| Hypothesis | Validation | Target |
|------------|------------|--------|
| Users willing to deep-chat with Bot | Completion rate | ≥80% |
| AI can generate valuable artifacts | Designer rating | ≥4/5 |
| Artifacts improve design efficiency | Designer feedback | ≥50% time reduction |
| Users satisfied with artifacts | User rating | ≥4/5 |
| Model is replicable | 3 case consistency | Stable, repeatable |

---

## Post-POC: Fundraising Materials

| Material | Content |
|----------|---------|
| Product Demo | Working Bot + Workbench |
| Case Studies | 3 real user cases with before/after |
| Data Report | Efficiency gains, satisfaction, cost comparison |
| Business Plan | Market size, model, roadmap, funding ask |

---

## Open Items

1. **Conversation methodology:** To be integrated with team's existing approach
2. **Artifact structure:** Initial framework, adjust based on methodology
3. **Designer recruitment:** Need 3-5 designers for POC
4. **User recruitment:** Need 10-20 users for testing, 3 for full cases

---

## Appendix: Four-Stage Model (Future)

The full WowHome vision includes 24 nodes across 4 stages:

- **理 (Understand):** Intake, profile, survey, constraints, budget, brief freeze — *POC focuses here*
- **解 (Solve):** Concept, layout, systems, materials, tradeoffs, approval
- **转 (Translate):** BOQ, work packages, matching, quotes, schedule, contracts
- **交 (Deliver):** Kickoff, progress, changes, inspection, settlement, warranty

POC validates "理" stage. Success unlocks subsequent stages.

---

*Document created: 2026-03-29*
*Last updated: 2026-03-29*
