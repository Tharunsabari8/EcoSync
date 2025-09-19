import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Factory, Boxes, FlaskConical, QrCode, Plus, Download } from "lucide-react";

export default function Manufacturer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    productType: "",
    selectedBatches: [] as string[],
    batchSize: "",
    units: "bottles",
    notes: ""
  });

  const { data: readyBatches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
    select: (data: any[]) => data.filter((b: any) => b.status === 'completed').slice(0, 10)
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
    select: (data: any[]) => data.slice(0, 5)
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/products", {
        ...data,
        manufacturerId: "mfr-1", // In real app, get from auth
        manufacturingDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 3 years
        batchIds: data.selectedBatches,
        batchSize: parseInt(data.batchSize),
        productNumber: `P-${Date.now()}`
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Created",
        description: "Product batch has been created and added to the blockchain",
      });
      setFormData({
        name: "",
        productType: "",
        selectedBatches: [],
        batchSize: "",
        units: "bottles",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blockchain/transactions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.productType || formData.selectedBatches.length === 0 || !formData.batchSize) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one batch",
        variant: "destructive"
      });
      return;
    }

    createProductMutation.mutate(formData);
  };

  const handleBatchSelection = (batchId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedBatches: checked 
        ? [...prev.selectedBatches, batchId]
        : prev.selectedBatches.filter(id => id !== batchId)
    }));
  };

  return (
    <div className="p-4 space-y-6 fade-in-up">
      {/* Manufacturer Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Factory className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" data-testid="manufacturer-name">
                AyurPharma Manufacturing
              </h2>
              <p className="text-muted-foreground text-sm" data-testid="manufacturer-id">
                Manufacturer ID: M001
              </p>
              <p className="text-muted-foreground text-sm">AYUSH Licensed • GMP Certified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Batches */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Boxes className="mr-2 text-primary w-5 h-5" />
            Ready for Manufacturing
          </h3>
          
          <div className="space-y-3">
            {readyBatches.map((batch: any) => (
              <Card key={batch.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Batch: {batch.batchNumber}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      data-testid={`button-use-batch-${batch.id}`}
                    >
                      Use in Product
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Quantity: {batch.totalQuantity} kg</p>
                    <p>All tests: ✓ Passed • Quality grade: Premium</p>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      Quality Approved
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Processing Complete
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {readyBatches.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No batches ready for manufacturing</p>
                <p className="text-xs">Batches will appear here after quality testing is complete</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Product Formulation */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FlaskConical className="mr-2 text-primary w-5 h-5" />
            Create Product Formulation
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="product-form">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g., AyurVital Stress Relief"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                data-testid="input-product-name"
              />
            </div>

            <div>
              <Label htmlFor="productType">Product Type</Label>
              <Select 
                value={formData.productType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, productType: value }))}
              >
                <SelectTrigger data-testid="select-product-type">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="capsules">Capsules</SelectItem>
                  <SelectItem value="powder">Powder</SelectItem>
                  <SelectItem value="syrup">Syrup</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ingredient Selection */}
            <div>
              <Label>Select Ingredients</Label>
              <Card className="max-h-40 overflow-y-auto border border-border">
                <CardContent className="p-3 space-y-2">
                  {readyBatches.map((batch: any) => (
                    <div key={batch.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`batch-${batch.id}`}
                        checked={formData.selectedBatches.includes(batch.id)}
                        onCheckedChange={(checked) => handleBatchSelection(batch.id, checked as boolean)}
                        data-testid={`checkbox-batch-${batch.id}`}
                      />
                      <Label htmlFor={`batch-${batch.id}`} className="text-sm">
                        {batch.batchNumber} ({batch.totalQuantity} kg available)
                      </Label>
                    </div>
                  ))}
                  
                  {readyBatches.length === 0 && (
                    <p className="text-sm text-muted-foreground">No batches available for selection</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  type="number"
                  placeholder="1000"
                  value={formData.batchSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchSize: e.target.value }))}
                  data-testid="input-batch-size"
                />
              </div>
              <div>
                <Label htmlFor="units">Units</Label>
                <Select 
                  value={formData.units} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, units: value }))}
                >
                  <SelectTrigger data-testid="select-units">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="packets">Packets</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Manufacturing Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Special instructions, quality requirements..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                data-testid="textarea-notes"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createProductMutation.isPending}
              data-testid="button-submit-product"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Product Batch
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* QR Code Generation */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <QrCode className="mr-2 text-primary w-5 h-5" />
            Generate Product QR Codes
          </h3>
          
          <div className="space-y-3">
            {products.map((product: any) => (
              <Card key={product.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Product: {product.productNumber}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      data-testid={`button-generate-qr-${product.id}`}
                    >
                      Generate QR
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Name: {product.name}</p>
                    <p>Batch Size: {product.batchSize} {product.units} • Ready for QR generation</p>
                  </div>
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      Production Complete
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {products.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No products created yet</p>
                <p className="text-xs">Create your first product above to generate QR codes</p>
              </div>
            )}
          </div>
          
          {/* QR Code Display */}
          <div className="text-center mt-6 p-4 bg-muted rounded-lg">
            <div className="w-32 h-32 bg-white border-2 border-border rounded-lg mx-auto mb-2 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">QR Code will be generated here</p>
            <Button className="mt-2" size="sm" data-testid="button-download-qr">
              <Download className="w-4 h-4 mr-2" />
              Download QR Codes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
