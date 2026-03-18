export type Customer = {
  id: string;
  name: string;
  logo: string;
  vertical: "insurance" | "fintech" | "travel" | "health";
  contractStatus: "active" | "pilot" | "onboarding" | "churned";
  platforms: ("chatgpt" | "claude" | "gemini")[];
  totalConversations: number;
  conversions: number;
  conversionRate: number;
  partnerSince: string;
  accountOwner: string;
  notes: string;
};

export type Agent = {
  id: string;
  customerId: string;
  name: string;
  model: "gpt-4o" | "claude-sonnet" | "gemini-pro";
  platform: "chatgpt" | "claude" | "gemini";
  status: "live" | "testing" | "pending_approval";
  conversations: number;
  quotes: number;
  conversions: number;
  createdAt: string;
};

export type DailyConversation = {
  date: string;
  chatgpt: number;
  claude: number;
  gemini: number;
};

export type Activity = {
  id: string;
  type:
    | "partner_onboarded"
    | "agent_deployed"
    | "conversion"
    | "agent_alert"
    | "audit_completed";
  message: string;
  timestamp: string;
  customerId: string;
};

export const customers: Customer[] = [
  {
    id: "cust_01",
    name: "Tuio",
    logo: "🏠",
    vertical: "insurance",
    contractStatus: "active",
    platforms: ["chatgpt", "claude"],
    totalConversations: 34200,
    conversions: 1890,
    conversionRate: 5.53,
    partnerSince: "2025-06-15",
    accountOwner: "Ana Costa",
    notes: "Flagship insurance partner. Expanding to pet insurance Q2. Strong NPS on Claude channel.",
  },
  {
    id: "cust_02",
    name: "Insurify",
    logo: "🛡️",
    vertical: "insurance",
    contractStatus: "active",
    platforms: ["chatgpt", "claude", "gemini"],
    totalConversations: 28750,
    conversions: 1437,
    conversionRate: 5.0,
    partnerSince: "2025-08-22",
    accountOwner: "Ana Costa",
    notes: "First partner on all 3 platforms. Gemini agent in testing — awaiting approval from their compliance team.",
  },
  {
    id: "cust_03",
    name: "CoverBot",
    logo: "🤖",
    vertical: "insurance",
    contractStatus: "active",
    platforms: ["claude", "gemini"],
    totalConversations: 19600,
    conversions: 980,
    conversionRate: 5.0,
    partnerSince: "2025-09-10",
    accountOwner: "Marcus Klein",
    notes: "API integration requires custom webhook setup. Life agent had 3 failed calls last week — Marcus investigating.",
  },
  {
    id: "cust_04",
    name: "SafeNest",
    logo: "🏡",
    vertical: "insurance",
    contractStatus: "onboarding",
    platforms: ["chatgpt"],
    totalConversations: 1200,
    conversions: 48,
    conversionRate: 4.0,
    partnerSince: "2026-02-01",
    accountOwner: "Ana Costa",
    notes: "Waiting on API credentials from their side. Agent submitted for approval. Target go-live: end of March.",
  },
  {
    id: "cust_05",
    name: "PolicyPal",
    logo: "📋",
    vertical: "insurance",
    contractStatus: "active",
    platforms: ["chatgpt", "gemini"],
    totalConversations: 15300,
    conversions: 765,
    conversionRate: 5.0,
    partnerSince: "2025-11-05",
    accountOwner: "Ana Costa",
    notes: "Considering adding Claude channel. Renewal discussion scheduled for April.",
  },
  {
    id: "cust_06",
    name: "NeoBank",
    logo: "💳",
    vertical: "fintech",
    contractStatus: "active",
    platforms: ["chatgpt", "claude", "gemini"],
    totalConversations: 42100,
    conversions: 2526,
    conversionRate: 6.0,
    partnerSince: "2025-05-20",
    accountOwner: "James Park",
    notes: "Highest-volume partner. Monthly business reviews with their CTO. Exploring WaniWani Pro tier.",
  },
  {
    id: "cust_07",
    name: "TripWise",
    logo: "✈️",
    vertical: "travel",
    contractStatus: "active",
    platforms: ["chatgpt", "claude"],
    totalConversations: 11800,
    conversions: 590,
    conversionRate: 5.0,
    partnerSince: "2025-12-12",
    accountOwner: "Sofia Chen",
    notes: "Seasonal traffic spikes in summer. Requesting dynamic prompt switching by destination region.",
  },
  {
    id: "cust_08",
    name: "MediAssist",
    logo: "🏥",
    vertical: "health",
    contractStatus: "churned",
    platforms: ["gemini"],
    totalConversations: 3400,
    conversions: 102,
    conversionRate: 3.0,
    partnerSince: "2025-07-30",
    accountOwner: "Sofia Chen",
    notes: "Churned in Feb 2026 — regulatory concerns around AI in medical contexts. Keep on watchlist for re-engagement.",
  },
  {
    id: "cust_09",
    name: "FinFlow",
    logo: "📊",
    vertical: "fintech",
    contractStatus: "active",
    platforms: ["claude", "gemini"],
    totalConversations: 18900,
    conversions: 945,
    conversionRate: 5.0,
    partnerSince: "2025-10-18",
    accountOwner: "James Park",
    notes: "Strong Claude performance. Investment product agent needs compliance review before Gemini expansion.",
  },
  {
    id: "cust_10",
    name: "VoyageAI",
    logo: "🌍",
    vertical: "travel",
    contractStatus: "onboarding",
    platforms: ["chatgpt"],
    totalConversations: 850,
    conversions: 25,
    conversionRate: 2.94,
    partnerSince: "2026-03-01",
    accountOwner: "Sofia Chen",
    notes: "Pilot partner — evaluating fit before full contract. First synthetic buyer audit scheduled for next week.",
  },
];

