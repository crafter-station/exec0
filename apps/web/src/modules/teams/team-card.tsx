"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@exec0/ui/avatar";
import { Badge } from "@exec0/ui/badge";
import { Button } from "@exec0/ui/button";
import { Card } from "@exec0/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exec0/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "next-view-transitions";
import {
  IconGear2FillDuo18,
  IconTrashFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";

interface TeamCardProps {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  memberCount?: number;
  status?: "active" | "inactive";
  logo?: string;
  onDelete?: (id: string, name: string) => void;
}

export default function TeamCard({
  id,
  name,
  slug,
  createdAt,
  memberCount = 0,
  status = "active",
  logo,
  onDelete,
}: TeamCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${slug}`;

  return (
    <Card className="group flex flex-col gap-4 px-6 py-5 border-border/50 hover:border-border hover:shadow-sm transition-all duration-200 overflow-hidden">
      {/* Header with Avatar and Menu */}
      <div className="flex items-start justify-between">
        <Link href={`/${slug}`} className="flex-1">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="size-10 ring-1 ring-border/30">
              <AvatarImage src={logo || avatarUrl} alt={name} />
              <AvatarFallback className="text-xs font-semibold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono truncate">
                {slug}
              </p>
            </div>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Team options"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/${slug}/settings`} className="cursor-pointer">
                <IconGear2FillDuo18 className="size-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(id, name)}
              className="text-destructive focus:text-destructive"
            >
              <IconTrashFillDuo18 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/30" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{formatDate(createdAt)}</span>
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className="text-xs"
          >
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
