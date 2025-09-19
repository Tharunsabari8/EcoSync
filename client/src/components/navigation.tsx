import { Leaf, Wifi, WifiOff } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Simulate occasional offline mode for demo
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setIsOffline(prev => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (value: string) => {
    setLocation(`/${value}`);
  };

  const getCurrentRole = () => {
    const path = location.split('/')[1] || 'dashboard';
    return path;
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold text-primary">AyuTrace</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {isOffline && (
            <div className="offline-indicator bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs flex items-center">
              <WifiOff className="w-3 h-3 mr-1" />
              Offline Mode
            </div>
          )}
          
          <Select value={getCurrentRole()} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[150px] bg-muted text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="collector">Collector</SelectItem>
              <SelectItem value="processor">Processor</SelectItem>
              <SelectItem value="laboratory">Laboratory</SelectItem>
              <SelectItem value="manufacturer">Manufacturer</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
