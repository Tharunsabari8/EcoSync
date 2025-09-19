import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Route, Sprout, Factory, Microscope, Boxes } from "lucide-react";

export function SupplyChainMap() {
  const { data: stats } = useQuery<{
    activeBatches: number;
    collectionsToday: number;
    qualityTests: number;
    blockchainTransactions: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const stages = [
    {
      name: "Collection",
      icon: Sprout,
      count: stats?.collectionsToday || 0,
      unit: "Active",
      color: "bg-primary",
      bgColor: "bg-green-100",
      textColor: "text-green-800"
    },
    {
      name: "Processing", 
      icon: Factory,
      count: 8,
      unit: "Batches",
      color: "bg-secondary",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800"
    },
    {
      name: "Testing",
      icon: Microscope,
      count: stats?.qualityTests || 0,
      unit: "Tests",
      color: "bg-accent",
      bgColor: "bg-yellow-100", 
      textColor: "text-yellow-800"
    },
    {
      name: "Manufacturing",
      icon: Boxes,
      count: 6,
      unit: "Products",
      color: "bg-primary",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800"
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Route className="mr-2 text-primary w-5 h-5" />
          Live Supply Chain Tracker
        </h2>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6 relative">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.name} className="flex flex-col items-center space-y-2 z-10">
                  <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white w-5 h-5" />
                  </div>
                  <p className="text-xs text-center font-medium">{stage.name}</p>
                  <div className={`${stage.bgColor} ${stage.textColor} px-2 py-1 rounded text-xs`}>
                    <span data-testid={`tracker-${stage.name.toLowerCase()}-count`}>
                      {stage.count} {stage.unit}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Connection lines */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-primary via-secondary via-accent to-primary"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
