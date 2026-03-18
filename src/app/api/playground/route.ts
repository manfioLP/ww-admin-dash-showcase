import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured", mock: true }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { action, systemPrompt, messages } = body as {
      action: "chat" | "analyze";
      systemPrompt: string;
      messages: Message[];
    };

    if (action === "chat") {
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
          messages,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `Anthropic error ${res.status}: ${err}` }, { status: res.status });
      }

      const data = await res.json();
      const block = data.content?.[0];
      if (block?.type !== "text") {
        return NextResponse.json({ error: "Unexpected response format" }, { status: 500 });
      }
      return NextResponse.json({ content: block.text as string });
    }

    if (action === "analyze") {
      const conversationText = messages
        .map((m) => `${m.role === "user" ? "User" : "Agent"}: ${m.content}`)
        .join("\n");

      const res = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 256,
          system: `You are a conversation analytics engine. Analyze insurance sales conversations and return ONLY valid JSON, no markdown.`,
          messages: [
            {
              role: "user",
              content: `Analyze this conversation:\n\n${conversationText}\n\nReturn JSON:
{
  "stage": "discovery" | "recommendation" | "quote" | "conversion" | "objection_handling",
  "products_mentioned": string[],
  "quote_provided": boolean,
  "conversion_probability": number
}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        return NextResponse.json({ error: "Analysis failed" }, { status: res.status });
      }

      const data = await res.json();
      const text = data.content?.[0]?.text ?? "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return NextResponse.json({ error: "No JSON in analysis" }, { status: 500 });
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
