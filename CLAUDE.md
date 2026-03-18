# CLAUDE.md — WaniWani Admin Dashboard

## Project Overview

Internal admin dashboard for **WaniWani** (waniwani.ai), an AI distribution infrastructure company that helps businesses sell products inside AI assistants (ChatGPT, Claude, Gemini). This dashboard is used by WaniWani's team to manage customers, configure AI agents, and monitor performance analytics.

This is a showcase/MVP project. All data is mocked — no real backend. The focus is on **production-grade UI quality** and **AI-aware product thinking**.

## Tech Stack

- **Framework**: Next.js 14+ with App Router (`src/app/`)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Brand & Design System

### Colors
- Primary accent: `#6C5CE7` (purple)
- Sidebar: dark (`#0f0f23` base, slightly lighter items)
- Content area: `#f8f9fb` light gray background
- Cards: white (`#ffffff`) with subtle border (`#e5e7eb`)
- Success: `#10b981`, Warning: `#f59e0b`, Error: `#ef4444`
- Text primary: `#111827`, Text secondary: `#6b7280`

### Typography
- Font: `DM Sans` (import from Google Fonts) — clean, modern, geometric
- Page titles: 24px semibold
- Section/card titles: 16px semibold
- Body: 14px regular
- Small/muted: 12px, text-secondary color

### Logo
- Text "WaniWani" with 🐊 emoji
- Displayed in sidebar top

### Design Philosophy
- **Modern & minimal** — think Linear, Vercel, or Raycast dashboard aesthetics
- Clean whitespace, subtle shadows, crisp borders
- No visual clutter. Every element earns its place.
- Micro-interactions: subtle hover lifts on cards, smooth transitions
- Consistent spacing: `p-6` for card padding, `gap-6` for grid gaps, `p-4` for inner elements
- Rounded corners: `rounded-xl` for cards, `rounded-lg` for buttons/inputs

### Status Colors & Patterns
- Active/Live: green dot + green badge
- Testing: yellow dot + yellow badge
- Pending: gray dot + gray badge
- Onboarding: blue badge
- Churned: red badge

### Platform Colors (consistent everywhere)
- ChatGPT: `#10a37f` (green)
- Claude: `#d97706` (amber/orange)
- Gemini: `#4285f4` (blue)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard home
│   ├── customers/
│   │   ├── page.tsx        # Customers list
│   │   └── [id]/
│   │       └── page.tsx    # Customer detail
│   ├── agents/
│   │   ├── page.tsx        # Agents grid
│   │   └── [id]/
│   │       └── page.tsx    # Agent detail/config
│   ├── analytics/
│   │   └── page.tsx        # Analytics dashboard
│   └── settings/
│       └── page.tsx        # Settings (tabs)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── PageWrapper.tsx
│   ├── dashboard/
│   │   ├── KpiCards.tsx
│   │   ├── ConversationsChart.tsx
│   │   ├── PlatformDistribution.tsx
│   │   └── ActivityFeed.tsx
│   ├── customers/
│   │   ├── CustomerTable.tsx
│   │   ├── CustomerDetail.tsx
│   │   └── AddCustomerModal.tsx
│   ├── agents/
│   │   ├── AgentCard.tsx
│   │   ├── AgentConfig.tsx
│   │   └── CreateAgentModal.tsx
│   ├── analytics/
│   │   ├── FunnelChart.tsx
│   │   ├── PlatformComparison.tsx
│   │   ├── TopCustomers.tsx
│   │   ├── BrandVisibility.tsx
│   │   └── QualityMetrics.tsx
│   └── shared/
│       ├── StatCard.tsx
│       ├── ChartCard.tsx
│       ├── StatusBadge.tsx
│       ├── PlatformBadge.tsx
│       ├── EmptyState.tsx
│       └── SkeletonLoader.tsx
├── data/
│   └── mock.ts            # All mock data
├── lib/
│   ├── utils.ts           # Helpers (formatNumber, formatDate, cn)
│   └── constants.ts       # Platform colors, status maps, etc.
└── types/
    └── index.ts           # TypeScript interfaces
```

## Coding Conventions

- Use `"use client"` only on components that need interactivity (useState, useEffect, event handlers)
- Prefer server components where possible
- Use `cn()` utility (from shadcn) for conditional classnames
- Extract reusable components aggressively — no component over 200 lines
- Name components with PascalCase, files match component name
- Use barrel exports only if they improve clarity
- Format numbers with `Intl.NumberFormat` or a `formatNumber` helper
- Relative timestamps with a `timeAgo` helper (e.g., "2 hours ago")
- All mock data lives in `src/data/mock.ts` — components import from there
- Types/interfaces in `src/types/index.ts`

## Key Domain Concepts

- **Customer**: A company using WaniWani's platform (e.g., an insurer like Tuio)
- **Agent**: An AI-powered conversational experience deployed on a platform for a customer
- **Platform**: An AI assistant where agents are deployed (ChatGPT, Claude, Gemini)
- **Model**: The LLM powering an agent (gpt-4o, claude-sonnet-4, gemini-pro)
- **Synthetic Buyer**: Automated AI personas that test how AI platforms recommend a customer's brand
- **Visibility Score**: 0-100 metric from synthetic buyer audits — how often AI recommends a brand
- **Funnel**: Conversations → Quotes Generated → Conversions

## Git Conventions

- Use gitmoji for commits
- Commit after each logical unit of work
- Branch naming: `feat/sprint-N-description`

## Important Notes

- This is a **frontend-only** project — all data is mocked
- Forms don't persist — wire up state properly but no API calls
- Focus on **visual polish** and **realistic product UX**
- Every page should feel like it belongs in a real SaaS product
- No placeholder text — all content should be realistic and contextual
