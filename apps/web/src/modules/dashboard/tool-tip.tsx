"use client";

import { ChartTooltip } from "@/components/charts";

export function AreaTooltipDemo() {
  return (
    <ChartTooltip
      className="bg-card"
      rows={(point) => [
        {
          color: "var(--chart-line-primary)",
          label: "Lite",
          value: `$${(point.revenue as number)?.toLocaleString() ?? 0}`,
        },
        {
          color: "var(--chart-line-secondary)",
          label: "Basic",
          value: `$${(point.costs as number)?.toLocaleString() ?? 0}`,
        },
      ]}
    />
  );
}
