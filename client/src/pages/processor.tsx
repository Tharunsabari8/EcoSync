import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Factory, Inbox, ServerCog, Plus } from "lucide-react";

export default function Processor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    batchId: "",
    stepType: "",
    temperature: "",
    humidity: "",
    notes: ""
  });

  const { data: incomingBatches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
    select: (data: any[]) => data.filter((b: any) => b.status === 'pending').slice(0, 5)
  });

  const { data: activeBatches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
    select: (data: any[]) => data.filter((b: any) => b.status === 'processing').slice(0, 3)
  });

  const createProcessingStepMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/processing-steps", {
        ...data,
        processedAt: new Date(),
        temperature: data.temperature || null,
        humidity: data.humidity || null
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Processing Step Recorded",
        description: "Processing step has been added to the blockchain",
      });
      setFormData({
        batchId: "",
        stepType: "",
        temperature: "",
        humidity: "",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/processing-steps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blockchain/transactions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record processing step",
        variant: "destructive"
      });
    }
  });

  const startProcessingMutation = useMutation({
    mutationFn: async (batchId: string) => {
      const response = await apiRequest("PATCH", `/api/batches/${batchId}`, {
        status: "processing"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Processing Started",
        description: "Batch processing has been initiated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchId || !formData.stepType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createProcessingStepMutation.mutate(formData);
  };

  return (
    <div className="p-4 space-y-6 fade-in-up">
      {/* Processing Facility Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <Factory className="text-secondary-foreground w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" data-testid="processor-name">
                Ayurvedic Processing Facility
              </h2>
              <p className="text-muted-foreground text-sm" data-testid="processor-id">
                Processor ID: P001
              </p>
              <p className="text-muted-foreground text-sm">Maharashtra, India</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incoming Batches */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Inbox className="mr-2 text-secondary w-5 h-5" />
            Incoming Batches
          </h3>
          
          <div className="space-y-3">
            {incomingBatches.map((batch: any) => (
              <Card key={batch.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Batch: {batch.batchNumber}</span>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => startProcessingMutation.mutate(batch.id)}
                      disabled={startProcessingMutation.isPending}
                      data-testid={`button-start-processing-${batch.id}`}
                    >
                      Start Processing
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Quantity: {batch.totalQuantity} kg</p>
                    <p>Collections: {(batch.collectionIds as string[]).length} batches</p>
                    <p>Created: {new Date(batch.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      Pending Processing
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {incomingBatches.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No incoming batches</p>
                <p className="text-xs">New batches will appear here when collections are completed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Steps Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ServerCog className="mr-2 text-secondary w-5 h-5" />
            Add Processing Step
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="processing-form">
            <div>
              <Label htmlFor="batch">Select Batch</Label>
              <Select 
                value={formData.batchId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, batchId: value }))}
              >
                <SelectTrigger data-testid="select-batch">
                  <SelectValue placeholder="Choose batch to process" />
                </SelectTrigger>
                <SelectContent>
                  {[...incomingBatches, ...activeBatches].map((batch: any) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.batchNumber} ({batch.totalQuantity} kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stepType">Processing Step</Label>
              <Select 
                value={formData.stepType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, stepType: value }))}
              >
                <SelectTrigger data-testid="select-step-type">
                  <SelectValue placeholder="Select processing step" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaning">Cleaning & Sorting</SelectItem>
                  <SelectItem value="drying">Drying</SelectItem>
                  <SelectItem value="grinding">Grinding</SelectItem>
                  <SelectItem value="sieving">Sieving</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="25"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                  data-testid="input-temperature"
                />
              </div>
              <div>
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  placeholder="45"
                  value={formData.humidity}
                  onChange={(e) => setFormData(prev => ({ ...prev, humidity: e.target.value }))}
                  data-testid="input-humidity"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Processing Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Equipment used, duration, observations..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                data-testid="textarea-notes"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createProcessingStepMutation.isPending}
              data-testid="button-submit-processing"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Processing Step
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Processing */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Currently Processing</h3>
          
          <div className="space-y-3">
            {activeBatches.map((batch: any) => (
              <Card key={batch.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{batch.batchNumber} - Processing</span>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      In Progress
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <p>Quantity: {batch.totalQuantity} kg • Started: {new Date(batch.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">65% Complete • Est. 3 hours remaining</p>
                </CardContent>
              </Card>
            ))}
            
            {activeBatches.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active processing</p>
                <p className="text-xs">Start processing incoming batches to see them here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
