import { Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DrawerMenu } from "./DrawerMenu";
import { Link } from "wouter";

export function TopNav() {
  return (
    <div className="px-4 pt-4 pb-2 flex items-center justify-between bg-background sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 -ml-2 text-foreground" data-testid="button-menu">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0 bg-primary border-none text-primary-foreground sm:max-w-[300px]">
          <DrawerMenu />
        </SheetContent>
      </Sheet>

      <div className="font-bold text-2xl tracking-tight text-primary">MAS</div>

      <Link href="/notifications" className="p-2 -mr-2 relative text-foreground">
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background"></span>
      </Link>
    </div>
  );
}
