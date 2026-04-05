import { InfoIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { useDashboardData } from "../../useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

// interface DataPoint {
//   month: string;
//   organizations: number;
//   user: number;
// }

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

// const data: DataPoint[] = [
//   { month: "Jan", organizations: 90, user: 33 },
//   { month: "Feb", organizations: 42, user: 22 },
//   { month: "Mar", organizations: 80, user: 20 },
//   { month: "Apr", organizations: 50, user: 62 },
//   { month: "May", organizations: 53, user: 14 },
//   { month: "Jun", organizations: 51, user: 29 },
// ];

const COLORS = {
  organizations: "var(--primary)",
  user: "#C39CC4",
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-[10px] px-3.5 py-2.5 shadow-lg text-sm">
      <p className="font-semibold mb-1.5 text-gray-700">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = () => {
  const items = [
    { key: "organizations" as const, label: "Organizations" },
    { key: "user" as const, label: "User" },
  ];

  return (
    <div className="flex justify-center gap-7 mt-4 flex-wrap">
      {items.map(({ key, label }) => (
        <span
          key={key}
          className="flex items-center gap-1.5 text-sm text-gray-500"
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: COLORS[key] }}
          />
          {label}
        </span>
      ))}
    </div>
  );
};

export default function MonthlyGrowthChart(): React.ReactElement {
  const { data, isLoading } = useDashboardData();

  // Calculate dynamic domain and ticks
  const getAxisConfig = () => {
    const chartData = data?.charts?.organization_vs_user || [];

    if (chartData.length === 0) {
      return { domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] };
    }

    // Find max value across both series
    const maxValue = Math.max(
      ...chartData.flatMap((d: any) => [d.organizations || 0, d.users || 0]),
    );

    // Round up to nearest 20 for cleaner display
    const roundedMax = Math.ceil(maxValue / 20) * 20;

    // Generate evenly spaced ticks (5 ticks including 0)
    const ticks = Array.from({ length: 6 }, (_, i) => (roundedMax / 5) * i);

    return {
      domain: [0, roundedMax],
      ticks: ticks.map((t) => Math.round(t)),
    };
  };

  const axisConfig = getAxisConfig();

  return (
    <div className="bg-white w-full border border-neutral-200 p-5 sm:p-7 rounded-[14px]">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] text-neutral-500 font-medium">
          Monthly Growth Comparison
        </h2>
        <div
          title="Monthly growth metrics comparison"
          className="cursor-pointer"
        >
          <InfoIcon className="text-neutral-400" size={16} />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={300} className="mb-6">
          <BarChart
            data={data?.charts?.organization_vs_user || []}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            barCategoryGap="15%"
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray=""
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              domain={axisConfig.domain}
              ticks={axisConfig.ticks}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12 }}
              dx={-4}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar
              dataKey="organizations"
              name="Organizations"
              fill={COLORS.organizations}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="users"
              name="Users"
              fill={COLORS.user}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      <CustomLegend />
    </div>
  );
}
