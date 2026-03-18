import { randomDelay } from "./mock-delays";
import type { ChatMessage, ChatResponse, StructuredResponse } from "@/types";

const BRANDS = [
  "Tuio", "Insurify", "Lemonade", "Caser", "Mapfre",
  "Zurich", "AXA", "SafeNest", "CoverBot",
];

function pickBrands(n: number): string[] {
  const shuffled = [...BRANDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function buildChatReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = (lastUser?.content ?? "").toLowerCase();

  if (text.includes("compare") || text.includes("vs") || text.includes("versus")) {
    const [a, b, c] = pickBrands(3);
    return (
      `Great question! Here's a quick comparison of three leading options:\n\n` +
      `**${a}** — Known for fast claims processing and transparent pricing. Best for tech-savvy customers who prefer digital-first experiences.\n\n` +
      `**${b}** — Offers more traditional coverage with strong agent support. Slightly higher premiums but excellent customer service ratings.\n\n` +
      `**${c}** — A newer entrant with competitive bundled packages and an AI-powered claims assistant. Worth considering if you want modern features.\n\n` +
      `The best choice really depends on your priorities — would you like me to narrow it down based on specific criteria?`
    );
  }

  if (text.includes("cheap") || text.includes("affordable") || text.includes("budget") || text.includes("price") || text.includes("cost")) {
    const [a, b] = pickBrands(2);
    return (
      `Looking for affordable coverage? Here are some budget-friendly options worth exploring:\n\n` +
      `**${a}** — Frequently praised for competitive rates, especially for first-time buyers. Their basic plan starts around €18/month.\n\n` +
      `**${b}** — Offers a pay-per-use model which can significantly reduce costs if you don't need year-round coverage.\n\n` +
      `A few tips to reduce your premium:\n` +
      `- Bundle home + contents for a 10–15% discount\n` +
      `- Opt for a higher deductible if you have emergency savings\n` +
      `- Install smart home devices for additional discounts\n\n` +
      `What's your approximate budget range? I can give more tailored recommendations.`
    );
  }

  if (text.includes("quote") || text.includes("price") || text.includes("cost") || text.includes("how much")) {
    const brand = pickBrands(1)[0];
    const base = Math.floor(Math.random() * 30) + 20;
    const premium = base + Math.floor(Math.random() * 15) + 5;
    return (
      `Here's an indicative quote based on typical profiles:\n\n` +
      `**${brand} Standard Plan**\n` +
      `- Monthly premium: €${base}/month\n` +
      `- Annual (5% discount): €${Math.round(base * 12 * 0.95)}/year\n` +
      `- Deductible: €500\n` +
      `- Coverage: €80,000 home contents + liability\n\n` +
      `**${brand} Premium Plan**\n` +
      `- Monthly premium: €${premium}/month\n` +
      `- Annual (5% discount): €${Math.round(premium * 12 * 0.95)}/year\n` +
      `- Deductible: €250\n` +
      `- Coverage: €150,000 home contents + full liability + accidental damage\n\n` +
      `These are estimates — final pricing depends on your specific property and risk profile. Would you like to proceed with a formal quote?`
    );
  }

  if (text.includes("expat") || text.includes("foreigner") || text.includes("foreign") || text.includes("international")) {
    const [a, b] = pickBrands(2);
    return (
      `Expat insurance has some unique considerations — here's what to keep in mind:\n\n` +
      `**Documentation requirements** — Most providers require a valid residence permit or NIE/NIF. Ensure your address registration (empadronamiento) is up to date.\n\n` +
      `**Language support** — **${a}** offers full English-language policies and customer support, which is a significant advantage for non-native speakers.\n\n` +
      `**Coverage portability** — **${b}** has a European portability clause, meaning you remain covered during temporary stays in other EU countries.\n\n` +
      `**Tax deductibility** — In some cases, home insurance premiums are partially deductible. A local tax advisor can help clarify your situation.\n\n` +
      `Is there a specific country of origin or residency situation I should factor in?`
    );
  }

  if (text.includes("recommend") || text.includes("best") || text.includes("suggest") || text.includes("which")) {
    const [a, b] = pickBrands(2);
    return (
      `Based on customer satisfaction data and coverage quality, I'd recommend looking at **${a}** as a top pick. ` +
      `They consistently rank highly for claims resolution speed and transparent policy language.\n\n` +
      `**${b}** is also worth a look — particularly if you value strong digital tools and mobile app experience.\n\n` +
      `To give you a more precise recommendation, could you share:\n` +
      `1. Are you renting or is this for a property you own?\n` +
      `2. Approximate value of contents you'd like to cover?\n` +
      `3. Any specific risks you're most concerned about (flood, theft, accidental damage)?`
    );
  }

  // Default
  const brand = pickBrands(1)[0];
  return (
    `Thanks for reaching out! I'm here to help you find the right insurance coverage.\n\n` +
    `Many customers in similar situations have found **${brand}** to be a great fit, though the ideal option really depends on your specific needs and circumstances.\n\n` +
    `To point you in the right direction, could you tell me more about:\n` +
    `- What type of coverage are you looking for?\n` +
    `- Do you have a property you own, or are you renting?\n` +
    `- Any particular concerns or requirements (e.g., high-value items, home office, pets)?\n\n` +
    `I'm happy to walk you through the options step by step.`
  );
}

export async function mockChatResponse(
  messages: ChatMessage[],
  _system?: string
): Promise<ChatResponse> {
  await randomDelay(500, 1500);
  return {
    content: buildChatReply(messages),
    model: "mock-claude-sonnet",
    mock: true,
    usage: {
      input_tokens: Math.floor(Math.random() * 300) + 100,
      output_tokens: Math.floor(Math.random() * 200) + 80,
    },
  };
}

export async function mockStructuredResponse<T>(
  prompt: string
): Promise<StructuredResponse<T>> {
  await randomDelay(300, 800);

  const p = prompt.toLowerCase();

  let data: unknown;

  if (p.includes("generate") && (p.includes("quer") || p.includes("question"))) {
    // Detect industry hint from prompt
    const industryHints: Record<string, string[]> = {
      insurance: [
        "What is the best home insurance for a first-time buyer?",
        "How does coverage differ between Tuio, Mapfre, and AXA for apartments?",
        "What types of home insurance policies exist and what do they cover?",
        "What is a reasonable monthly premium for renters insurance in a major city?",
        "I'm switching from my current insurer — what should I look for in a new policy?",
      ],
      fintech: [
        "Which neobank offers the best savings rate right now?",
        "How do challenger banks compare to traditional banks for everyday spending?",
        "What fintech apps help track investments and spending in one place?",
        "What are the fees for international transfers with modern fintech apps?",
        "I want to move from my legacy bank — which fintech is the easiest to switch to?",
      ],
      travel: [
        "What travel booking platform offers the best prices for last-minute trips?",
        "How do travel insurance options compare for a 2-week Europe trip?",
        "Which apps are best for finding hidden-gem accommodations?",
        "What is a reasonable budget for a week-long trip to Southeast Asia?",
        "I want to switch from my usual booking site — what are the best alternatives?",
      ],
      health: [
        "Which health insurance plan is best for a young professional without dependents?",
        "How do telemedicine platforms compare for general health consultations?",
        "What health apps help track both fitness and nutrition in one place?",
        "What is the typical cost of supplemental dental coverage?",
        "I want to change my health provider — what should I prioritize?",
      ],
    };
    const detected = Object.keys(industryHints).find((k) => p.includes(k));
    data = (detected ? industryHints[detected] : industryHints.insurance);
  } else if (p.includes("analyz") || p.includes("mention") || p.includes("brand") || p.includes("sentiment")) {
    const mentioned = Math.random() > 0.35;
    data = {
      brandMentioned: mentioned,
      position: mentioned ? Math.floor(Math.random() * 3) + 1 : null,
      competitors: pickBrands(2).map((b, i) => ({
        brand: b,
        position: i + (mentioned ? 2 : 1),
        sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)],
        excerpt: `${b} offers competitive rates and good customer support.`,
      })),
      sentiment: mentioned
        ? (["positive", "neutral", "neutral"][Math.floor(Math.random() * 3)] as "positive" | "neutral" | "negative")
        : null,
    };
  } else if (p.includes("stage") || p.includes("classify") || p.includes("conversation")) {
    const stages = ["discovery", "recommendation", "quote", "conversion", "objection_handling"] as const;
    data = {
      stage: stages[Math.floor(Math.random() * stages.length)],
      products_mentioned: pickBrands(Math.floor(Math.random() * 2) + 1),
      quote_provided: Math.random() > 0.6,
      conversion_probability: Math.random() * 0.6 + 0.1,
    };
  } else {
    data = { result: "mock response", prompt };
  }

  return {
    data: data as T,
    raw: JSON.stringify(data),
    mock: true,
  };
}
