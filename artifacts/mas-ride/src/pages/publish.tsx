import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChevronLeft, Plus, Minus } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const schema = z.object({
  vehicleType: z.string().min(1, "Select vehicle type"),
  origin: z.string().min(2, "Enter origin"),
  destination: z.string().min(2, "Enter destination"),
  departureTime: z.string().min(1, "Select time"),
  pricePerSeat: z.string().min(1, "Enter price"),
  routeComments: z.string().optional(),
  returnTime: z.string().optional(),
  returnPrice: z.string().optional(),
});

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const vehicleTypes = ["Car", "Bike", "Van", "Rickshaw"];

export default function PublishPage() {
  const [, setLocation] = useLocation();
  const addRide = useStore((s) => s.addRide);
  const currentUser = useStore((s) => s.currentUser);
  const [selectedDays, setSelectedDays] = useState<string[]>(["M", "T", "W", "T", "F"]);
  const [returnDays, setReturnDays] = useState<string[]>([]);
  const [seats, setSeats] = useState(2);
  const [hasReturn, setHasReturn] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { vehicleType: "", origin: "", destination: "", departureTime: "", pricePerSeat: "", routeComments: "", returnTime: "", returnPrice: "" },
  });

  const toggleDay = (day: string, arr: string[], set: (v: string[]) => void) => {
    set(arr.includes(day) ? arr.filter(d => d !== day) : [...arr, day]);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    addRide({
      id: `r${Date.now()}`,
      driverId: currentUser?.id || "u1",
      vehicleType: data.vehicleType,
      origin: data.origin,
      destination: data.destination,
      stops: [],
      departureTime: data.departureTime,
      days: selectedDays,
      availableSeats: seats,
      pricePerSeat: parseInt(data.pricePerSeat) || 0,
      routeComments: data.routeComments || "",
      hasReturn,
      returnTime: data.returnTime || "",
      returnPrice: parseInt(data.returnPrice || "0") || 0,
      returnDays,
      status: "active",
      passengers: [],
    });
    setLocation("/carpool");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setLocation("/home")} className="p-2 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-foreground">Publish Carpool Ride</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Vehicle Type */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Vehicle Type</p>
                <div className="grid grid-cols-4 gap-2">
                  {vehicleTypes.map((vt) => (
                    <button
                      key={vt}
                      type="button"
                      onClick={() => form.setValue("vehicleType", vt, { shouldValidate: true })}
                      data-testid={`vehicle-type-${vt.toLowerCase()}`}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-semibold border-2 transition-all",
                        form.watch("vehicleType") === vt
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-foreground"
                      )}
                    >
                      {vt}
                    </button>
                  ))}
                </div>
                {form.formState.errors.vehicleType && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.vehicleType.message}</p>
                )}
              </div>

              {/* Origin / Destination */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border space-y-3">
                <FormField control={form.control} name="origin" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. DHA Phase 5, Karachi" className="h-11 rounded-xl" data-testid="input-origin" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="destination" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">To</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. Clifton, Karachi" className="h-11 rounded-xl" data-testid="input-destination" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Time + Price */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border space-y-3">
                <FormField control={form.control} name="departureTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Departure Time</FormLabel>
                    <FormControl><Input {...field} type="time" className="h-11 rounded-xl" data-testid="input-time" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="pricePerSeat" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Per Seat Price (PKR/Day)</FormLabel>
                    <FormControl><Input {...field} type="number" placeholder="150" className="h-11 rounded-xl" data-testid="input-price" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Days */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Days of Week</p>
                <div className="flex gap-1.5">
                  {weekDays.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(d, selectedDays, setSelectedDays)}
                      data-testid={`day-${i}`}
                      className={cn(
                        "flex-1 h-9 rounded-full text-xs font-semibold transition-all",
                        selectedDays.includes(d) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seats */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground">Available Seats</p>
                  <p className="text-xs text-muted-foreground">Max 4 passengers</p>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setSeats(Math.max(1, seats - 1))} data-testid="button-seats-minus"
                    className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                    <Minus className="w-4 h-4 text-primary" />
                  </button>
                  <span className="w-6 text-center font-bold text-lg text-foreground">{seats}</span>
                  <button type="button" onClick={() => setSeats(Math.min(4, seats + 1))} data-testid="button-seats-plus"
                    className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                <FormField control={form.control} name="routeComments" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Route Comments</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Meeting point, special instructions..." className="rounded-xl min-h-[72px] resize-none" data-testid="input-comments" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              {/* Return toggle */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">Return Ride</p>
                    <p className="text-xs text-muted-foreground">Offer a return trip</p>
                  </div>
                  <Switch checked={hasReturn} onCheckedChange={setHasReturn} data-testid="switch-return" />
                </div>
                {hasReturn && (
                  <div className="mt-4 space-y-3 pt-4 border-t border-border">
                    <FormField control={form.control} name="returnTime" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Return Time</FormLabel>
                        <FormControl><Input {...field} type="time" className="h-11 rounded-xl" data-testid="input-return-time" /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="returnPrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Return Price (PKR/Day)</FormLabel>
                        <FormControl><Input {...field} type="number" placeholder="150" className="h-11 rounded-xl" data-testid="input-return-price" /></FormControl>
                      </FormItem>
                    )} />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Return Days</p>
                      <div className="flex gap-1.5">
                        {weekDays.map((d, i) => (
                          <button key={i} type="button" onClick={() => toggleDay(d, returnDays, setReturnDays)}
                            className={cn("flex-1 h-9 rounded-full text-xs font-semibold transition-all",
                              returnDays.includes(d) ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full h-12 rounded-2xl text-base font-semibold" data-testid="button-publish">
                Publish Ride
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PhoneFrame>
  );
}
