import { AreaChart, Area, Grid, XAxis } from "@/components/charts";
import { Card } from "@exec0/ui/components/card";
import { AreaTooltipDemo } from "./tool-tip";

export const chartData = [
  {
    date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    revenue: 12000,
    costs: 8500,
  },
  {
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    revenue: 13500,
    costs: 9200,
  },
  {
    date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    revenue: 11000,
    costs: 7800,
  },
  {
    date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
    revenue: 14500,
    costs: 10100,
  },
  {
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    revenue: 13800,
    costs: 9400,
  },
  {
    date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
    revenue: 15200,
    costs: 10800,
  },
  {
    date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    revenue: 16000,
    costs: 11200,
  },
  {
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    revenue: 14800,
    costs: 10500,
  },
  {
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    revenue: 15500,
    costs: 10900,
  },
  {
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    revenue: 14200,
    costs: 9800,
  },
  {
    date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    revenue: 16800,
    costs: 11800,
  },
  {
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    revenue: 17500,
    costs: 12400,
  },
  {
    date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
    revenue: 16200,
    costs: 11500,
  },
  {
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
    revenue: 15800,
    costs: 11200,
  },
  {
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    revenue: 17200,
    costs: 12100,
  },
  {
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    revenue: 18500,
    costs: 13200,
  },
  {
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    revenue: 17800,
    costs: 12600,
  },
  {
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    revenue: 16500,
    costs: 11700,
  },
  {
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    revenue: 19200,
    costs: 13800,
  },
  {
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    revenue: 18800,
    costs: 13400,
  },
  {
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    revenue: 17500,
    costs: 12400,
  },
  {
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    revenue: 19800,
    costs: 14200,
  },
  {
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    revenue: 20500,
    costs: 14800,
  },
  {
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    revenue: 19200,
    costs: 13600,
  },
  {
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    revenue: 21000,
    costs: 15200,
  },
  {
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    revenue: 21800,
    costs: 15800,
  },
  {
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    revenue: 20500,
    costs: 14600,
  },
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    revenue: 22500,
    costs: 16200,
  },
  {
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    revenue: 23200,
    costs: 16800,
  },
  { date: new Date(), revenue: 24000, costs: 17400 },
]

export default function RevenueChart() {
  return (
    <Card className="">
      <div className="w-full">
          <AreaChart data={chartData}>
            <Grid horizontal />
            <Area dataKey="revenue" fill="var(--chart-line-primary)" fillOpacity={0.3} fadeEdges />
            <Area dataKey="costs" fill="var(--chart-line-secondary)" fillOpacity={0.3} fadeEdges />
            <XAxis />
            <AreaTooltipDemo />
          </AreaChart>
        </div>
    </Card>
  );
}
