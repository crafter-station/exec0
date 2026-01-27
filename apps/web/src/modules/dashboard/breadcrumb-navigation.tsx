"use client";

import { usePathname } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@exec0/ui/breadcrumb";
import { IconVault3FillDuo18 } from "nucleo-ui-essential-fill-duo-18";

export default function BreadcrumbNavigation() {
  const pathname = usePathname();
  const isKeysRoute = pathname.includes("/keys");

  if (!isKeysRoute) {
    return null;
  }

  return (
    <>
      <BreadcrumbSeparator>
        <span className="text-muted text-2xl pr-1.5">/</span>
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage className="flex items-center gap-2 text-sm font-medium font-mono">
          <IconVault3FillDuo18 className="size-5.5 key-breadcrumb-icon" />
          <span className="key-breadcrumb-title">Keys</span>
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}
