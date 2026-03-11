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
