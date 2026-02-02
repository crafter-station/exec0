"use client";
import { Spinner } from "@exec0/ui/spinner";
import { useTheme } from "next-themes";
import {
  IconBugFillDuo18,
  IconCircleInfoFillDuo18,
  IconTasks2FillDuo18,
  IconTriangleWarningFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";
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
