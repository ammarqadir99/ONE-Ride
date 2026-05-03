import { useState } from "react";
import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ChevronLeft, Bell, CheckCheck, Car, MessageCircle, Star, XCircle, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "ride" | "confirm" | "chat" | "cancel" | "rating";
  detail?: string;
};

const initialNotifications: Notification[] = [
  { id: "n1", title: "Ride Request", body: "Ahmed Khan wants to join your ride to I.I. Chundrigar.", time: "2 min ago", read: false, type: "ride", detail: "Ahmed Khan (+923001234567) requested to join your 08:00 AM ride from DHA Phase 5 to I.I. Chundrigar Road." },
  { id: "n2", title: "Ride Confirmed", body: "Your seat on the DHA → PECHS carpool has been confirmed.", time: "1 hour ago", read: false, type: "confirm", detail: "You have been confirmed as a passenger on the DHA → PECHS carpool departing at 09:00 AM. PKR 80/day." },
  { id: "n3", title: "New Message", body: "Sara Malik: Are you available tomorrow?", time: "3 hours ago", read: true, type: "chat", detail: "Sara Malik sent you a message: \"Are you available tomorrow?\"" },
  { id: "n4", title: "Ride Cancelled", body: "The Model Town → Gulberg ride has been cancelled by the driver.", time: "Yesterday", read: true, type: "cancel", detail: "The Model Town → Gulberg ride scheduled at 07:30 AM has been cancelled by the driver. Please find an alternative." },
  { id: "n5", title: "Rating Received", body: "You received a 5-star rating from Ahmed Khan.", time: "2 days ago", read: true, type: "rating", detail: "Ahmed Khan gave you a 5-star rating. Your average rating is now 4.9." },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  ride:    { icon: Car,         color: "bg-primary/10 text-primary" },
  confirm: { icon: UserCheck,   color: "bg-emerald-100 text-emerald-600" },
  chat:    { icon: MessageCircle, color: "bg-blue-100 text-blue-600" },
  cancel:  { icon: XCircle,     color: "bg-red-100 text-red-500" },
  rating:  { icon: Star,        color: "bg-amber-100 text-amber-600" },
};

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [selected, setSelected] = useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleTap = (n: Notification) => {
    markRead(n.id);
    setSelected(n);
  };

  if (selected) {
    const cfg = typeConfig[selected.type];
    return (
      <PhoneFrame>
        <div className="flex flex-col h-full bg-gray-50">
          <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center gap-3 shadow-sm">
            <button onClick={() => setSelected(null)} className="p-2 -ml-2" data-testid="button-back-detail">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-foreground">Notification</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", cfg.color)}>
                  <cfg.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{selected.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selected.time}</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{selected.detail || selected.body}</p>
            </div>
          </div>

          <BottomNav />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-shrink-0 bg-white px-5 pt-12 pb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/home")} className="p-2 -ml-2" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-foreground">
              Notifications{unreadCount > 0 && (
                <span className="ml-2 text-xs font-semibold bg-primary text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-primary font-semibold"
              data-testid="button-mark-all-read"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center pt-24">
              <Bell className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No notifications yet</p>
            </div>
          )}

          {notifications.map((n) => {
            const cfg = typeConfig[n.type];
            return (
              <button
                key={n.id}
                onClick={() => handleTap(n)}
                data-testid={`notification-${n.id}`}
                className={cn(
                  "w-full flex items-start gap-4 px-5 py-4 border-b border-border text-left active:bg-accent/30 transition-colors",
                  !n.read ? "bg-primary/5" : "bg-white"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", cfg.color)}>
                  <cfg.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-semibold", !n.read ? "text-foreground" : "text-muted-foreground")}>
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 mt-3 flex-shrink-0" />
              </button>
            );
          })}
        </div>

        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
