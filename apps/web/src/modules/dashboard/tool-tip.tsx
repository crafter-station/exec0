"use client";

import { ChartTooltip } from "@/components/charts";

export function UsageChartTooltip() {
  return (
    <ChartTooltip
      className="bg-card"
      rows={(point) => [
        {
          color: "var(--chart-line-primary)",
          label: "Executions",
          value: `${(point.executions as number)?.toLocaleString() ?? 0}`,
        },
      ]}
    />
  );
}
