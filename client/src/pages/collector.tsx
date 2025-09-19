import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/hooks/use-location";
import { apiRequest } from "@/lib/queryClient";
import { User, Sprout, MapPin, Camera, Plus, RefreshCw } from "lucide-react";

export default function Collector() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location, refreshLocation } = useLocation();
  
  const [formData, setFormData] = useState({
    speciesId: "",
    quantity: "",
    qualityGrade: "excellent",
    notes: ""
  });

  const { data: species = [] } = useQuery<any[]>({
    queryKey: ["/api/herb-species"],
  });

  const { data: collections = [] } = useQuery<any[]>({
    queryKey: ["/api/collections"],
    select: (data: any[]) => data.filter((c: any) => c.collectorId === "user-1").slice(0, 5)
  });

  const createCollectionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/collections", {
        ...data,
        collectorId: "user-1", // In real app, get from auth
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        collectionDate: new Date(),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Collection Recorded",
        description: "Your collection has been added to the blockchain",
      });
      setFormData({
        speciesId: "",
        quantity: "",
        qualityGrade: "excellent", 
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blockchain/transactions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record collection",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.speciesId || !formData.quantity) {
      toast({
        title: "Validation Error", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createCollectionMutation.mutate({
      ...formData,
      quantity: formData.quantity  // Keep as string since backend expects string
    });
  };

  return (
    <div className="p-4 space-y-6 fade-in-up">
      {/* Collector Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" data-testid="collector-name">
                Rajesh Kumar
              </h2>
              <p className="text-muted-foreground text-sm" data-testid="collector-id">
                Collector ID: C001
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 text-sm">GPS Active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Collection Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Sprout className="mr-2 text-primary w-5 h-5" />
            New Collection Event
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="collection-form">
            {/* Species Selection */}
            <div>
              <Label htmlFor="species">Herb Species</Label>
              <Select 
                value={formData.speciesId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, speciesId: value }))}
              >
                <SelectTrigger data-testid="select-species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {species.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.scientificName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GPS Location */}
            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Current Location</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={refreshLocation}
                    data-testid="button-refresh-location"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Latitude: <span className="ml-1" data-testid="location-lat">{location.lat}°N</span>
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Longitude: <span className="ml-1" data-testid="location-lng">{location.lng}°E</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">✓ Within approved harvesting zone</p>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  data-testid="input-quantity"
                />
              </div>
              <div>
                <Label htmlFor="quality">Initial Quality</Label>
                <Select 
                  value={formData.qualityGrade} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, qualityGrade: value }))}
                >
                  <SelectTrigger data-testid="select-quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Collection Notes */}
            <div>
              <Label htmlFor="notes">Collection Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Environmental conditions, harvest method, etc."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                data-testid="textarea-notes"
              />
            </div>

            {/* Photo Capture */}
            <Card className="border-2 border-dashed border-border">
              <CardContent className="p-6 text-center">
                <Camera className="text-muted-foreground w-8 h-8 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm mb-2">Capture collection photos</p>
                <Button type="button" variant="secondary" size="sm" data-testid="button-take-photo">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createCollectionMutation.isPending}
              data-testid="button-submit-collection"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Collection Event
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Collections */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Recent Collections</h3>
          
          <div className="space-y-3">
            {collections.map((collection: any) => (
              <div key={collection.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {species.find((s: any) => s.id === collection.speciesId)?.name || 'Unknown'} - {collection.quantity} kg
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(collection.collectionDate).toLocaleDateString()} • Quality: {collection.qualityGrade}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  Recorded
                </div>
              </div>
            ))}
            
            {collections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No collections recorded yet</p>
                <p className="text-xs">Start by recording your first collection above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
