import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRScanner } from "@/components/qr-scanner";
import { useToast } from "@/hooks/use-toast";
import { 
  QrCode, 
  Camera, 
  Eye, 
  Route, 
  MapPin, 
  Leaf, 
  Shield, 
  Award, 
  Handshake,
  CircleOff,
  CheckCircle 
} from "lucide-react";

interface TraceabilityData {
  product: any;
  batches: any[];
  collections: any[];
  qualityTests: any[];
  processingSteps: any[];
}

export default function Consumer() {
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedQR, setScannedQR] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { data: traceabilityData, isLoading } = useQuery<TraceabilityData>({
    queryKey: ["/api/products/qr", scannedQR],
    enabled: !!scannedQR,
  });

  const handleQRScan = (qrCode: string) => {
    setScannedQR(qrCode);
    setShowScanner(false);
    setShowResults(true);
    toast({
      title: "QR Code Scanned",
      description: "Loading product traceability data...",
    });
  };

  const showDemoProduct = () => {
    // Use a demo QR code that exists in the system
    setScannedQR("demo-qr-code");
    setShowResults(true);
  };

  const startQRScanning = () => {
    setShowScanner(true);
  };

  const supplyChainStages = [
    {
      name: "Collection",
      icon: Leaf,
      date: "Jan 15, 2024",
      description: "Ashwagandha harvested by certified organic farmer",
      details: {
        farmer: "Rajesh Kumar (ID: C001)",
        location: "19.7515°N, 75.7139°E",
        quantity: "25 kg",
        quality: "Premium Grade"
      },
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      name: "Processing",
      icon: Route,
      date: "Jan 16-17, 2024", 
      description: "Traditional drying and grinding processes",
      details: {
        facility: "Ayurvedic Processing Facility (P001)",
        methods: "Sun-drying, Fine grinding, Sieving",
        temperature: "25-30°C",
        humidity: "45%"
      }
    },
    {
      name: "Testing",
      icon: Shield,
      date: "Jan 18, 2024",
      description: "Comprehensive quality and authenticity tests",
      details: {
        moistureContent: "7.2% ✓ Pass",
        pesticideAnalysis: "Below detection limit ✓ Pass", 
        dnaBarcoding: "Species confirmed ✓ Pass"
      }
    },
    {
      name: "Manufacturing",
      icon: Award,
      date: "Jan 20, 2024",
      description: "Final product formulation and packaging",
      details: {
        manufacturer: "AyurPharma Manufacturing (M001)",
        formulation: "500mg capsules, 60 count",
        batchSize: "1000 bottles"
      }
    }
  ];

  const certifications = [
    {
      title: "Organic Certified",
      subtitle: "NPOP Certified",
      icon: Leaf,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
      subtitleColor: "text-green-600"
    },
    {
      title: "AYUSH Approved", 
      subtitle: "Ministry Licensed",
      icon: Shield,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200", 
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      subtitleColor: "text-blue-600"
    },
    {
      title: "GMP Certified",
      subtitle: "Good Manufacturing",
      icon: Award,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600", 
      textColor: "text-yellow-800",
      subtitleColor: "text-yellow-600"
    },
    {
      title: "Fair Trade",
      subtitle: "Ethical Sourcing", 
      icon: Handshake,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-600",
      textColor: "text-purple-800", 
      subtitleColor: "text-purple-600"
    }
  ];

  return (
    <div className="p-4 space-y-6 fade-in-up">
      {/* Consumer Portal Header */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">Product Traceability Portal</h2>
          <p className="text-primary-foreground/90 text-sm">
            Scan the QR code on your Ayurvedic product to view its complete journey from farm to shelf
          </p>
        </CardContent>
      </Card>

      {/* QR Scanner Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <QrCode className="mr-2 text-primary w-5 h-5" />
            Scan Product QR Code
          </h3>
          
          <div className="text-center">
            {showScanner ? (
              <QRScanner 
                onScan={handleQRScan}
                onClose={() => setShowScanner(false)}
              />
            ) : (
              <>
                <div className="w-64 h-64 mx-auto bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Camera viewfinder will appear here</p>
                  </div>
                </div>
                
                <div className="space-x-4">
                  <Button 
                    onClick={startQRScanning}
                    data-testid="button-start-camera"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    onClick={showDemoProduct}
                    data-testid="button-view-demo"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Demo Product
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Traceability Results */}
      {showResults && (
        <div className="space-y-6" data-testid="traceability-results">
          
          {/* Product Information */}
          <Card className="overflow-hidden">
            <div 
              className="relative h-48 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold" data-testid="product-name">
                  AyurVital Stress Relief Capsules
                </h3>
                <p className="text-white/90" data-testid="product-id">
                  Product ID: P-2024-001
                </p>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturing Date</p>
                  <p className="font-medium" data-testid="manufacturing-date">January 20, 2024</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium" data-testid="expiry-date">January 20, 2027</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Authentic Product
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <Leaf className="w-4 h-4 mr-1" />
                  Organic Certified
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supply Chain Journey */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Route className="mr-2 text-primary w-5 h-5" />
                Supply Chain Journey
              </h3>
              
              <div className="space-y-6">
                {supplyChainStages.map((stage, index) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.name} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mt-1">
                        <Icon className="text-primary-foreground w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{stage.name}</h4>
                          <span className="text-sm text-muted-foreground">{stage.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                        <Card className="bg-muted">
                          <CardContent className="p-3 text-sm">
                            {Object.entries(stage.details).map(([key, value]) => (
                              <p key={key}>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {value}
                              </p>
                            ))}
                          </CardContent>
                        </Card>
                        {stage.imageUrl && (
                          <img 
                            src={stage.imageUrl}
                            alt={`${stage.name} stage`}
                            className="rounded-lg mt-3 w-full h-32 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Map */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 text-primary w-5 h-5" />
                Journey Map
              </h3>
              
              <div className="map-container h-64 rounded-lg flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mb-2 text-primary mx-auto" />
                  <p>Interactive map showing collection to consumer journey</p>
                  <p className="text-sm">Farm → Processing → Lab → Manufacturing → Retail</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="mr-2 text-primary w-5 h-5" />
                Certifications & Compliance
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert) => {
                  const Icon = cert.icon;
                  return (
                    <div 
                      key={cert.title}
                      className={`text-center p-4 rounded-lg border ${cert.bgColor} ${cert.borderColor}`}
                    >
                      <Icon className={`${cert.iconColor} w-8 h-8 mx-auto mb-2`} />
                      <p className={`font-medium ${cert.textColor}`}>{cert.title}</p>
                      <p className={`text-sm ${cert.subtitleColor}`}>{cert.subtitle}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* How It Works */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CircleOff className="mr-2 text-primary w-5 h-5" />
            How Blockchain Traceability Works
          </h3>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            {[
              "Every step from farm to shelf is recorded on an immutable blockchain ledger",
              "GPS coordinates, timestamps, and quality data are captured at each stage", 
              "Smart contracts ensure compliance with sustainability and quality standards",
              "QR codes provide instant access to complete product history and authenticity proof"
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
