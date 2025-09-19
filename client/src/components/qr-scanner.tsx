import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Camera, AlertCircle } from "lucide-react";

interface QRScannerProps {
  onScan: (qrCode: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate scanning a demo QR code
    const demoQRCode = `QR-${Date.now()}-DEMO`;
    onScan(demoQRCode);
  };

  const handleManualInput = () => {
    const qrInput = prompt("Enter QR Code manually (for demo):");
    if (qrInput) {
      onScan(qrInput);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">QR Code Scanner</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            data-testid="button-close-scanner"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {error ? (
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <p className="text-sm text-destructive">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={startCamera} 
                variant="outline" 
                className="w-full"
                data-testid="button-retry-camera"
              >
                <Camera className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={simulateQRScan} 
                variant="secondary" 
                className="w-full"
                data-testid="button-simulate-scan"
              >
                Simulate QR Scan (Demo)
              </Button>
              <Button 
                onClick={handleManualInput} 
                variant="outline" 
                className="w-full"
                data-testid="button-manual-input"
              >
                Manual Input
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg object-cover"
                autoPlay
                playsInline
                muted
                data-testid="scanner-video"
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                </div>
              </div>
              
              {/* Scanning animation */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-1 bg-primary opacity-75 animate-pulse"></div>
                </div>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Position the QR code within the frame
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={simulateQRScan} 
                  variant="secondary" 
                  className="w-full"
                  data-testid="button-demo-scan"
                >
                  Simulate QR Scan (Demo)
                </Button>
                <Button 
                  onClick={handleManualInput} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  data-testid="button-manual-qr"
                >
                  Enter QR Code Manually
                </Button>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
