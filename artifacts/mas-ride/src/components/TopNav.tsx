import { useState } from "react";
import { Menu, Bell, X } from "lucide-react";
import { DrawerMenu } from "./DrawerMenu";
import { Link } from "wouter";

export function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between bg-background sticky top-0 z-30">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 text-foreground"
          data-testid="button-menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="font-bold text-2xl tracking-tight text-primary">ONE</div>

        <Link href="/notifications" className="p-2 -mr-2 relative text-foreground">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background" />
        </Link>
      </div>

      {/* Drawer rendered inside phone frame (constrained by PhoneFrame's overflow-hidden) */}
      {open && (
        <div className="absolute inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="relative w-[300px] max-w-[85%] h-full bg-primary shadow-2xl flex flex-col overflow-hidden animate-slide-in-left">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 p-1 text-white/70 hover:text-white"
              data-testid="button-close-menu"
            >
              <X className="w-5 h-5" />
            </button>
            <DrawerMenu onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
