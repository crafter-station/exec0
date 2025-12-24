"use client";

import { useTheme } from "next-themes";
import { IconLightbulb3FillDuo18 } from "nucleo-ui-essential-fill-duo-18";
import { Button } from "@exec0/ui/button";
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <IconLightbulb3FillDuo18 />
    </Button>
  );
}