export const agents: Agent[] = [
  { id: "agt_01", customerId: "cust_01", name: "Tuio Home Quote", model: "gpt-4o", platform: "chatgpt", status: "live", conversations: 18400, quotes: 5520, conversions: 1012, createdAt: "2025-07-01" },
  { id: "agt_02", customerId: "cust_01", name: "Tuio Auto Advisor", model: "claude-sonnet", platform: "claude", status: "live", conversations: 15800, quotes: 4740, conversions: 878, createdAt: "2025-08-15" },
  { id: "agt_03", customerId: "cust_02", name: "Insurify Compare", model: "gpt-4o", platform: "chatgpt", status: "live", conversations: 12300, quotes: 3690, conversions: 615, createdAt: "2025-09-01" },
  { id: "agt_04", customerId: "cust_02", name: "Insurify Claude Bot", model: "claude-sonnet", platform: "claude", status: "live", conversations: 9200, quotes: 2760, conversions: 460, createdAt: "2025-09-15" },
  { id: "agt_05", customerId: "cust_02", name: "Insurify Gemini", model: "gemini-pro", platform: "gemini", status: "testing", conversations: 7250, quotes: 2175, conversions: 362, createdAt: "2025-10-01" },
  { id: "agt_06", customerId: "cust_03", name: "CoverBot Renters", model: "claude-sonnet", platform: "claude", status: "live", conversations: 11200, quotes: 3360, conversions: 560, createdAt: "2025-09-20" },
  { id: "agt_07", customerId: "cust_03", name: "CoverBot Life", model: "gemini-pro", platform: "gemini", status: "live", conversations: 8400, quotes: 2520, conversions: 420, createdAt: "2025-10-10" },
  { id: "agt_08", customerId: "cust_04", name: "SafeNest Starter", model: "gpt-4o", platform: "chatgpt", status: "pending_approval", conversations: 1200, quotes: 360, conversions: 48, createdAt: "2026-02-10" },
  { id: "agt_09", customerId: "cust_05", name: "PolicyPal Quick Quote", model: "gpt-4o", platform: "chatgpt", status: "live", conversations: 9800, quotes: 2940, conversions: 490, createdAt: "2025-11-15" },
  { id: "agt_10", customerId: "cust_05", name: "PolicyPal Gemini", model: "gemini-pro", platform: "gemini", status: "live", conversations: 5500, quotes: 1650, conversions: 275, createdAt: "2025-12-01" },
  { id: "agt_11", customerId: "cust_06", name: "NeoBank Advisor", model: "gpt-4o", platform: "chatgpt", status: "live", conversations: 18700, quotes: 5610, conversions: 1122, createdAt: "2025-06-01" },
  { id: "agt_12", customerId: "cust_06", name: "NeoBank Claude", model: "claude-sonnet", platform: "claude", status: "live", conversations: 14200, quotes: 4260, conversions: 852, createdAt: "2025-07-15" },
  { id: "agt_13", customerId: "cust_06", name: "NeoBank Gemini", model: "gemini-pro", platform: "gemini", status: "testing", conversations: 9200, quotes: 2760, conversions: 552, createdAt: "2025-08-01" },
  { id: "agt_14", customerId: "cust_07", name: "TripWise Planner", model: "gpt-4o", platform: "chatgpt", status: "live", conversations: 7100, quotes: 2130, conversions: 355, createdAt: "2025-12-20" },
  { id: "agt_15", customerId: "cust_07", name: "TripWise Claude", model: "claude-sonnet", platform: "claude", status: "live", conversations: 4700, quotes: 1410, conversions: 235, createdAt: "2026-01-05" },
  { id: "agt_16", customerId: "cust_08", name: "MediAssist Triage", model: "gemini-pro", platform: "gemini", status: "live", conversations: 3400, quotes: 680, conversions: 102, createdAt: "2025-08-10" },
  { id: "agt_17", customerId: "cust_09", name: "FinFlow Invest", model: "claude-sonnet", platform: "claude", status: "live", conversations: 10800, quotes: 3240, conversions: 540, createdAt: "2025-10-25" },
  { id: "agt_18", customerId: "cust_09", name: "FinFlow Gemini", model: "gemini-pro", platform: "gemini", status: "live", conversations: 8100, quotes: 2430, conversions: 405, createdAt: "2025-11-10" },
  { id: "agt_19", customerId: "cust_10", name: "VoyageAI Explorer", model: "gpt-4o", platform: "chatgpt", status: "pending_approval", conversations: 850, quotes: 170, conversions: 25, createdAt: "2026-03-05" },
];

