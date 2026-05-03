import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ChevronLeft, Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const mockNotifications = [
  { id: "n1", title: "Ride Request", body: "Ahmed Khan wants to join your ride to I.I. Chundrigar.", time: "2 min ago", read: false, type: "ride" },
  { id: "n2", title: "Ride Confirmed", body: "Your seat on the DHA → PECHS carpool has been confirmed.", time: "1 hour ago", read: false, type: "confirm" },
  { id: "n3", title: "New Message", body: "Sara Malik: Are you available tomorrow?", time: "3 hours ago", read: true, type: "chat" },
  { id: "n4", title: "Ride Cancelled", body: "The Model Town → Gulberg ride has been cancelled by the driver.", time: "Yesterday", read: true, type: "cancel" },
  { id: "n5", title: "Rating Received", body: "You received a 5-star rating from Ahmed Khan.", time: "2 days ago", read: true, type: "rating" },
];

const typeColors: Record<string, string> = {
  ride:    "bg-primary/10 text-primary",
  confirm: "bg-emerald-100 text-emerald-600",
  chat:    "bg-blue-100 text-blue-600",
  cancel:  "bg-red-100 text-red-500",
  rating:  "bg-amber-100 text-amber-600",
};

export default function NotificationsPage() {
  const [, setLocation] = useLocation();

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/home")} className="p-2 -ml-2" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-foreground">Notifications</h1>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-primary font-semibold">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockNotifications.length === 0 && (
            <div className="flex flex-col items-center pt-24">
              <Bell className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No notifications yet</p>
            </div>
          )}

          {mockNotifications.map((n) => (
            <div
              key={n.id}
              data-testid={`notification-${n.id}`}
              className={cn(
                "flex items-start gap-4 px-5 py-4 border-b border-border cursor-pointer active:bg-accent/30 transition-colors",
                !n.read && "bg-primary/5"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", typeColors[n.type])}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-semibold", !n.read ? "text-foreground" : "text-muted-foreground")}>
                    {n.title}
                  </p>
                  {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>

        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
