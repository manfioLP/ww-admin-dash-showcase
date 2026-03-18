type Scenario = {
  emoji: string;
  label: string;
  message: string;
};

const SCENARIOS: Scenario[] = [
  {
    emoji: "🏠",
    label: "New homeowner",
    message: "Hi, I just bought an apartment in Madrid and need home insurance",
  },
  {
    emoji: "🔄",
    label: "Switching provider",
    message: "I'm unhappy with my current home insurance and looking to switch",
  },
  {
    emoji: "💰",
    label: "Budget conscious",
    message: "I need the cheapest home insurance option for my rental",
  },
  {
    emoji: "❓",
    label: "General inquiry",
    message: "What types of insurance do you offer?",
  },
];

type Props = {
  onSelect: (message: string) => void;
};

export function ScenarioButtons({ onSelect }: Props) {
  return (
    <div className="px-4 pb-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Quick Scenarios
      </p>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.message)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-[#6C5CE7]/40 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
