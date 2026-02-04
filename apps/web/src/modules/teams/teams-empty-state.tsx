"use client";

import { Button } from "@exec0/ui/button";
import { Card } from "@exec0/ui/card";
import { ArrowRight } from "lucide-react";
import { IconOfficeFillDuo18 } from "nucleo-ui-essential-fill-duo-18";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function TeamsEmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md border-border/50 px-8 py-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-secondary rounded-lg">
            <IconOfficeFillDuo18 className="size-6 text-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No teams yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create your first team to get started. Teams help you organize and
          collaborate on projects.
        </p>
        <Button onClick={onCreateClick} className="w-full gap-2">
          Create your first team
          <ArrowRight className="size-4" />
        </Button>
      </Card>
    </div>
  );
}
