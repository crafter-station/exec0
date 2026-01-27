"use client";

import { authClient } from "@exec0/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@exec0/ui/avatar";
import { Button } from "@exec0/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exec0/ui/dropdown-menu";
import { Link } from "next-view-transitions";
import {
  IconArrowDoorOut3FillDuo18,
  IconChevronDownFillDuo18,
  IconGear2FillDuo18,
  IconOfficeFillDuo18,
  IconUserFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";
import ThemeToggleText from "@/components/mode-togle-text";
import { getCachedOrgSlug } from "@/hooks/use-org-slug";
import { GithubIcon } from "@exec0/ui/assets";
import ModeToggle from "@/components/mode-toggle";

export function NavbarButtons() {
  const { data: session } = authClient.useSession();
  const slug = getCachedOrgSlug();

  if (!session) {
    return (
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button variant="outline" size="sm" asChild>
          <Link href="https://github.com/crafter-station/exec0">
            <GithubIcon />
            Github
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="sm" asChild>
        <Link href={slug ? `/${slug}` : "/teams"}>
          <IconOfficeFillDuo18 />
          Dashboard
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="avatar">
            <IconChevronDownFillDuo18 className="size-3.5 text-muted-foreground" />
            <Avatar className="size-7">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/glass/svg?seed=${session.user.id}`}
                alt={session.user.name || "User"}
              />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <IconGear2FillDuo18 />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <IconUserFillDuo18 />
              Profile
            </Link>
          </DropdownMenuItem>

          <ThemeToggleText />

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout">
              <IconArrowDoorOut3FillDuo18 />
              Logout
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
