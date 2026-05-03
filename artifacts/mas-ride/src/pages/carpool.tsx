import { useState } from "react";
import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, SlidersHorizontal, Star, Clock, Users, PlusCircle } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

export default function CarpoolPage() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const rides = useStore((s) => s.rides);
  const users = useStore((s) => s.users);
  const currentUser = useStore((s) => s.currentUser);

  const filtered = rides.filter(r =>
    query === "" ||
    r.origin.toLowerCase().includes(query.toLowerCase()) ||
    r.destination.toLowerCase().includes(query.toLowerCase())
  );

  const getDriver = (id: string) => users.find(u => u.id === id);
  const isMyRide = (driverId: string) => driverId === currentUser?.id;

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 shadow-sm">
          <h1 className="text-xl font-bold text-foreground mb-4">MAS Carpool</h1>
          <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search origin or destination..."
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              data-testid="input-search-carpool"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground text-xs">Clear</button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No rides found</p>
            </div>
          )}
          {filtered.map((ride) => {
            const driver = getDriver(ride.driverId);
            const driving = isMyRide(ride.driverId);
            return (
              <div
                key={ride.id}
                onClick={() => setLocation(`/carpool/${ride.id}`)}
                data-testid={`ride-card-${ride.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {driver?.name.substring(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{driver?.name || "Unknown"}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">{driver?.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-full tracking-wide",
                    driving ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {driving ? "DRIVING" : "PASSENGER"}
                  </span>
                </div>

                <div className="flex items-stretch gap-3 mb-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-0.5" />
                    <div className="flex-1 w-0.5 border-l-2 border-dashed border-primary/30 my-1 min-h-[24px]" />
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-primary mb-0.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground leading-tight">{ride.origin}</p>
                    {ride.stops.length > 0 && (
                      <p className="text-xs text-muted-foreground my-1.5">{ride.stops.length} stop{ride.stops.length > 1 ? "s" : ""}: {ride.stops.join(", ")}</p>
                    )}
                    <p className="text-sm font-medium text-foreground leading-tight mt-1">{ride.destination}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ride.departureTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{ride.availableSeats} seats</span>
                  </div>
                  <span className="ml-auto text-sm font-bold text-primary">{ride.pricePerSeat} PKR/day</span>
                </div>

                {ride.routeComments && (
                  <p className="text-xs text-muted-foreground mt-2 bg-muted rounded-xl px-3 py-2 line-clamp-1">{ride.routeComments}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* FAB */}
        <button
          onClick={() => setLocation("/publish")}
          data-testid="button-fab-publish"
          className="absolute bottom-20 right-5 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
        >
          <PlusCircle className="w-5 h-5 text-white" />
        </button>

        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
