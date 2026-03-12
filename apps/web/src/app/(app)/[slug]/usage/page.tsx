import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exec0/ui/empty";
import type { UsageRecord } from "@exec0/usage";
import { IconWindowChartLineFillDuo18 } from "nucleo-ui-essential-fill-duo-18";
import {
  aggregateByDay,
  getTimePeriod,
  getUsageByOwner,
  usageTable,
} from "@/lib/usage";
import { DatePeriodSelector } from "@/modules/usage/date-period-selector";
import { ExecutionLog } from "@/modules/usage/execution-log";
import { UsageChart } from "@/modules/usage/usage-chart";

type Period = "7d" | "30d" | "month";

const PERIOD_MAP: Record<Period, "week" | "month"> = {
  "7d": "week",
  "30d": "month",
  month: "month",
};

const PERIOD_DAYS: Record<Period, number> = {
  "7d": 7,
  "30d": 30,
  month: 30,
};

function buildChartData(records: UsageRecord[], periodDays: number) {
  const byDay = aggregateByDay(records);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: periodDays }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (periodDays - 1 - i));
    const key = date.toISOString().split("T")[0] as string;
    return { date, executions: byDay[key] ?? 0 };
  });
}

export default async function UsagePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { slug } = await params;
  const { period: rawPeriod } = await searchParams;

  const period: Period =
    rawPeriod === "7d" || rawPeriod === "30d" || rawPeriod === "month"
      ? rawPeriod
      : "30d";

  const timePeriod = PERIOD_MAP[period];
  const timeRange = getTimePeriod(timePeriod);

  const records = await getUsageByOwner(usageTable, slug, timeRange);

  if (records.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconWindowChartLineFillDuo18 className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No executions yet</EmptyTitle>
          <EmptyDescription>
            Usage data will appear here once you start making API calls with
            your keys.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const chartData = buildChartData(records, PERIOD_DAYS[period]);
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-medium font-mono">Usage</h1>
          <p className="text-muted-foreground text-sm">
            Monitor your API execution activity
          </p>
        </div>
        <DatePeriodSelector currentPeriod={period} />
      </div>

      {/* Chart */}
      <UsageChart data={chartData} />

      {/* Execution Log */}
      <ExecutionLog records={sortedRecords} />
    </div>
  );
}
