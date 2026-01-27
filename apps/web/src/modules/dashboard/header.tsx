import ThemeToggleText from "@/components/mode-togle-text";
import { Logo } from "@exec0/ui/assets";
import { Avatar, AvatarFallback, AvatarImage } from "@exec0/ui/avatar";
import { Button } from "@exec0/ui/button";
import { Separator } from "@exec0/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exec0/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@exec0/ui/breadcrumb";
import { Link } from "next-view-transitions";
import {
  IconArrowDoorOut3FillDuo18,
  IconChevronDownFillDuo18,
  IconChevronExpandYFillDuo18,
  IconGear2FillDuo18,
  IconOfficeFillDuo18,
  IconUserFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";
import type { auth } from "@exec0/auth";
import BreadcrumbNavigation from "./breadcrumb-navigation";
import OrgSlugSync from "./org-slug-sync";

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
export type Organization = Awaited<
  ReturnType<typeof auth.api.listOrganizations>
>[number];

interface HeaderDashboardProps {
  organizations: Organization[];
  currentOrg: Organization;
  user: User;
}
// https://github.com/vercel-labs/next-skills/blob/main/skills/next-best-practices/rsc-boundaries.md
export default function HeaderDashboard({
  organizations,
  currentOrg,
  user,
}: HeaderDashboardProps) {
  return (
    <div>
      <OrgSlugSync slug={currentOrg.slug} />
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <Logo size="32px" className="logo" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="text-muted text-2xl px-2">/</span>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="flex items-center gap-2">
                  <Link href={`/${currentOrg?.slug}`}>
                    <Avatar className="size-7">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${currentOrg?.slug}`}
                        alt={currentOrg?.name}
                      />
                      <AvatarFallback>Ex</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium font-mono text-primary">
                      {currentOrg?.name || "Organization"}
                    </span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-6">
                      <IconChevronExpandYFillDuo18 className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    <div className="flex items-center gap-2 ml-2 mb-1">
                      <IconOfficeFillDuo18 className="size-5" />
                      <h1 className="font-mono text-sm text-muted-foreground">
                        Teams
                      </h1>
                    </div>
                    <Separator className="mt-1 mb-0.5" />
                    {organizations.map((org) => (
                      <DropdownMenuItem key={org.id} asChild>
                        <Link href={`/${org.slug}`} className="cursor-pointer">
                          <Avatar className="size-5.5">
                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/glass/svg?seed=${org.slug}`}
                              alt={org.name}
                            />
                            <AvatarFallback>Ex</AvatarFallback>
                          </Avatar>
                          {org.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbNavigation />
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="avatar">
              <IconChevronDownFillDuo18 className="size-3.5 text-muted-foreground" />
              <Avatar className="size-7">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.id}`}
                  alt={user.name || "User"}
                />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || "U"}
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
    </div>
  );
}
