"use client";

import { Button } from "@exec0/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exec0/ui/card";
import { Input } from "@exec0/ui/input";
import { Label } from "@exec0/ui/label";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createOrganization } from "./actions";

export default function TeamsCreate() {
  const [state, formAction, isPending] = useActionState(
    createOrganization,
    null,
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Crear organización</CardTitle>
        <CardDescription>Configura una nueva organización</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Mi organización"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              type="text"
              name="slug"
              placeholder="mi-org"
              required
              disabled={isPending}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creando..." : "Crear"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
