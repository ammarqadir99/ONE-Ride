import { useLocation, useParams } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, MapPin, Phone, MessageCircle, ShieldCheck, Clock, Users, Hash, Banknote, AlertTriangle } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const allDays = ["M", "T", "W", "T", "F", "S", "S"];

export default function CarpoolDetailPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const rides = useStore((s) => s.rides);
  const users = useStore((s) => s.users);
  const joinRide = useStore((s) => s.joinRide);
  const currentUser = useStore((s) => s.currentUser);

  const ride = rides.find((r) => r.id === params.id);
  if (!ride) return (
    <PhoneFrame>
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-muted-foreground">Ride not found</p>
      </div>
    </PhoneFrame>
  );

  const driver = users.find((u) => u.id === ride.driverId);
  const isJoined = currentUser ? ride.passengers.includes(currentUser.id) : false;
  const isOwner = currentUser?.id === ride.driverId;

  const handleJoin = () => {
    if (!isJoined && !isOwner) joinRide(ride.id);
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setLocation("/carpool")} data-testid="button-back" className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-foreground">Ride Details</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-3">
          {/* Driver Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {driver?.name.substring(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold text-foreground">{driver?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm text-muted-foreground">{driver?.rating} • {driver?.totalRides} rides</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{ride.departureTime}</p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-4">Trip Details</h3>
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <MapPin className="w-4 h-4 text-primary fill-primary/20 flex-shrink-0" />
                <div className="flex-1 w-0.5 border-l-2 border-dashed border-primary/30 my-1 min-h-[32px]" />
                <MapPin className="w-4 h-4 text-foreground flex-shrink-0" />
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <p className="font-semibold text-sm text-foreground">{ride.origin}</p>
                  <p className="text-xs text-muted-foreground">Origin</p>
                </div>
                {ride.stops.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">{ride.stops.join(" → ")}</p>
                    <p className="text-xs text-muted-foreground">{ride.stops.length} stop{ride.stops.length > 1 ? "s" : ""}</p>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-foreground">{ride.destination}</p>
                  <p className="text-xs text-muted-foreground">Destination</p>
                </div>
              </div>
            </div>
            {ride.routeComments && (
              <div className="mt-4 bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{ride.routeComments}</p>
              </div>
            )}
          </div>

          {/* Map placeholder */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border h-36 relative">
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #e8f4f8 0%, #d4edda 50%, #c3e6cb 100%)" }}>
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 6 }).map((_, row) => (
                  <div key={row} className="flex">
                    {Array.from({ length: 8 }).map((_, col) => (
                      <div key={col} className="flex-1 border border-blue-400/30 h-6" />
                    ))}
                  </div>
                ))}
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600 bg-white/80 px-3 py-1 rounded-full font-medium shadow-sm">Route Map</span>
              </div>
            </div>
          </div>

          {/* Detail rows */}
          <div className="space-y-2">
            {[
              { icon: Hash, label: "Ride ID", value: ride.id.toUpperCase() },
              { icon: Users, label: "Available Seats", value: `${ride.availableSeats} seats` },
              { icon: Clock, label: "Departure Time", value: ride.departureTime },
              { icon: Banknote, label: "Per Seat Price", value: `PKR ${ride.pricePerSeat}/day` },
            ].map((row) => (
              <div key={row.label} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-border flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <row.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="font-semibold text-sm text-foreground">{row.value}</p>
                </div>
              </div>
            ))}

            {/* Days */}
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-border">
              <p className="text-xs text-muted-foreground mb-2">Operating Days</p>
              <div className="flex gap-1.5">
                {allDays.map((d, i) => (
                  <div key={i} className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                    ride.days.includes(d) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Return Ride */}
          {ride.hasReturn && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
              <h3 className="font-semibold text-sm mb-3 text-foreground">Return Ride</h3>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Return Time</p>
                  <p className="font-semibold">{ride.returnTime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Return Price</p>
                  <p className="font-semibold">PKR {ride.returnPrice}/day</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {allDays.map((d, i) => (
                  <div key={i} className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                    ride.returnDays.includes(d) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-amber-800">Your Safety Matters To Us!</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-700">
              {[
                "Verify driver information before boarding",
                "Communicate directly through the app",
                "Check reviews and ratings carefully",
                "Practice caution when meeting strangers",
                "Payments — pay only through platform",
                "ONE Ride is not liable for disputes",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 bg-white border-t border-border px-5 py-3 flex gap-3">
          <Button
            onClick={handleJoin}
            disabled={isOwner || isJoined}
            className="flex-1 h-11 rounded-2xl font-semibold text-sm"
            data-testid="button-join-ride"
          >
            {isOwner ? "Your Ride" : isJoined ? "Joined" : "Join Ride"}
          </Button>
          <button
            onClick={() => setLocation("/chat")}
            className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
            data-testid="button-call"
          >
            <Phone className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => setLocation("/chat")}
            className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
            data-testid="button-message"
          >
            <MessageCircle className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
