
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function WalkieTalkie() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true); // Assume true until we know otherwise
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (streamRef.current) return; // Already running

    if (!navigator.mediaDevices?.getUserMedia) {
      toast({ variant: "destructive", title: "Unsupported Browser" });
      setHasCameraPermission(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      setIsCameraActive(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions to use this feature.",
      });
    }
  }, [toast]);

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // This effect runs only once on component mount to request camera access.
  // The dependency functions are stable, so this won't re-run and cause a loop.
  useEffect(() => {
    startCamera();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Comms</CardTitle>
        <Video className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
              autoPlay
              muted
              playsInline
            />
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <VideoOff className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {!hasCameraPermission && (
            <Alert variant="destructive">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full h-12 group active:bg-primary/90">
              <Mic className="mr-2 h-5 w-5 transition-transform group-active:scale-110" />
              Push to Talk
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={toggleCamera}>
              {isCameraActive ? <VideoOff className="mr-2 h-5 w-5" /> : <Video className="mr-2 h-5 w-5" />}
              {isCameraActive ? "Stop Cam" : "Start Cam"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
