import { useState } from "react";
import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { Clock } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export default function MyRidesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [, setLocation] = useLocation();
  const rides = useStore((s) => s.rides);
  const currentUser = useStore((s) => s.currentUser);

  const myRides = rides.filter((r) =>
    r.driverId === currentUser?.id || (currentUser && r.passengers.includes(currentUser.id))
  );
  const displayed = activeTab === "active"
    ? myRides.filter(r => r.status === "active")
    : myRides.filter(r => r.status !== "active");

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-0 shadow-sm">
          <h1 className="font-bold text-xl text-foreground mb-4">My Rides</h1>
          <div className="flex gap-6">
            {(["active", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-myrides-${tab}`}
                className={cn(
                  "pb-3 text-sm font-semibold border-b-2 transition-all",
                  activeTab === tab ? "text-primary border-primary" : "text-muted-foreground border-transparent"
                )}
              >
                {tab === "active" ? "Active Rides" : "History"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-3">
          {displayed.length === 0 && (
            <div className="text-center py-16">
              <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No {activeTab === "active" ? "active" : "past"} rides</p>
            </div>
          )}
          {displayed.map((ride) => {
            const isDriver = ride.driverId === currentUser?.id;
            const status = statusConfig[ride.status] || statusConfig.active;
            return (
              <div
                key={ride.id}
                onClick={() => setLocation(`/carpool/${ride.id}`)}
                data-testid={`myride-card-${ride.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", isDriver ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600")}>
                    {isDriver ? "DRIVER" : "PASSENGER"}
                  </span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", status.color)}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-stretch gap-3 mb-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-0.5" />
                    <div className="flex-1 w-0.5 border-l-2 border-dashed border-primary/30 my-1 min-h-[20px]" />
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-primary mb-0.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{ride.origin}</p>
                    <p className="text-sm font-medium text-foreground mt-2">{ride.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ride.departureTime}</span>
                  </div>
                  <span className="ml-auto text-sm font-bold text-primary">PKR {ride.pricePerSeat}/day</span>
                </div>
              </div>
            );
          })}
        </div>

        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
