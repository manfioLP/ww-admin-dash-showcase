import { notFound } from "next/navigation";
import { agents, customers } from "@/data/mock";
import { AgentDetail } from "@/components/agents/AgentDetail";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = agents.find((a) => a.id === id);
  if (!agent) notFound();

  const customer = customers.find((c) => c.id === agent.customerId);
  if (!customer) notFound();

  return <AgentDetail agent={agent} customer={customer} />;
}
