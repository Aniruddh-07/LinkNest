
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function WalkieTalkie() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const { toast } = useToast();

  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const getMedia = useCallback(async () => {
    if (streamRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      // Mute audio by default
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
          audioTrack.enabled = false;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setHasPermission(false);
      stopMedia();
      toast({
        variant: "destructive",
        title: "Permissions Denied",
        description: "Please enable camera and microphone permissions in your browser settings.",
      });
    }
  }, [toast, stopMedia]);

  // Get media on mount and cleanup on unmount
  useEffect(() => {
    getMedia();
    return () => stopMedia();
  }, [getMedia, stopMedia]);

  const toggleCamera = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };
  
  const toggleMute = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

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
              className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
              autoPlay
              muted
              playsInline
            />
            {(!isCameraOn || !hasPermission) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <VideoOff className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {!hasPermission && (
            <Alert variant="destructive">
              <AlertTitle>Media Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera and microphone access to use this feature.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button 
              className="w-full h-12"
              onClick={toggleMute}
              disabled={!hasPermission}
              variant={isMuted ? "outline" : "default"}
            >
              {isMuted ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
              {isMuted ? "Unmute Mic" : "Mute Mic"}
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={toggleCamera} disabled={!hasPermission}>
              {isCameraOn ? <VideoOff className="mr-2 h-5 w-5" /> : <Video className="mr-2 h-5 w-5" />}
              {isCameraOn ? "Stop Cam" : "Start Cam"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
