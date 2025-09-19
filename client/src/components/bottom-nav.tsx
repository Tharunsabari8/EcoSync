import { BarChart3, Sprout, Microscope, Factory, QrCode } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/collector", icon: Sprout, label: "Collector" },
    { path: "/laboratory", icon: Microscope, label: "Lab" },
    { path: "/manufacturer", icon: Factory, label: "Mfg" },
    { path: "/consumer", icon: QrCode, label: "Scan" },
  ];

  const isActive = (path: string) => {
    return location === path || (location === "/" && path === "/dashboard");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={cn(
              "flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-colors",
              isActive(path)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
            data-testid={`nav-${label.toLowerCase()}`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
