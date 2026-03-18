import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("API key not configured");

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const block = data.content?.[0];
  if (block?.type !== "text") throw new Error("Unexpected response format");
  return block.text as string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body as {
      action: "generate_queries" | "run_query" | "analyze_response";
      payload: Record<string, string>;
    };

    if (action === "generate_queries") {
      const { brandName, industry, vertical } = payload;
      const system = `You are a synthetic buyer AI that generates realistic customer queries for testing AI recommendation systems. Return ONLY a valid JSON array of objects, no markdown, no explanation.`;
      const user = `Generate 4 realistic customer queries that a person might ask an AI assistant when looking for ${industry} products/services${vertical ? ` in the ${vertical} space` : ""}. The brand being tested is "${brandName}".

Each query should test a different intent: recommendation, comparison, discovery, price.

Return JSON array:
[{"id":"q1","text":"<query>","intent":"recommendation"},{"id":"q2","text":"<query>","intent":"comparison"},{"id":"q3","text":"<query>","intent":"discovery"},{"id":"q4","text":"<query>","intent":"price"}]`;

      const text = await callClaude(system, user);
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON array found in response");
      const queries = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ queries });
    }

    if (action === "run_query") {
      const { queryText } = payload;
      const system = `You are a helpful AI assistant. Answer the user's question naturally and helpfully, as you would in a real conversation. Mention specific brands, products, or services that are genuinely relevant.`;
      const text = await callClaude(system, queryText);
      return NextResponse.json({ response: text });
    }

    if (action === "analyze_response") {
      const { queryText, aiResponse, brandName } = payload;
      const system = `You are an AI brand analytics engine. Analyze AI assistant responses for brand mentions and sentiment. Return ONLY valid JSON, no markdown.`;
      const user = `Analyze this AI assistant response for brand mentions.

Query: "${queryText}"
AI Response: "${aiResponse}"
Target Brand: "${brandName}"

Extract:
1. Whether "${brandName}" is mentioned (true/false)
2. Position of "${brandName}" in the response (1=first brand mentioned, null=not mentioned)
3. Sentiment toward "${brandName}": "positive", "neutral", or "negative"
4. All other brands/companies mentioned, their position, sentiment, and a short excerpt

Return JSON:
{
  "brandMentioned": boolean,
  "brandPosition": number | null,
  "sentiment": "positive" | "neutral" | "negative" | null,
  "competitors": [
    {"brand": "Name", "position": 1, "sentiment": "positive", "excerpt": "short quote"}
  ]
}`;

      const text = await callClaude(system, user);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found in response");
      const analysis = JSON.parse(jsonMatch[0]);
      return NextResponse.json(analysis);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
