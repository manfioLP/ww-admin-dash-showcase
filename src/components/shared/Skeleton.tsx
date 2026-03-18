import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-gray-200/80", className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-border/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="px-5 py-4"><Skeleton className="h-5 w-14 rounded-full" /></td>
      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
      <td className="px-5 py-4"><Skeleton className="h-4 w-12" /></td>
      <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
    </tr>
  );
}

const BAR_HEIGHTS = [60, 80, 50, 90, 70, 85, 65, 95, 75, 88];

export function SkeletonChart() {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div className="flex items-end gap-2 h-40">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm animate-pulse bg-gray-200/80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
