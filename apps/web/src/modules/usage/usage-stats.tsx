import { Card } from "@exec0/ui/card";
import { Activity, ArrowUpRight, TrendingUp } from "lucide-react";

interface UsageStatsProps {
  totalExecutions: number;
  averageDaily: number;
  peakDay: number;
  topLanguage: string | null;
}

export function UsageStats({
  totalExecutions,
  averageDaily,
  peakDay,
  topLanguage,
}: UsageStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="flex flex-col gap-3 px-4 py-5 border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Executions
          </span>
          <Activity className="size-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-semibold font-mono">
          {totalExecutions.toLocaleString()}
        </div>
      </Card>

      <Card className="flex flex-col gap-3 px-4 py-5 border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Avg Daily
          </span>
          <TrendingUp className="size-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-semibold font-mono">
          {averageDaily.toLocaleString()}
        </div>
      </Card>

      <Card className="flex flex-col gap-3 px-4 py-5 border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Peak Day
          </span>
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold font-mono">
            {peakDay.toLocaleString()}
          </span>
          {topLanguage ? (
            <span className="text-xs text-muted-foreground font-mono">
              {topLanguage}
            </span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
