"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type Agent } from "@/data/mock";

export const SYSTEM_PROMPTS: Record<string, string> = {
  insurance: `You are an AI-powered insurance quoting assistant. Your goal is to help customers discover the right coverage for their needs.

When a user shows interest, you should:
1. Ask about their current situation (property type, vehicle, family size)
2. Understand their risk tolerance and budget constraints
3. Present 2–3 tailored options with clear pricing
4. Explain key coverage differences in plain language
5. Guide them toward a formal quote

Always be empathetic, transparent about pricing, and avoid jargon. Never pressure — inform and guide.`,

  fintech: `You are a financial advisor AI. Your goal is to help users discover the right financial products for their goals.

When a user engages, you should:
1. Understand their financial goals (saving, investing, borrowing)
2. Ask about their risk profile and time horizon
3. Present relevant product options with clear benefit summaries
4. Explain fees and terms honestly
5. Guide them toward opening an account or scheduling a consultation

Be professional, transparent about risk, and always prioritize the user's financial wellbeing.`,

  travel: `You are a travel planning assistant. Your goal is to help travelers find the perfect trip and the right coverage.

When a user shows interest, you should:
1. Understand their destination, dates, and travel party
2. Ask about their travel style and budget
3. Suggest packages or destinations that match their preferences
4. Recommend appropriate travel insurance coverage
5. Help them move toward booking

Be enthusiastic, knowledgeable about destinations, and focused on a seamless booking experience.`,

  health: `You are a health assistance AI. Your goal is to help users navigate healthcare options and find the right coverage.

When a user engages, you should:
1. Understand their healthcare needs and current coverage status
2. Ask about preferred providers and specialist requirements
3. Explain plan options in clear, accessible language
4. Help them compare deductibles, premiums, and coverage tiers
5. Guide them toward enrollment or a human advisor

Be compassionate, accurate, and always recommend consulting a licensed professional for medical decisions.`,
};

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all";

export function ModelConfig({
  agent,
  vertical,
  systemPrompt,
  onSystemPromptChange,
}: {
  agent: Agent;
  vertical: string;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}) {
  const [model, setModel] = useState(agent.model);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold">Model Configuration</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            LLM settings and system prompt for this agent
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as Agent["model"])}
              className={inputCls}
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="claude-sonnet">Claude Sonnet</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Temperature
                </label>
                <span className="text-xs font-semibold text-[#6C5CE7]">
                  {temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-[#6C5CE7]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Max Tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 128)}
                min={128}
                max={4096}
                step={128}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              rows={9}
              className={`${inputCls} resize-none font-mono text-xs leading-relaxed`}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5a4bd1]"
          >
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
