import { InfoIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { useDashboardData } from "../../useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

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

interface ColorMap {
  total: string;
  active: string;
  trial: string;
}

const COLORS: ColorMap = {
  total: "var(--primary)",
  active: "var(--success)",
  trial: "var(--warning)",
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

interface LegendItem {
  key: keyof ColorMap;
  label: string;
}

const CustomLegend = () => {
  const legendItems: LegendItem[] = [
    { key: "total", label: "Total Organization" },
    { key: "active", label: "Active Organization" },
    { key: "trial", label: "Trial Organization" },
  ];

  return (
    <div className="flex justify-center gap-7 mt-4 flex-wrap">
      {legendItems.map(({ key, label }) => (
        <span
          key={key}
          className="flex items-center gap-1.75 text-sm text-gray-500"
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

export default function OrganizationGrowthChart(): React.ReactElement {
  const { data, isLoading } = useDashboardData();

  // Calculate dynamic domain and ticks
  const getAxisConfig = () => {
    const chartData = data?.charts.subscription_overview || [];

    if (chartData.length === 0) {
      return { domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] };
    }

    // Find max value across all series
    const maxValue = Math.max(
      ...chartData.flatMap((d) => [d.total || 0, d.active || 0, d.trial || 0]),
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
          Organization Growth
        </h2>
        <div
          title="Organization growth metrics over time"
          className="cursor-pointer"
        >
          <InfoIcon className="text-neutral-400" size={16} />
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={300} className={"mb-6"}>
          <LineChart
            data={data?.charts.subscription_overview || []}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="" stroke="#E5E7EB" />
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
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="linear"
              dataKey="total"
              name="Total Organization"
              stroke={COLORS.total}
              strokeWidth={2}
              dot={{ r: 4, fill: COLORS.total, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: COLORS.total, strokeWidth: 0 }}
            />
            <Line
              type="linear"
              dataKey="active"
              name="Active Organization"
              stroke={COLORS.active}
              strokeWidth={2}
              dot={{ r: 4, fill: COLORS.active, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: COLORS.active, strokeWidth: 0 }}
            />
            <Line
              type="linear"
              dataKey="trial"
              name="Trial Organization"
              stroke={COLORS.trial}
              strokeWidth={2}
              dot={{ r: 4, fill: COLORS.trial, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: COLORS.trial, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <CustomLegend />
    </div>
  );
}
