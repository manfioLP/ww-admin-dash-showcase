# WaniWani Admin Dashboard

Internal admin dashboard for [WaniWani](https://waniwani.ai) — an AI distribution infrastructure company that helps businesses sell products inside AI assistants (ChatGPT, Claude, Gemini).

This dashboard is used by WaniWani's team to manage customers, configure AI agents, and monitor performance analytics.

> **Showcase project** — all data is mocked. Focus is on production-grade UI quality and AI-aware product thinking.

---

## Screenshot

```
┌─────────────────────────────────────────────────────────┐
│  🐊 WaniWani   │  Dashboard                             │
│                │                                         │
│  Dashboard     │  Welcome back            Mar 18, 2026  │
│  Customers     │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  Agents        │  │ 10   │ │ 14   │ │175K  │ │ 5.2% │ │
│  Analytics     │  │Custs │ │Agnts │ │Convs │ │Conv  │ │
│  Settings      │  └──────┘ └──────┘ └──────┘ └──────┘ │
│                │                                         │
│  WaniWani©2026 │  [Conversations Chart]  [Platform Dist]│
│  v1.0.0        │                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | DM Sans (Google Fonts) |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## Features

- **Dashboard** — KPI cards, 30-day conversation trends, platform distribution, activity feed
- **Customers** — searchable/filterable table, customer detail with Overview / Agents / Analytics tabs
- **Agents** — responsive card grid with filters, agent configuration (model selector, temperature slider, system prompt, product catalog, deploy/pause toggle)
- **Analytics** — animated conversion funnel, platform comparison chart (grouped bars, metric toggle), top customers table, AI Brand Visibility heatmap (synthetic buyer audit scores), conversation quality metrics
- **Settings** — General, API Keys, Team, Billing tabs with full interactivity

---

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment & API Modes

The dashboard supports two modes for AI-powered features (Agent Playground, Brand Monitor):

| Mode | Behaviour |
|---|---|
| **Mock** (default) | Simulated responses, no API key needed, fully offline |
| **Real** | Live Anthropic API calls via a server-side proxy |

### Quick start (mock mode — no setup needed)

```bash
pnpm dev   # just works, indicator shows "Mock Mode"
```

### Enable live API

Create `.env.local` (gitignored):

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
NEXT_PUBLIC_API_MODE=real
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Restart the dev server — the top-bar indicator will switch to **Live API**.

### Fallback behaviour

The app **never crashes** due to a missing or invalid API key:
- `NEXT_PUBLIC_API_MODE=mock` → always mock
- `NEXT_PUBLIC_API_MODE=real` but no key → silently falls back to mock
- Real API call fails → silently falls back to mock

### API routes

| Route | Purpose |
|---|---|
| `POST /api/chat` | Proxy to Anthropic `/v1/messages` |
| `POST /api/chat/generate` | Structured JSON generation with retry |
| `POST /api/playground` | Agent Playground chat + conversation analysis |
| `POST /api/monitor` | Brand Monitor query generation + analysis |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (DM Sans, LayoutShell)
│   ├── page.tsx                # Dashboard home
│   ├── customers/
│   │   ├── page.tsx            # Customers list
│   │   └── [id]/page.tsx       # Customer detail
│   ├── agents/
│   │   ├── page.tsx            # Agents grid
│   │   └── [id]/page.tsx       # Agent detail / config
│   ├── analytics/
│   │   └── page.tsx            # Analytics dashboard
│   └── settings/
│       └── page.tsx            # Settings (4 tabs)
│
├── components/
│   ├── layout/
│   │   └── LayoutShell.tsx     # Client shell: sidebar + mobile header
│   ├── sidebar.tsx             # Dark sidebar, active route, mobile drawer
│   ├── dashboard/              # KPI cards, charts, activity feed
│   ├── customers/              # CustomerTable, Detail, AddCustomerModal
│   ├── agents/                 # AgentCard, Detail, config sub-components
│   ├── analytics/              # FunnelChart, PlatformComparison, BrandVisibility…
│   ├── settings/               # GeneralTab, ApiKeysTab, TeamTab, BillingTab
│   ├── shared/
│   │   ├── EmptyState.tsx      # Reusable empty state with optional CTA
│   │   └── Skeleton.tsx        # Loading skeleton primitives (card, table, chart)
│   └── ui/                     # shadcn primitives: Card, Badge, Button
│
├── data/
│   └── mock.ts                 # All mock data: customers, agents, scores, activity
│
└── lib/
    └── utils.ts                # cn() Tailwind merge helper
```

---

## Design System

| Token | Value |
|---|---|
| Primary accent | `#6C5CE7` (purple) |
| Sidebar bg | `#0f0f1a` |
| Page bg | `#f8f9fa` |
| Card bg | `#ffffff` |
| Success | `#10b981` |
| Warning | `#f59e0b` |
| Error | `#ef4444` |
| ChatGPT | `#10a37f` |
| Claude | `#d97706` |
| Gemini | `#4285f4` |

---

## Key Concepts

- **Synthetic Buyer** — AI persona deployed by WaniWani to audit how often a brand gets recommended by ChatGPT / Claude / Gemini. The Brand Visibility score (0–100) is the core WaniWani product insight.
- **Funnel** — Conversations → Quotes Generated → Conversions
- **Agent** — An LLM-powered experience configured for a customer, deployed on a target AI platform
- **Visibility Score** — 0–100 metric from synthetic buyer audits showing how often an AI recommends a brand
