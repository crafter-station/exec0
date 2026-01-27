"use client";
import { useTheme } from "next-themes";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";
import {
  IconTriangleWarningFillDuo18,
  IconTasks2FillDuo18,
  IconCircleInfoFillDuo18,
  IconBugFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";
import { Spinner } from "@exec0/ui/spinner";
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme as ToasterProps["theme"]}
      richColors
      icons={{
        success: <IconTasks2FillDuo18 />,
        info: <IconCircleInfoFillDuo18 />,
        warning: <IconTriangleWarningFillDuo18 />,
        error: <IconBugFillDuo18 />,
        loading: <Spinner />,
      }}
    />
  );
}
