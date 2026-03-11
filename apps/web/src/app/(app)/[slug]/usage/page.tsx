import type { UsageRecord } from "@exec0/usage";
import {
  aggregateByDay,
  aggregateByLanguage,
  getTimePeriod,
  getUsageByOwner,
  usageTable,
} from "@/lib/usage";
import { DatePeriodSelector } from "@/modules/usage/date-period-selector";
import { UsageChart } from "@/modules/usage/usage-chart";
import { UsageStats } from "@/modules/usage/usage-stats";

type Period = "7d" | "30d" | "month";

const PERIOD_MAP: Record<Period, "week" | "month"> = {
  "7d": "week",
  "30d": "month",
  month: "month",
};

function buildChartData(records: UsageRecord[]) {
  const byDay = aggregateByDay(records);
  const entries = Object.entries(byDay) as [string, number][];

  return entries
    .map(([dateStr, count]) => ({
      date: new Date(dateStr),
      executions: count,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function calculateStats(records: UsageRecord[], period: Period) {
  const total = records.length;
  const days = period === "7d" ? 7 : 30;
  const avgDaily = days > 0 ? Math.round(total / days) : 0;

  const byDay = aggregateByDay(records);
  const dayValues = Object.values(byDay) as number[];
  const peakDay = dayValues.length > 0 ? Math.max(...dayValues) : 0;

  const byLanguage = aggregateByLanguage(records);
  const langEntries = Object.entries(byLanguage) as [string, number][];
  const topLanguage = langEntries.sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

  return { total, avgDaily, peakDay, topLanguage };
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

  const chartData = buildChartData(records);
  const stats = calculateStats(records, period);

  return (
    <div className="space-y-8">
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

      {/* Stats */}
      <UsageStats
        totalExecutions={stats.total}
        averageDaily={stats.avgDaily}
        peakDay={stats.peakDay}
        topLanguage={stats.topLanguage}
      />

      {/* Chart */}
      <div className="space-y-2">
        <div className="px-1">
          <h2 className="text-sm font-medium text-foreground">
            Executions over time
          </h2>
          <p className="text-xs text-muted-foreground">
            Daily execution count for the selected period
          </p>
        </div>
        <UsageChart data={chartData} />
      </div>
    </div>
  );
}
