import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  className?: string;
};

function DashboardCard({ title, value, subtitle, icon, className }: Props) {
  return (
    <div
      className={cn(
        "p-5 flex gap-4 flex-col rounded-[14px] bg-white border border-neutral-200",
        className,
      )}
    >
      <h3 className="text-sm text-neutral-700">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="block font-semibold text-neutral-700 text-[32px] tracking-[-0.64px]">
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-neutral-500">{subtitle}</span>
          )}
        </div>
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
