"use client";

import { DropdownMenuItem } from "@exec0/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { IconLightbulb3FillDuo18 } from "nucleo-ui-essential-fill-duo-18";
export default function ThemeToggleText() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <IconLightbulb3FillDuo18 />
      Theme
    </DropdownMenuItem>
  );
}
