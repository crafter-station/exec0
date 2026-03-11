"use client";

import { Card } from "@exec0/ui/components/card";
import {
  Area,
  AreaChart,
  ChartTooltip,
  Grid,
  XAxis,
} from "@/components/charts";

export interface UsageChartData extends Record<string, unknown> {
  date: Date;
  executions: number;
}

interface UsageChartProps {
  data: UsageChartData[];
}

export function UsageChart({ data }: UsageChartProps) {
  if (data.length === 0) {
    return (
      <Card className="w-full h-64 flex items-center justify-center border-border/50">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No execution data yet
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-xs">
            Usage data will appear here once API calls are made with your keys
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border/50">
      <div className="w-full">
        <AreaChart data={data}>
          <Grid horizontal />
          <Area
            dataKey="executions"
            fill="var(--chart-line-primary)"
            fillOpacity={0.3}
            fadeEdges
          />
          <XAxis />
          <UsageTooltip />
        </AreaChart>
      </div>
    </Card>
  );
}

function UsageTooltip() {
  return (
    <ChartTooltip
      className="bg-card"
      rows={(point) => [
        {
          color: "var(--chart-line-primary)",
          label: "Executions",
          value: (point.executions as number)?.toLocaleString() ?? "0",
        },
      ]}
    />
  );
}
