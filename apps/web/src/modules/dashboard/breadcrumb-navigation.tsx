"use client";

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@exec0/ui/breadcrumb";
import { usePathname } from "next/navigation";
import {
  IconVault3FillDuo18,
  IconWindowChartLineFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";

export default function BreadcrumbNavigation() {
  const pathname = usePathname();
  const isKeysRoute = pathname.includes("/keys");
  const isUsageRoute = pathname.includes("/usage");

  if (!isKeysRoute && !isUsageRoute) {
    return null;
  }

  return (
    <>
      <BreadcrumbSeparator>
        <span className="text-muted text-2xl pr-1.5">/</span>
      </BreadcrumbSeparator>
      {isKeysRoute && (
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2 text-sm font-medium font-mono">
            <IconVault3FillDuo18 className="size-5.5 key-breadcrumb-icon" />
            <span className="key-breadcrumb-title">Keys</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      )}
      {isUsageRoute && (
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2 text-sm font-medium font-mono">
            <IconWindowChartLineFillDuo18 className="size-5.5 chart-breadcrumb-icon" />
            <span className="chart-breadcrumb-title">Usage</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      )}
    </>
  );
}
