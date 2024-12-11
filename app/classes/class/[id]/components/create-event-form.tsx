"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { PlusCircle } from "lucide-react";
import { createEvent } from "@/actions/class";
import { useToast } from "@/hooks/use-toast";
import { useActionState, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  isLocationBased: z.boolean(),
  location: z.string().optional(),
  proximity: z
    .number()
    .min(50, "Proximity must be at least 50 meters")
    .optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function CreateEventForm({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [location, setLocation] = useState<string | null>(null);

  const initialState = {
    message: "",
    success: true,
  };

  const [state, formAction, isPending] = useActionState(
    createEvent,
    initialState
  );

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      isLocationBased: false,
      proximity: 50,
    },
  });

  const { isLocationBased } = form.watch();

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);
  
  
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
  
      if (state.success) {
        setOpen(false);
        resetForm();
      }
    }
  }, [state, toast]);
  
  
  

  const fetchLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLocation(`${lat},${lng}`);
      } catch (error) {
        console.error("Error fetching location:", error);
        toast({
          title: "Error",
          description: "Failed to fetch location. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <PlusCircle className="h-5 w-5" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ScrollArea className="max-h-[80vh] mx-2">
          <DialogHeader>
            <DialogTitle>Create a New Event</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              action={async (formData: FormData) => {
                formData.set("isLocationBased", isLocationBased.toString());
                await formAction(formData);
              }}
              className="space-y-4 mx-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isLocationBased"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Location Based
                      </FormLabel>
                      <FormDescription>
                        Enable if this event is location-based
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isLocationBased && (
                <>
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormDescription>
                      {location
                        ? `Current location: ${location}`
                        : "No location set"}
                    </FormDescription>
                    <FormControl>
                      <Button type="button" onClick={fetchLocation}>
                        {location ? "Update Location" : "Get Location"}
                      </Button>
                    </FormControl>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="proximity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proximity (in meters)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum proximity is 50 meters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <input type="hidden" name="id" value={id} />
              {location && (
                <input type="hidden" name="location" value={location} />
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
