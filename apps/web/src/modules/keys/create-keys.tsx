"use client";
import { Button } from "@exec0/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exec0/ui/dialog";
import { Input } from "@exec0/ui/input";
import { Label } from "@exec0/ui/label";
import { Switch } from "@exec0/ui/switch";
import { Textarea } from "@exec0/ui/textarea";
import {
  IconCalendarFillDuo18,
  IconCircleInfoFillDuo18,
  IconPlusFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";
import { Calendar } from "@exec0/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@exec0/ui/popover";
import { useState, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createApiKey } from "./actions";
import { Spinner } from "@exec0/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@exec0/ui/alert";

export function CreateApiKeyDialog({ slug }: { slug: string }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState("");
  const [state, action, pending] = useActionState(createApiKey, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      setCreateOpen(false);
      setSuccessOpen(true);
      setName("");
      setDate(undefined);
    }
  }, [state]);

  const today = new Date();
  const year = today.getFullYear();

  return (
    <>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <IconPlusFillDuo18 className="size-5" />
            Create API Key
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-150 p-0 shadow-xl">
          <form action={action}>
            <div className="px-4 space-y-3 w-full py-4">
              <DialogHeader>
                <DialogTitle>Add API Key</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Input
                    name="api-key-name"
                    placeholder="API Key Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-none dark:bg-transparent bg-transparent w-full shadow-none outline-none text-2xl font-medium px-0 h-auto focus-visible:ring-0"
                  />
                </div>
                <div className="grid gap-3">
                  <Textarea
                    placeholder="Add description..."
                    name="api-key-description"
                    className="border-none dark:bg-transparent bg-transparent w-full shadow-none outline-none resize-none px-0 min-h-12 focus-visible:ring-0"
                  />
                </div>

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-min justify-between"
                      type="button"
                    >
                      <IconCalendarFillDuo18 />
                      {date ? date.toLocaleDateString() : "Expires at"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      disabled={{ before: today }}
                      startMonth={new Date(year, 0)}
                      endMonth={new Date(year + 50, 0)}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setCalendarOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <input
                  type="hidden"
                  name="api-key-expires-at"
                  value={date ? date.toISOString() : ""}
                />
                <input type="hidden" name="api-key-slug" value={slug} />
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5 px-4 w-full border-t bg-card rounded-b-md">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  defaultChecked={true}
                  name="api-key-enable"
                />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
              <div className="flex items-center gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={pending || !name.trim()}>
                  {pending ? <Spinner /> : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="w-full sm:max-w-130 p-0 shadow-xl">
          <div className="px-4 space-y-4 w-full py-6">
            <DialogHeader>
              <DialogTitle>View API Key</DialogTitle>
            </DialogHeader>
            <Alert className="border-sky-400/50 bg-sky-600/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
              <IconCircleInfoFillDuo18 />
              <AlertTitle>You can only see this key once. </AlertTitle>
              <AlertDescription className="text-sky-600/80 dark:text-sky-400/80">
                Store it safely.
              </AlertDescription>
            </Alert>
            {state?.data && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="">API Key</Label>
                  <Input
                    readOnly
                    value={state.data}
                    className="text-lg"
                    type="text"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 py-2.5 px-4 w-full border-t bg-card rounded-b-md">
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
