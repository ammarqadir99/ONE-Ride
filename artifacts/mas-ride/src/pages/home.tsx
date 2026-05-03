import { useState } from "react";
import { useLocation } from "wouter";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Car, Bike, Truck, AlertCircle, Shield, Info, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";

const vehicleTypes = [
  { label: "Car", icon: Car },
  { label: "Bike", icon: Bike },
  { label: "Van", icon: Truck },
  { label: "Rickshaw", icon: Car },
];

const safetyTips = [
  { icon: Shield, title: "Verify Identity", desc: "Always verify driver info before boarding" },
  { icon: Info, title: "Share Location", desc: "Share your trip with trusted contacts" },
  { icon: AlertCircle, title: "Trust Ratings", desc: "Check reviews before joining a ride" },
];

const ridesUpdate = [
  { title: "DHA to I.I. Chundrigar", time: "08:00 AM", seats: 3, price: "150 PKR/day", id: "r1" },
  { title: "Gulshan to PECHS", time: "09:00 AM", seats: 1, price: "80 PKR/day", id: "r2" },
  { title: "Model Town to Gulberg", time: "07:30 AM", seats: 6, price: "120 PKR/day", id: "r3" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"ride" | "carpool">("carpool");
  const [, setLocation] = useLocation();
  const currentUser = useStore((s) => s.currentUser);

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white">
          <TopNav />
          <div className="px-5 pb-3 pt-1">
            <p className="text-muted-foreground text-xs">Good morning,</p>
            <h2 className="text-lg font-bold text-foreground">{currentUser?.name || "Traveller"}</h2>
          </div>
          <div className="flex px-5 gap-6 border-b border-border">
            {(["ride", "carpool"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-${tab}`}
                className={cn(
                  "pb-3 text-sm font-semibold capitalize transition-all",
                  activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                )}
              >
                MAS {tab === "ride" ? "Ride" : "Carpool"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "carpool" ? (
            <div className="px-5 pt-5 pb-4 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm">Select Vehicle Type</h3>
                <div className="grid grid-cols-4 gap-3">
                  {vehicleTypes.map((v) => (
                    <button
                      key={v.label}
                      onClick={() => setLocation("/carpool")}
                      data-testid={`vehicle-${v.label.toLowerCase()}`}
                      className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3 shadow-sm border border-border active:scale-95 transition-transform"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <v.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-foreground">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">Rides Update</h3>
                  <button onClick={() => setLocation("/carpool")} className="text-xs text-primary font-medium flex items-center gap-1">
                    See all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                  {ridesUpdate.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setLocation(`/carpool/${r.id}`)}
                      data-testid={`ride-update-card-${r.id}`}
                      className="min-w-[190px] bg-primary rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform flex-shrink-0"
                    >
                      <p className="text-white font-semibold text-sm leading-tight mb-3">{r.title}</p>
                      <p className="text-white/70 text-xs">{r.time}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-white text-xs bg-white/20 px-2 py-0.5 rounded-full">{r.seats} seats</span>
                        <span className="text-white font-bold text-xs">{r.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm">Safety Tips</h3>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                  {safetyTips.map((tip, i) => (
                    <div
                      key={i}
                      data-testid={`safety-tip-${i}`}
                      className="min-w-[155px] bg-amber-50 border border-amber-200 rounded-2xl p-4 flex-shrink-0"
                    >
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                        <tip.icon className="w-4 h-4 text-amber-600" />
                      </div>
                      <p className="font-semibold text-xs text-foreground">{tip.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 pt-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground">MAS Ride</h3>
              <p className="text-muted-foreground text-sm text-center mt-2 max-w-[220px]">On-demand rides coming soon! Switch to MAS Carpool to find daily routes.</p>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