// Generate last 30 days of conversation data
function generateDailyConversations(): DailyConversation[] {
  const data: DailyConversation[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
    const trendFactor = 1 + (29 - i) * 0.008;

    data.push({
      date: dateStr,
      chatgpt: Math.round(2800 * weekendFactor * trendFactor + (Math.random() - 0.5) * 400),
      claude: Math.round(1900 * weekendFactor * trendFactor + (Math.random() - 0.5) * 300),
      gemini: Math.round(1400 * weekendFactor * trendFactor + (Math.random() - 0.5) * 200),
    });
  }

  return data;
}

export const dailyConversations: DailyConversation[] = generateDailyConversations();

export type VisibilityScore = {
  customerId: string;
  chatgpt: number | null;
  claude: number | null;
  gemini: number | null;
};

export const visibilityScores: VisibilityScore[] = [
  { customerId: "cust_01", chatgpt: 78, claude: 65, gemini: null },
  { customerId: "cust_02", chatgpt: 82, claude: 71, gemini: 59 },
  { customerId: "cust_03", chatgpt: null, claude: 67, gemini: 44 },
  { customerId: "cust_04", chatgpt: 23, claude: null, gemini: null },
  { customerId: "cust_05", chatgpt: 74, claude: null, gemini: 61 },
  { customerId: "cust_06", chatgpt: 88, claude: 79, gemini: 72 },
  { customerId: "cust_07", chatgpt: 71, claude: 58, gemini: null },
  { customerId: "cust_08", chatgpt: null, claude: null, gemini: 19 },
  { customerId: "cust_09", chatgpt: null, claude: 76, gemini: 63 },
  { customerId: "cust_10", chatgpt: 12, claude: null, gemini: null },
];

export const recentActivity: Activity[] = [
  { id: "act_01", type: "partner_onboarded", message: "VoyageAI onboarded by Sofia Chen — pilot contract signed", timestamp: "2026-03-18T09:15:00Z", customerId: "cust_10" },
  { id: "act_02", type: "agent_deployed", message: "SafeNest Starter agent submitted for approval on ChatGPT", timestamp: "2026-03-18T08:42:00Z", customerId: "cust_04" },
  { id: "act_03", type: "conversion", message: "Tuio Home Quote generated 12 new conversions this morning", timestamp: "2026-03-18T07:30:00Z", customerId: "cust_01" },
  { id: "act_04", type: "agent_alert", message: "CoverBot Life agent on Gemini — conversion drop detected (−18%)", timestamp: "2026-03-17T22:10:00Z", customerId: "cust_03" },
  { id: "act_05", type: "conversion", message: "NeoBank Advisor reached 1,000+ monthly conversions milestone", timestamp: "2026-03-17T18:45:00Z", customerId: "cust_06" },
  { id: "act_06", type: "audit_completed", message: "Synthetic audit completed for Insurify — visibility score: 82 on ChatGPT", timestamp: "2026-03-17T14:20:00Z", customerId: "cust_02" },
  { id: "act_07", type: "agent_deployed", message: "FinFlow Invest agent deployed to Claude by Marcus Klein", timestamp: "2026-03-17T11:05:00Z", customerId: "cust_09" },
  { id: "act_08", type: "audit_completed", message: "Synthetic audit completed for SafeNest — visibility score: 23 on ChatGPT", timestamp: "2026-03-16T16:30:00Z", customerId: "cust_04" },
  { id: "act_09", type: "agent_alert", message: "MediAssist Triage agent on Gemini — 3 consecutive API timeout errors", timestamp: "2026-03-16T10:15:00Z", customerId: "cust_08" },
  { id: "act_10", type: "partner_onboarded", message: "SafeNest onboarded by Ana Costa — insurance vertical", timestamp: "2026-03-15T20:00:00Z", customerId: "cust_04" },
];
