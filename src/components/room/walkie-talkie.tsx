
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRooms } from "@/context/RoomContext";
import { useParams } from "next/navigation";

export function WalkieTalkie() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState(true);
  
  const { toast } = useToast();
  const params = useParams<{ roomId: string }>();
  const { userProfile, participants, toggleMute, toggleCamera } = useRooms();

  const roomId = params.roomId;
  const me = participants[roomId]?.find(p => p.email === userProfile.email);

  const isCameraOn = me ? !me.isCameraOff : false;
  const isMuted = me ? me.isMuted : true;

  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // This effect runs once to get permissions and media stream
  useEffect(() => {
    const getMedia = async () => {
      if (streamRef.current) return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // The tracks will be enabled/disabled by the effect below based on context state
        setHasPermission(true);

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
    };
    
    getMedia();
    
    return () => stopMedia();
  }, [toast, stopMedia]);

  // This effect syncs the media tracks with the state from context
  useEffect(() => {
    if (!streamRef.current) return;
    
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = isCameraOn;
    }

    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isMuted;
    }
  }, [isCameraOn, isMuted, hasPermission]); // Add hasPermission dependency

  // Button handlers now just call the context functions
  const handleToggleCamera = () => {
    if (!me) return;
    toggleCamera(roomId, userProfile.email);
  };
  
  const handleToggleMute = () => {
    if (!me) return;
    toggleMute(roomId, userProfile.email);
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
              className={`w-full h-full object-cover ${isCameraOn && hasPermission ? 'block' : 'hidden'}`}
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
              onClick={handleToggleMute}
              disabled={!hasPermission || !me}
              variant={isMuted ? "default" : "outline"}
            >
              {isMuted ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
              {isMuted ? "Unmute Mic" : "Mute Mic"}
            </Button>
            <Button 
                variant="outline" 
                className="w-full h-12" 
                onClick={handleToggleCamera} 
                disabled={!hasPermission || !me}
            >
              {isCameraOn ? <VideoOff className="mr-2 h-5 w-5" /> : <Video className="mr-2 h-5 w-5" />}
              {isCameraOn ? "Stop Cam" : "Start Cam"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
