"use client";
import DottedMap from "dotted-map";
import { Activity, BotMessageSquare, Map as MapIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function FeaturesSection() {
  return (
    <section className="px-4">
      <div className="mx-auto grid border md:grid-cols-2">
        <div>
          <div className="p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapIcon className="size-4" />
              Elastic compute with zero manual tuning.
            </span>

            <p className="mt-8 text-2xl font-semibold">
              Scale from one run to millions automatically.
            </p>
          </div>

          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="rounded-(--radius) bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
                <span className="text-lg">🇨🇴</span> Last run in Colombia
              </div>
              <div className="rounded-(--radius) bg-background absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-zinc-900"></div>
            </div>

            <div className="relative overflow-hidden">
              <div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%"></div>
              <MapComponent />
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l dark:bg-transparent">
          <div className="relative z-10">
            <span className="text-muted-foreground flex items-center gap-2">
              <BotMessageSquare className="size-4" />A runtime agents can trust
              in production.
            </span>

            <p className="my-8 text-2xl font-semibold">
              Designed for autonomous agents that write and run code.
            </p>
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-5 rounded-full border"></span>
                <span className="text-muted-foreground text-xs">
                  Sat 22 Feb
                </span>
              </div>
              <div className="rounded-(--radius) bg-background mt-1.5 w-3/5 border p-3 text-xs">
                Hey, calculate the sum of 23 and 42 for me.
              </div>
            </div>

            <div>
              <div className="rounded-(--radius) mb-1 ml-auto w-3/5 bg-blue-600 p-3 text-xs text-white">
                Sure! The sum of 23 and 42 is 65. (Execute tool)
              </div>
              <span className="text-muted-foreground block text-right text-xs">
                Now
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-full border-y p-12">
          <p className="text-center text-4xl font-semibold lg:text-7xl">
            Simple and fast
          </p>
        </div>
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" />
              Activity
            </span>

            <p className="my-8 text-2xl font-semibold">
              Monitor your executions in real-time.
              <span className="text-muted-foreground">
                {" "}
                See how many runs are happening at any given moment.
              </span>
            </p>
          </div>
          <MonitoringChart />
        </div>
      </div>
    </section>
  );
}

const map = new DottedMap({ height: 55, grid: "diagonal" });

const points = map.getPoints();

const svgOptions = {
  backgroundColor: "var(--color-background)",
  color: "currentColor",
  radius: 0.15,
};

const MapComponent = () => {
  const viewBox = `0 0 120 60`;
  return (
    <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
      <title>A</title>
      {points.map((point) => (
        <circle
          key={`${point.x}-${point.y}`}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  );
};

const chartData = [
  { month: "May", nano: 56, small: 224 },
  { month: "June", nano: 56, small: 224 },
  { month: "January", nano: 126, small: 252 },
  { month: "February", nano: 205, small: 410 },
  { month: "March", nano: 200, small: 126 },
  { month: "April", nano: 400, small: 800 },
];

const chartConfig = {
  nano: {
    label: "Nano",
    color: "#2563eb",
  },
  small: {
    label: "Small",
    color: "#60a5fa",
  },
  medium: {
    label: "Medium",
    color: "#3b82f6",
  },
  large: {
    label: "Large",
    color: "#1d4ed8",
  },
  xlarge: {
    label: "XLarge",
    color: "#1e40af",
  },
} satisfies ChartConfig;

const MonitoringChart = () => {
  return (
    <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <defs>
          <linearGradient id="fillNano" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-nano)" stopOpacity={0.8} />
            <stop
              offset="55%"
              stopColor="var(--color-nano)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillSmall" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-small)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-small)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <Area
          strokeWidth={2}
          dataKey="nano"
          type="stepBefore"
          fill="url(#fillNano)"
          fillOpacity={0.1}
          stroke="var(--color-nano)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="small"
          type="stepBefore"
          fill="url(#fillSmall)"
          fillOpacity={0.1}
          stroke="var(--color-small)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
