
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, ScreenShare, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function WalkieTalkie() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  const getCameraPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error("getUserMedia not supported on this browser");
      toast({
        variant: "destructive",
        title: "Unsupported Browser",
        description: "Your browser does not support camera access.",
      });
      setHasCameraPermission(false);
      setIsCameraActive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      setIsCameraActive(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description:
          "Please enable camera permissions in your browser settings to use this feature.",
      });
    }
  }, [toast]);

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      getCameraPermission();
    }
  };

  useEffect(() => {
    getCameraPermission();
    return () => {
      stopCamera();
    };
  }, [getCameraPermission, stopCamera]);

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
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            {(!hasCameraPermission || !isCameraActive) && (
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

          <div className="grid grid-cols-3 gap-2">
            <Button className="w-full h-12 group active:bg-primary/90">
              <Mic className="mr-2 h-5 w-5 transition-transform group-active:scale-110" />
              Push to Talk
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={toggleCamera}>
              {isCameraActive ? <VideoOff className="mr-2 h-5 w-5" /> : <Video className="mr-2 h-5 w-5" />}
              {isCameraActive ? "Stop" : "Start"} Cam
            </Button>
            <Button variant="outline" className="w-full h-12">
              <ScreenShare className="mr-2 h-5 w-5" />
              Screen Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
