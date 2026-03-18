import { Card, CardContent } from "@/components/ui/card";

type Product = {
  name: string;
  priceRange: string;
  coverage: string;
  category: string;
};

const PRODUCTS_BY_VERTICAL: Record<string, Product[]> = {
  insurance: [
    {
      name: "Home Insurance Basic",
      priceRange: "$40–80/mo",
      coverage: "Dwelling, liability, personal property up to $100K",
      category: "Home",
    },
    {
      name: "Home Insurance Premium",
      priceRange: "$90–180/mo",
      coverage: "Extended replacement cost, valuables rider, identity theft",
      category: "Home",
    },
    {
      name: "Auto Comprehensive",
      priceRange: "$120–250/mo",
      coverage: "Collision, comprehensive, uninsured motorist, roadside",
      category: "Auto",
    },
    {
      name: "Auto Liability",
      priceRange: "$45–90/mo",
      coverage: "Bodily injury & property damage liability up to $500K",
      category: "Auto",
    },
    {
      name: "Renters Protection",
      priceRange: "$15–30/mo",
      coverage: "Personal property, liability, loss of use coverage",
      category: "Renters",
    },
  ],
  fintech: [
    {
      name: "Basic Checking",
      priceRange: "Free",
      coverage: "FDIC insured, no monthly fees, 30K+ ATMs nationwide",
      category: "Banking",
    },
    {
      name: "Premium Account",
      priceRange: "$9.99/mo",
      coverage: "High-yield savings, unlimited ATM reimbursement, concierge",
      category: "Banking",
    },
    {
      name: "Investment Starter",
      priceRange: "0.25% AUM",
      coverage: "Automated ETF portfolio, tax-loss harvesting, rebalancing",
      category: "Invest",
    },
    {
      name: "Savings Plus",
      priceRange: "4.5% APY",
      coverage: "No minimums, unlimited transfers, FDIC insured to $250K",
      category: "Savings",
    },
  ],
  travel: [
    {
      name: "Trip Protection Basic",
      priceRange: "2–4% of trip",
      coverage: "Trip cancellation, delay, lost baggage up to $1K",
      category: "Insurance",
    },
    {
      name: "Travel Premium",
      priceRange: "5–8% of trip",
      coverage: "Cancel for any reason, medical evacuation, 24/7 concierge",
      category: "Insurance",
    },
    {
      name: "Medical Evacuation",
      priceRange: "$50–100/trip",
      coverage: "Emergency evacuation, repatriation, hospital cash benefit",
      category: "Medical",
    },
  ],
  health: [
    {
      name: "Primary Care Plan",
      priceRange: "$150–300/mo",
      coverage: "Unlimited PCP visits, preventive care, generic Rx included",
      category: "Plans",
    },
    {
      name: "Specialist Access",
      priceRange: "$280–450/mo",
      coverage: "Specialist referrals, diagnostics, specialist Rx coverage",
      category: "Plans",
    },
    {
      name: "Emergency Coverage",
      priceRange: "$80–140/mo",
      coverage: "ER visits, urgent care, ambulance, hospitalization",
      category: "Emergency",
    },
    {
      name: "Preventive Care Plus",
      priceRange: "$60–100/mo",
      coverage: "Annual physicals, screenings, vaccines, mental health",
      category: "Preventive",
    },
  ],
};

export function ProductCatalog({ vertical }: { vertical: string }) {
  const products = PRODUCTS_BY_VERTICAL[vertical] ?? PRODUCTS_BY_VERTICAL.insurance;

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Product Catalog</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {products.length} products available for quoting
          </p>
        </div>
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-gray-50/50 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{p.name}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    {p.category}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.coverage}</p>
              </div>
              <span className="ml-4 shrink-0 text-xs font-semibold text-[#6C5CE7]">
                {p.priceRange}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
