import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Member = {
  name: string;
  title: string;
  email: string;
  initials: string;
  color: string;
};

const TEAM: Member[] = [
  { name: "Raphael Vullierme", title: "Co-founder", email: "raphael@waniwani.ai", initials: "RV", color: "#6C5CE7" },
  { name: "Sofia Chen", title: "Head of Ops", email: "sofia@waniwani.ai", initials: "SC", color: "#10b981" },
  { name: "Marcus Klein", title: "Engineering Lead", email: "marcus@waniwani.ai", initials: "MK", color: "#3b82f6" },
  { name: "Ana Costa", title: "Partner Success", email: "ana@waniwani.ai", initials: "AC", color: "#f59e0b" },
  { name: "James Park", title: "Data & Analytics", email: "james@waniwani.ai", initials: "JP", color: "#ec4899" },
];

export function TeamTab() {
  return (
    <div className="max-w-3xl">
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="border-b border-border px-6 py-5">
            <h3 className="text-sm font-semibold">WaniWani Team</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {TEAM.length} team members · Internal ops team
            </p>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                {["Member", "Title", "Email"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM.map((m, i) => (
                <tr
                  key={m.email}
                  className={cn(
                    "transition-colors hover:bg-gray-50/50",
                    i < TEAM.length - 1 && "border-b border-border/50"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.initials}
                      </div>
                      <p className="text-sm font-medium">{m.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{m.title}</td>
                  <td className="px-5 py-3.5">
                    <a href={`mailto:${m.email}`} className="text-sm text-[#6C5CE7] hover:underline">
                      {m.email}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
