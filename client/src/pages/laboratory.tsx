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
import { Microscope, List, TestTubeDiagonal, Check, Upload } from "lucide-react";

export default function Laboratory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    batchId: "",
    testType: "",
    testValue: "",
    unit: "",
    acceptableRange: "",
    result: "pass",
    notes: ""
  });

  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
    select: (data: any[]) => data.filter((b: any) => b.status === 'completed').slice(0, 10)
  });

  const { data: recentTests = [] } = useQuery<any[]>({
    queryKey: ["/api/quality-tests"],
    select: (data: any[]) => data.slice(0, 5)
  });

  const createQualityTestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/quality-tests", {
        ...data,
        labId: "lab-1", // In real app, get from auth
        testedAt: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test Results Recorded",
        description: "Quality test results have been added to the blockchain",
      });
      setFormData({
        batchId: "",
        testType: "",
        testValue: "",
        unit: "",
        acceptableRange: "",
        result: "pass",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quality-tests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blockchain/transactions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record test results",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchId || !formData.testType || !formData.testValue) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createQualityTestMutation.mutate(formData);
  };

  return (
    <div className="p-4 space-y-6 fade-in-up">
      {/* Laboratory Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Microscope className="text-accent-foreground w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" data-testid="lab-name">
                AyuLab Quality Testing
              </h2>
              <p className="text-muted-foreground text-sm" data-testid="lab-id">
                Lab ID: L001
              </p>
              <p className="text-muted-foreground text-sm">NABL Certified • ISO 17025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Queue */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <List className="mr-2 text-accent w-5 h-5" />
            Sample Testing Queue
          </h3>
          
          <div className="space-y-3">
            {batches.slice(0, 3).map((batch: any) => (
              <Card key={batch.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Sample: S-{batch.batchNumber}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      data-testid={`button-start-testing-${batch.id}`}
                    >
                      Start Testing
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Batch: {batch.batchNumber} • Quantity: {batch.totalQuantity} kg</p>
                    <p>Processor: Ayurvedic Processing Facility (P001)</p>
                    <p>Required Tests: Moisture, Pesticide, DNA Barcode</p>
                  </div>
                  <div className="mt-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      Pending
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {batches.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No samples in queue</p>
                <p className="text-xs">Samples will appear here when processing is completed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TestTubeDiagonal className="mr-2 text-accent w-5 h-5" />
            Record Test Results
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="test-form">
            <div>
              <Label htmlFor="batch">Sample ID</Label>
              <Select 
                value={formData.batchId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, batchId: value }))}
              >
                <SelectTrigger data-testid="select-sample">
                  <SelectValue placeholder="Select sample to test" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch: any) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      S-{batch.batchNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="testType">Test Type</Label>
              <Select 
                value={formData.testType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, testType: value }))}
              >
                <SelectTrigger data-testid="select-test-type">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moisture">Moisture Content</SelectItem>
                  <SelectItem value="pesticide">Pesticide Analysis</SelectItem>
                  <SelectItem value="dna">DNA Barcoding</SelectItem>
                  <SelectItem value="heavymetals">Heavy Metals</SelectItem>
                  <SelectItem value="microbial">Microbial Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testValue">Test Value</Label>
                <Input
                  id="testValue"
                  placeholder="e.g., 8.5"
                  value={formData.testValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, testValue: e.target.value }))}
                  data-testid="input-test-value"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="e.g., %"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  data-testid="input-unit"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="acceptableRange">Acceptable Range</Label>
                <Input
                  id="acceptableRange"
                  placeholder="e.g., 5-12%"
                  value={formData.acceptableRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptableRange: e.target.value }))}
                  data-testid="input-acceptable-range"
                />
              </div>
              <div>
                <Label htmlFor="result">Result Status</Label>
                <Select 
                  value={formData.result} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, result: value }))}
                >
                  <SelectTrigger data-testid="select-result">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pass">Pass</SelectItem>
                    <SelectItem value="fail">Fail</SelectItem>
                    <SelectItem value="retest">Requires Retest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Test Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Method used, observations, recommendations..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                data-testid="textarea-notes"
              />
            </div>

            {/* Certificate Upload */}
            <Card className="border-2 border-dashed border-border">
              <CardContent className="p-6 text-center">
                <Upload className="text-muted-foreground w-8 h-8 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm mb-2">Upload Test Certificate</p>
                <Button type="button" variant="outline" size="sm" data-testid="button-upload-certificate">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Certificate
                </Button>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
              disabled={createQualityTestMutation.isPending}
              data-testid="button-submit-test"
            >
              <Check className="w-4 h-4 mr-2" />
              Submit Test Results
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Test Results */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Test Results</h3>
          
          <div className="space-y-3">
            {recentTests.map((test: any) => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    S-{test.batchId} - {test.testType}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Result: {test.testValue} {test.unit} • {test.result}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  test.result === 'pass' 
                    ? 'bg-green-100 text-green-800' 
                    : test.result === 'fail'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {test.result === 'pass' ? 'Completed' : test.result}
                </div>
              </div>
            ))}
            
            {recentTests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No test results yet</p>
                <p className="text-xs">Test results will appear here once submitted</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
