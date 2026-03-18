import { notFound } from "next/navigation";
import { customers, agents } from "@/data/mock";
import { CustomerDetail } from "@/components/customers/CustomerDetail";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = customers.find((c) => c.id === id);
  if (!customer) notFound();

  const customerAgents = agents.filter((a) => a.customerId === id);

  return <CustomerDetail customer={customer} agents={customerAgents} />;
}
