import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
};

interface SidebarProps {
  items: NavItem[];
  className?: string;
  logo?: React.ReactNode;
}

export function Sidebar({ items, className, logo }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  const NavItems = () => (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            location === item.href
              ? "bg-secondary text-primary font-medium"
              : "text-muted-foreground"
          )}
        >
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          {item.title}
        </Link>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 right-4 z-40"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-black/90 backdrop-blur-md border-r border-gray-800 p-6">
          <div className="flex items-center mb-8">
            {logo || <div className="text-lg font-bold">SatelSys</div>}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <NavItems />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r border-gray-800 bg-black/60 backdrop-blur-md p-6 h-screen",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="mb-8">
          {logo || <div className="text-lg font-bold">SatelSys</div>}
        </div>
        <NavItems />
      </div>
    </div>
  );
}
