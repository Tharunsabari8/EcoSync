import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { BottomNav } from "@/components/bottom-nav";
import Dashboard from "@/pages/dashboard";
import Collector from "@/pages/collector";
import Processor from "@/pages/processor";
import Laboratory from "@/pages/laboratory";
import Manufacturer from "@/pages/manufacturer";
import Consumer from "@/pages/consumer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/collector" component={Collector} />
      <Route path="/processor" component={Processor} />
      <Route path="/laboratory" component={Laboratory} />
      <Route path="/manufacturer" component={Manufacturer} />
      <Route path="/consumer" component={Consumer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pb-20">
            <Router />
          </main>
          <BottomNav />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
