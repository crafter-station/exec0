import { Card } from "@exec0/ui/card";
import { Link } from "next-view-transitions";
import {
  IconChevronExpandYFillDuo18,
  IconGamingButtonsFillDuo18,
  IconMoneyBillCoinFillDuo18,
  IconOfficeFillDuo18,
  IconVault3FillDuo18,
  IconWindowChartLineFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recentProjects = [
    { name: "finwise", path: "/inspector" },
    { name: "raggy", path: "/raggy" },
    { name: "splashPage", path: "/splashPage" },
    {
      name: "inspector",
      path: "/inspector",
    },
    { name: "langchain", path: "/bizchat" },
  ];

  return (
    <div>
      {/* Action Cards */}
      <div className="mb-12 grid grid-cols-3 gap-4">
        <Link href={`/${slug}/keys`}>
          <Card className="flex flex-col gap-2 px-6 border-border/50 hover:border-border transition duration-100">
            <IconVault3FillDuo18 className="size-6 key-breadcrumb-icon" />
            <span className="text-sm font-semibold font-mono key-breadcrumb-title">
              Keys
            </span>
          </Card>
        </Link>
        <Link href={`/${slug}/usage`}>
          <Card className="flex flex-col gap-2 px-6 border-border/50 hover:border-border transition duration-100">
            <IconWindowChartLineFillDuo18 className="size-6" />
            <span className="text-sm font-semibold font-mono">
              Current Usage
            </span>
          </Card>
        </Link>
        <Link href={`/${slug}/playground`}>
          <Card className="flex flex-col gap-2 px-6 border-border/50 hover:border-border transition duration-100">
            <IconGamingButtonsFillDuo18 className="size-6" />
            <span className="text-sm font-semibold font-mono">Playground</span>
          </Card>
        </Link>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Recent keys</h2>
          <div className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            View all (12)
          </div>
        </div>

        <div className="space-y-1">
          {recentProjects.map((project, index) => (
            <div
              key={index}
              className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-secondary"
            >
              <span className="text-sm text-foreground">{project.name}</span>
              <span className="text-xs text-muted-foreground">
                {project.path}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
