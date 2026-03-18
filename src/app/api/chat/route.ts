import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured", mock: true },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { messages, system, max_tokens = 1024 } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      system?: string;
      max_tokens?: number;
    };

    const payload: Record<string, unknown> = {
      model: MODEL,
      max_tokens,
      messages,
    };
    if (system) payload.system = system;

    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `Anthropic error ${res.status}: ${err}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const block = data.content?.[0];
    if (block?.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response format from Anthropic" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: block.text as string,
      model: data.model as string,
      mock: false,
      usage: data.usage as { input_tokens: number; output_tokens: number } | undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
