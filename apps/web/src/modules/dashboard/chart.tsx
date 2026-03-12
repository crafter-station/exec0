import { Card } from "@exec0/ui/components/card";
import { IconWindowChartLineFillDuo18 } from "nucleo-ui-essential-fill-duo-18";

export default function UsageChart() {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      <IconWindowChartLineFillDuo18 className="size-8 text-muted-foreground mb-3" />
      <p className="text-sm font-medium text-foreground mb-1">
        No usage data yet
      </p>
      <p className="text-xs text-muted-foreground max-w-xs">
        Usage metrics will appear here once you start making API calls with your
        keys.
      </p>
    </Card>
  );
}
