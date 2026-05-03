import { useLocation } from "wouter";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, User, Wallet, MapPin, ChevronRight, Trash2, ThumbsUp, LogOut } from "lucide-react";
import { useStore } from "@/store";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const currentUser = useStore((s) => s.currentUser);
  const logout = useStore((s) => s.logout);

  const menuItems = [
    { icon: User,    label: "Personal Info", href: "/profile/edit",    danger: false },
    { icon: Wallet,  label: "My Wallet",     href: "/wallet",           danger: false },
    { icon: MapPin,  label: "Address",       href: "/profile/address",  danger: false },
    { icon: ThumbsUp,label: "My Rating",     href: "/profile/rating",   danger: false },
    { icon: Trash2,  label: "Delete Account",href: "/profile/delete",   danger: true  },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Purple header */}
        <div className="flex-shrink-0 bg-primary pt-12 pb-8 px-5 rounded-b-[40px]">
          <h1 className="text-white font-bold text-xl mb-6">My Profile</h1>
          <div className="flex flex-col items-center">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg mb-3">
              <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                {currentUser?.name?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-white text-lg font-bold">{currentUser?.name || "User"}</h2>
            <p className="text-white/70 text-xs mt-0.5">{currentUser?.phone}</p>
          </div>
          {/* Stats */}
          <div className="flex bg-white/15 rounded-2xl mt-5 divide-x divide-white/20">
            <div className="flex-1 py-3 flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-white font-bold text-sm">{currentUser?.rating ?? "5.0"}</span>
              </div>
              <p className="text-white/70 text-[10px] mt-0.5">Rating</p>
            </div>
            <div className="flex-1 py-3 flex flex-col items-center">
              <span className="text-white font-bold text-sm">{currentUser?.totalRides ?? 0}</span>
              <p className="text-white/70 text-[10px] mt-0.5">Total Rides</p>
            </div>
            <div className="flex-1 py-3 flex flex-col items-center">
              <span className="text-white font-bold text-sm">{currentUser?.totalPosts ?? 0}</span>
              <p className="text-white/70 text-[10px] mt-0.5">Total Posts</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-2.5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setLocation(item.href)}
              data-testid={`profile-menu-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm border border-border active:scale-[0.99] transition-transform"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.danger ? "bg-red-50" : "bg-accent"}`}>
                <item.icon className={`w-4 h-4 ${item.danger ? "text-destructive" : "text-primary"}`} />
              </div>
              <span className={`font-medium text-sm flex-1 text-left ${item.danger ? "text-destructive" : "text-foreground"}`}>
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          <button
            onClick={handleLogout}
            data-testid="button-logout"
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm border border-border mt-2 active:scale-[0.99] transition-transform"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <span className="font-medium text-sm text-destructive flex-1 text-left">Sign Out</span>
          </button>
        </div>

        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
