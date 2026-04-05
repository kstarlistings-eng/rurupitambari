import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
};

function DashboardCard({ title, value, icon, className }: Props) {
  return (
    <div
      className={cn(
        "p-5 flex gap-4 flex-col rounded-[14px] bg-white border border-neutral-200",
        className,
      )}
    >
      <h3 className="text-sm text-neutral-700">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="block font-semibold text-neutral-700 text-[32px] tracking-[-0.64px]">
          {value}
        </span>
        <div>{icon}</div>
      </div>
    </div>
  );
}

export default DashboardCard;

export function DashboardCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-5 flex gap-4 flex-col rounded-[14px] bg-white border border-neutral-200",
        className,
      )}
    >
      {/* Title Skeleton */}
      <Skeleton className="h-5 w-32" />

      {/* Value and Icon Container */}
      <div className="flex items-center justify-between">
        {/* Value Skeleton */}
        <Skeleton className="h-10 w-24" />

        {/* Icon Skeleton */}
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}
