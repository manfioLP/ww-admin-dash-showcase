# MEMORY.md — WaniWani Admin Dashboard

## What Is This File?

This file tracks project progress, decisions, and context across coding sessions. Update it after completing each sprint or making significant decisions.

---

## Project Context

**Goal**: Build a showcase MVP admin dashboard for WaniWani (waniwani.ai) to demonstrate fullstack + AI integration skills. The dashboard manages WaniWani's customers, their AI agents deployed across platforms, and performance analytics.

**Who is WaniWani?**: AI distribution infrastructure company. They help businesses (starting with insurance) sell products inside AI assistants. Two main offerings:
1. Distribution infra — embed quoting/purchasing flows inside ChatGPT, Claude, Gemini
2. AI brand intelligence — synthetic buyers audit how AI platforms recommend (or don't) a brand

**Key people**: Raphael Vullierme (co-founder), previously ran an insurer for ~10 years.

**First customer**: Tuio (Spanish digital insurer) — first insurance app approved by OpenAI on ChatGPT (Feb 2026).

---

## Sprint Tracker

### Sprint 0+1: Scaffolding + Dashboard Home
- **Status**: NOT STARTED
- **Scope**: Project setup, layout shell, sidebar, mock data, dashboard home page (KPIs, charts, activity feed)
- **Key files**: `layout.tsx`, `page.tsx`, `data/mock.ts`, `types/index.ts`, `lib/utils.ts`, sidebar + dashboard components
- **Notes**: —

### Sprint 2: Customers
- **Status**: NOT STARTED
- **Scope**: Customers list (table + search/filter), customer detail page (overview/agents/analytics tabs), add customer modal
- **Key files**: `app/customers/`, `components/customers/`
- **Notes**: —

### Sprint 3: Agents
- **Status**: NOT STARTED
- **Scope**: Agents grid (card view), agent detail page (config panel + performance), create agent modal
- **Key files**: `app/agents/`, `components/agents/`
- **Notes**: —

### Sprint 4: Analytics
- **Status**: NOT STARTED
- **Scope**: Funnel visualization, platform comparison, top customers, synthetic buyer visibility heatmap, quality metrics
- **Key files**: `app/analytics/`, `components/analytics/`
- **Notes**: —

### Sprint 5: Settings + Polish
- **Status**: NOT STARTED
- **Scope**: Settings page (general/API keys/team/billing tabs), responsive sidebar, empty states, skeleton loaders, micro-interactions, README
- **Key files**: `app/settings/`, shared components polish
- **Notes**: —

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| — | Next.js App Router + shadcn/ui + Tailwind | Modern stack, easy Vercel deploy, great component library |
| — | DM Sans font | Clean geometric sans that's not overused (avoiding Inter) |
| — | Card grid for agents, table for customers | Agents have more visual config info (model, platform, status), cards work better. Customers are more data-dense, table is better. |
| — | Mock data only, no backend | Showcase project — focus on UI/UX quality |
| — | Purple (#6C5CE7) as primary accent | Aligns with a modern SaaS feel, distinct enough to own |

---

## Known Issues / Tech Debt

- (none yet)

---

## Mock Data Reference

### Customers (8-10)
Tuio, Insurify, CoverBot, SafeNest, PolicyPal, ShieldAI, QuotaFin, RiskLens, NexaCover

### Verticals
Insurance, Fintech, Travel, Health

### Platforms
ChatGPT, Claude, Gemini

### Models
gpt-4o, claude-sonnet-4, gemini-pro

---

## How To Update This File

After each sprint:
1. Update the sprint status (NOT STARTED → IN PROGRESS → COMPLETE)
2. Add any notes about what was built, deviations from plan, or blockers
3. Log any new decisions in the Decisions Log
4. Add any new tech debt or known issues
