"use client";

import { Button } from "@exec0/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@exec0/ui/dialog";
import { Input } from "@exec0/ui/input";
import { Label } from "@exec0/ui/label";
import { IconPlusFillDuo18 } from "nucleo-ui-essential-fill-duo-18";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createOrganization } from "./actions";

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTeamModal({
  open,
  onOpenChange,
}: CreateTeamModalProps) {
  const [state, formAction, isPending] = useActionState(
    createOrganization,
    null,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.message);
      onOpenChange(false);
    }
  }, [state, mounted, onOpenChange]);

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPlusFillDuo18 className="size-5" />
            Create a new team
          </DialogTitle>
          <DialogDescription>
            Set up a new team to organize and collaborate on projects.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Team name
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="My awesome team"
              required
              disabled={isPending}
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              This will be displayed as your team's name across the app.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Team slug
            </Label>
            <Input
              id="slug"
              type="text"
              name="slug"
              placeholder="my-awesome-team"
              required
              disabled={isPending}
              className="h-9 font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs (e.g., my-awesome-team.app). Can only contain
              lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 h-9"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 h-9">
              {isPending ? "Creating..." : "Create team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
