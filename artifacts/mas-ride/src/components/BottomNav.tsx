import { Home, Search, PlusCircle, Clock, User, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Search, label: "Search", href: "/carpool" },
    { icon: PlusCircle, label: "Publish", href: "/publish" },
    { icon: MessageCircle, label: "Chat", href: "/chat" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-center z-40 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = location.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-0.5 py-1 px-2"
            data-testid={`nav-${item.label.toLowerCase()}`}
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={cn(
                "text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
