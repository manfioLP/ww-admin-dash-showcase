import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ChartCardProps = {
  title: string;
  badge?: string;
  children: React.ReactNode;
};

export function ChartCard({ title, badge, children }: ChartCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {badge && (
          <Badge variant="secondary" className="text-xs font-normal">
            {badge}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
