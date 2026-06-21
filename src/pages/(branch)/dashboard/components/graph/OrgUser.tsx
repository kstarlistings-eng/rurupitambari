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
import { format } from "date-fns";

interface ChartPoint {
  month: string;
  sales: number;
  expenses: number;
}

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

const COLORS = {
  sales: "var(--primary)",
  expenses: "#EF4444",
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
          <span className="font-semibold text-gray-900">₹{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = () => {
  const items = [
    { key: "sales" as const, label: "Sales" },
    { key: "expenses" as const, label: "Expenses" },
  ];

  return (
    <div className="flex justify-center gap-7 mt-4 flex-wrap">
      {items.map(({ key, label }) => (
        <span key={key} className="flex items-center gap-1.5 text-sm text-gray-500">
          <span className="w-3 h-3 rounded-full" style={{ background: COLORS[key] }} />
          {label}
        </span>
      ))}
    </div>
  );
};

function formatMonth(value: string) {
  try {
    return format(new Date(value), "MMM yyyy");
  } catch {
    return value;
  }
}

export default function MonthlyGrowthChart(): React.ReactElement {
  const { data, isLoading } = useDashboardData();

  const chartData: ChartPoint[] =
    data?.charts?.monthly_sales?.map((sale, index) => {
      const expense = data?.charts?.monthly_expenses?.[index];
      return {
        month: formatMonth(sale.month),
        sales: sale.total,
        expenses: expense?.total || 0,
      };
    }) || [];

  const getAxisConfig = () => {
    if (chartData.length === 0) {
      return { domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] };
    }

    const maxValue = Math.max(
      ...chartData.flatMap((d) => [d.sales, d.expenses]),
    );
    const roundedMax = Math.ceil(maxValue / 100) * 100 || 100;
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
          Monthly Comparison
        </h2>
        <div title="Monthly sales and expenses comparison" className="cursor-pointer">
          <InfoIcon className="text-neutral-400" size={16} />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={300} className="mb-6">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            barCategoryGap="15%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="" stroke="#E5E7EB" vertical={false} />
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Bar
              dataKey="sales"
              name="Sales"
              fill={COLORS.sales}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill={COLORS.expenses}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      <CustomLegend />
    </div>
  );
}
