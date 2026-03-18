import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const JSON_SUFFIX = "Respond with valid JSON only. No markdown, no code fences, no preamble.";

async function callClaude(
  apiKey: string,
  system: string,
  prompt: string,
  max_tokens: number
): Promise<string> {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const block = data.content?.[0];
  if (block?.type !== "text") throw new Error("Unexpected response format");
  return block.text as string;
}

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
    const { prompt, system = "", max_tokens = 1024 } = body as {
      prompt: string;
      system?: string;
      max_tokens?: number;
    };

    const fullSystem = [system, JSON_SUFFIX].filter(Boolean).join("\n\n");

    let raw = await callClaude(apiKey, fullSystem, prompt, max_tokens);

    // Extract first JSON object or array from response
    let data: unknown;
    const match = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      try {
        data = JSON.parse(match[0]);
      } catch {
        // retry with stricter prompt
        const retrySystem = fullSystem + "\n\nIMPORTANT: Output raw JSON only, nothing else.";
        raw = await callClaude(apiKey, retrySystem, prompt, max_tokens);
        const retryMatch = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (!retryMatch) throw new Error("Could not extract JSON from response after retry");
        data = JSON.parse(retryMatch[0]);
      }
    } else {
      throw new Error("No JSON found in response");
    }

    return NextResponse.json({ data, raw, mock: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
