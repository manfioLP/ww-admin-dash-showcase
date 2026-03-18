import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { customers } from "@/data/mock";
import { cn } from "@/lib/utils";

type FilterProps = {
  dateRange: "7d" | "30d" | "90d";
  customerId: string;
};

const RANGE_MULT = { "7d": 0.08, "30d": 0.30, "90d": 0.75 };

const REVENUE_PER_CONV: Record<string, number> = {
  insurance: 95,
  fintech: 60,
  travel: 45,
  health: 80,
};

// Deterministic sparkline seed per customer index to avoid hydration mismatch
const SPARKLINE_SEEDS: number[][] = [
  [0.85, 0.90, 0.88, 0.94, 0.97, 0.93, 1.0],
  [0.80, 0.88, 0.92, 0.87, 0.95, 0.99, 1.0],
  [0.90, 0.84, 0.91, 0.95, 0.89, 0.96, 1.0],
  [0.75, 0.82, 0.88, 0.91, 0.94, 0.97, 1.0],
  [0.88, 0.91, 0.86, 0.93, 0.90, 0.95, 1.0],
];

function Sparkline({ seed }: { seed: number[] }) {
  const max = Math.max(...seed);
  return (
    <div className="flex items-end gap-0.5 h-6">
      {seed.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-t-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: i === seed.length - 1 ? "#6C5CE7" : "#ddd9f7",
          }}
        />
      ))}
    </div>
  );
}

export function TopCustomers({ dateRange, customerId }: FilterProps) {
  const rows = useMemo(() => {
    const mult = RANGE_MULT[dateRange];

    const base =
      customerId !== "all"
        ? customers.filter((c) => c.id === customerId)
        : [...customers]
            .filter((c) => c.contractStatus !== "onboarding")
            .sort((a, b) => b.totalConversations - a.totalConversations)
            .slice(0, 5);

    return base.map((c, i) => ({
      ...c,
      scaledConversations: Math.round(c.totalConversations * mult),
      revenue: Math.round(c.conversions * (REVENUE_PER_CONV[c.vertical] ?? 60) * mult),
      seed: SPARKLINE_SEEDS[i % SPARKLINE_SEEDS.length],
    }));
  }, [dateRange, customerId]);

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="border-b border-border px-6 py-5">
          <h3 className="text-sm font-semibold">Top Partners</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Ranked by conversation volume</p>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-gray-50/60">
              {["#", "Partner", "Conversations", "Conv. Rate", "Revenue", "Trend"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr
                key={c.id}
                className={cn(
                  "transition-colors hover:bg-gray-50/60",
                  i < rows.length - 1 && "border-b border-border/50"
                )}
              >
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      i === 0
                        ? "bg-[#6C5CE7] text-white"
                        : i === 1
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-100 text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{c.logo}</span>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{c.vertical}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium">
                  {c.scaledConversations.toLocaleString()}
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-emerald-600">
                    {c.conversionRate.toFixed(2)}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium">
                  ${c.revenue.toLocaleString()}
                </td>
                <td className="px-5 py-3.5">
                  <Sparkline seed={c.seed} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
