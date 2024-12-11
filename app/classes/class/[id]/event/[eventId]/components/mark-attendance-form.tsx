"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { markAttendance } from "@/actions/class";
import { useToast } from "@/hooks/use-toast";
import { useActionState, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

const eventSchema = z.object({
  location: z.string().optional(),
  evlocationLat: z.number(),
  evlocationLng: z.number(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function MarkAttendanceForm({ id, evlocationLat, evlocationLng }: { id: string, evlocationLat: number, evlocationLng: number }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [location, setLocation] = useState<string | null>(null);

  const initialState = {
    message: "",
    success: true,
  };

  const [state, formAction, isPending] = useActionState(
    markAttendance,
    initialState
  );

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {},
  });

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
          setLocation(null)
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <PlusCircle className="h-5 w-5" />
          Mark attendance Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ScrollArea className="max-h-[80vh] mx-2">
          <DialogHeader>
            <DialogTitle>Mark your presence</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              action={async (formData: FormData) => {
                await formAction(formData);
              }}
              className="space-y-4 mx-3"
            >
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

              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="evlocationLat" value={evlocationLat} />
              <input type="hidden" name="evlocationLng" value={evlocationLng} />
              {location && (
                <input type="hidden" name="location" value={location} />
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "submitting..." : "Mark Attendance"}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
