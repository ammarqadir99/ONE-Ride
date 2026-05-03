import { useStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, User, Wallet, HeadphonesIcon, Search, CarFront, PlusCircle, CreditCard, Share2, Bell, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";

export function DrawerMenu() {
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const [, setLocation] = useLocation();

  const menuItems = [
    { icon: Info, label: "How to use app", href: "/help" },
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Wallet, label: "My Wallet", href: "/wallet" },
    { icon: HeadphonesIcon, label: "Customer Support", href: "/support" },
    { icon: Search, label: "Search Carpool Ride", href: "/carpool" },
    { icon: CarFront, label: "Become a Carpool Driver", href: "/become-driver" },
    { icon: PlusCircle, label: "Publish Carpool Ride", href: "/publish" },
    { icon: CreditCard, label: "Bank Account", href: "/bank" },
    { icon: Share2, label: "Referral System", href: "/referrals" },
    { icon: Bell, label: "Notification", href: "/notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-8 pt-12 px-6">
      <div className="flex flex-col items-center mb-8 text-center">
        <Avatar className="w-24 h-24 border-4 border-white/20 mb-4 bg-primary-foreground text-primary">
          <AvatarImage src={currentUser?.avatar || ""} />
          <AvatarFallback className="text-3xl bg-white text-primary">
            {currentUser?.name?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{currentUser?.name || "User"}</h2>
        <p className="text-primary-foreground/80 text-sm mt-1">{currentUser?.phone}</p>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 py-3 text-primary-foreground/90 hover:text-white transition-colors"
          >
            <item.icon className="w-5 h-5 opacity-80" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 py-3 mt-4 text-primary-foreground hover:text-white transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5 opacity-80" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

      <div className="mt-8 text-center text-primary-foreground/60 text-xs">
        App Version 1.0.0
      </div>
    </div>
  );
}
