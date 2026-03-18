import { MessageSquare, TrendingUp, Bot, Calendar, Building2, Mail, Phone, User, StickyNote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Customer, type Agent } from "@/data/mock";
import { cn } from "@/lib/utils";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const PLATFORM_CONFIG = {
  chatgpt: { label: "ChatGPT", color: "#10a37f", bg: "#10a37f10", desc: "OpenAI ChatGPT" },
  claude: { label: "Claude", color: "#d97706", bg: "#d9770610", desc: "Anthropic Claude" },
  gemini: { label: "Gemini", color: "#4285f4", bg: "#4285f410", desc: "Google Gemini" },
};

function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="rounded-lg bg-[#6C5CE7]/10 p-2">
            <Icon className="h-4 w-4 text-[#6C5CE7]" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

const MOCK_CONTACTS: Record<string, { name: string; email: string; phone: string }> = {
  cust_01: { name: "Sophie Martin", email: "sophie@tuio.com", phone: "+1 (415) 555-0192" },
  cust_02: { name: "James Chen", email: "james@insurify.com", phone: "+1 (628) 555-0183" },
  cust_03: { name: "Laura Novak", email: "laura@coverbot.io", phone: "+1 (737) 555-0174" },
  cust_04: { name: "David Kim", email: "david@safenest.co", phone: "+1 (512) 555-0165" },
  cust_05: { name: "Priya Sharma", email: "priya@policypal.com", phone: "+1 (650) 555-0156" },
  cust_06: { name: "Marcus Weber", email: "marcus@neobank.io", phone: "+1 (415) 555-0147" },
  cust_07: { name: "Aisha Thompson", email: "aisha@tripwise.travel", phone: "+1 (213) 555-0138" },
  cust_08: { name: "Ryan O'Brien", email: "ryan@mediassist.health", phone: "+1 (617) 555-0129" },
  cust_09: { name: "Elena Volkov", email: "elena@finflow.finance", phone: "+1 (646) 555-0120" },
  cust_10: { name: "Carlos Reyes", email: "carlos@voyageai.travel", phone: "+1 (305) 555-0111" },
};

export function CustomerOverview({
  customer,
  agents,
}: {
  customer: Customer;
  agents: Agent[];
}) {
  const activeAgents = agents.filter((a) => a.status === "live").length;
  const contact = MOCK_CONTACTS[customer.id] ?? {
    name: "Contact Person",
    email: `contact@${customer.name.toLowerCase()}.com`,
    phone: "+1 (555) 000-0000",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <KpiCard
          title="Total Conversations"
          value={formatNumber(customer.totalConversations)}
          sub="All time across platforms"
          icon={MessageSquare}
        />
        <KpiCard
          title="Conversion Rate"
          value={`${customer.conversionRate.toFixed(2)}%`}
          sub={`${formatNumber(customer.conversions)} total conversions`}
          icon={TrendingUp}
        />
        <KpiCard
          title="Active Agents"
          value={`${activeAgents}`}
          sub={`${agents.length} total deployed`}
          icon={Bot}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h3 className="mb-4 text-sm font-semibold">Platform Presence</h3>
              <div className="space-y-3">
                {(["chatgpt", "claude", "gemini"] as const).map((p) => {
                  const cfg = PLATFORM_CONFIG[p];
                  const active = customer.platforms.includes(p);
                  const platformAgents = agents.filter((a) => a.platform === p);
                  return (
                    <div
                      key={p}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
                        active ? "border-border/60 bg-white" : "border-border/30 bg-gray-50/50 opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: active ? cfg.color : "#d1d5db" }}
                        />
                        <div>
                          <p className="text-sm font-medium">{cfg.label}</p>
                          <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        {active && platformAgents.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {platformAgents.length} agent{platformAgents.length > 1 ? "s" : ""}
                          </p>
                        )}
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={
                            active
                              ? { color: cfg.color, backgroundColor: cfg.bg }
                              : { color: "#9ca3af", backgroundColor: "#f3f4f6" }
                          }
                        >
                          {active ? "Live" : "Not deployed"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Partner Info</h3>
            <dl className="space-y-3.5">
              <InfoRow icon={Calendar} label="Partner Since">
                {new Date(customer.partnerSince).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </InfoRow>
              <InfoRow icon={Building2} label="Vertical">
                <span className="capitalize">{customer.vertical}</span>
              </InfoRow>
              <InfoRow icon={User} label="Account Owner">
                {customer.accountOwner}
              </InfoRow>
              <div className="my-1 border-t border-border/50" />
              <InfoRow icon={Mail} label="Contact">
                <a href={`mailto:${contact.email}`} className="text-[#6C5CE7] hover:underline">
                  {contact.email}
                </a>
              </InfoRow>
              <InfoRow icon={Phone} label="Phone">
                {contact.phone}
              </InfoRow>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Internal Notes */}
      {customer.notes && (
        <Card className="border-amber-200/60 bg-amber-50/30">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Internal Notes</p>
                <p className="text-sm leading-relaxed text-foreground">{customer.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm text-foreground">{children}</p>
      </div>
    </div>
  );
}
