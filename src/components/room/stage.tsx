
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Youtube, Link, ScreenShare, UserSquare, VideoOff, Users } from "lucide-react";
import type { Participant } from "@/context/RoomContext";
import { useToast } from "@/hooks/use-toast";
import { useRooms } from "@/context/RoomContext";

// --- Sub-components for different Stage modes ---

const GalleryView = ({ participants }: { participants: Participant[] }) => {
    const { userProfile } = useRooms();
    const myVideoRef = useRef<HTMLVideoElement>(null);

    // This effect handles the user's own local video stream
    useEffect(() => {
        const getMyMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error getting my media for stage view:", err);
            }
        };
        getMyMedia();

        return () => {
            if (myVideoRef.current && myVideoRef.current.srcObject) {
                (myVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        }
    }, []);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/40 h-full">
            {participants.length > 0 ? participants.map(p => (
                <div key={p.email} className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                     {(p.isCameraOff) ? (
                         <div className="flex flex-col items-center text-muted-foreground">
                            <VideoOff className="h-12 w-12" />
                         </div>
                     ) : (
                        p.email === userProfile.email ? (
                           <video ref={myVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        ) : (
                           <Image src="https://placehold.co/640x360.png" layout="fill" objectFit="cover" alt={`${p.name}'s video feed`} data-ai-hint="person video call" />
                        )
                     )}
                     <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm font-medium">{p.name}</div>
                </div>
            )) : (
                <div className="col-span-2 flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Users className="h-16 w-16" />
                    <p className="mt-4 text-lg font-semibold">Waiting for others to join...</p>
                    <p className="text-sm">You're the first one here!</p>
                </div>
            )}
        </div>
    );
}

const YouTubeView = ({ videoUrl }: { videoUrl: string }) => {
    return (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </div>
    )
}

const ScreenShareView = ({ stream }: { stream: MediaStream | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center">
            {stream ? (
                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain bg-black" />
            ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ScreenShare className="h-16 w-16" />
                    <p className="mt-4 font-semibold">Screen share is loading...</p>
                    <p className="text-sm">Select a screen or window to share.</p>
                </div>
            )}
        </div>
    )
}


export function Stage({ participants }: { participants: Participant[] }) {
  const [mode, setMode] = useState<'gallery' | 'youtube' | 'screenshare'>('gallery');
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  
  const isSharingScreen = !!screenStream;

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('youtube-link') as HTMLInputElement;
    const link = input.value;
    if (!link) return;
    
    const videoIdMatch = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([\w-]{11})(?:\S+)?/);
    
    if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        setYoutubeUrl(embedUrl); 
        setMode('youtube');
        toast({
            title: "YouTube Video Synced",
            description: "The video is now showing on the stage.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Invalid Link",
            description: "Please paste a valid YouTube video link.",
        });
    }
  }

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
    }
    setScreenStream(null);
    setMode('gallery');
  }, []);

  const handleToggleScreenShare = async () => {
    if (isSharingScreen) {
      stopScreenShare();
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        
        // Listen for when the user stops sharing via the browser's native UI
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => {
            stopScreenShare();
          };
        }
        
        screenStreamRef.current = stream;
        setScreenStream(stream);
        setMode('screenshare');
      } catch (err) {
        console.error("Screen share error:", err);
        toast({
          variant: "destructive",
          title: "Screen Share Failed",
          description: "Could not start screen sharing. Please ensure you have granted permission and try again.",
        });
        setMode('gallery');
      }
    }
  };

  const switchToGalleryView = () => {
    if (isSharingScreen) {
      stopScreenShare();
    }
    if (mode === 'youtube') {
      setYoutubeUrl(null);
    }
    setMode('gallery');
  };

  // Cleanup effect to stop the stream when the component unmounts
  useEffect(() => {
      return () => {
          stopScreenShare();
      };
  }, [stopScreenShare]);


  const renderContent = () => {
      switch(mode) {
          case 'youtube':
              return youtubeUrl ? <YouTubeView videoUrl={youtubeUrl} /> : <GalleryView participants={participants} />;
          case 'screenshare':
              return <ScreenShareView stream={screenStream} />;
          case 'gallery':
          default:
              return <GalleryView participants={participants} />;
      }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Stage</CardTitle>
        <CardDescription>Main view for shared content and participants. Switch between views using the controls below.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1">
            {renderContent()}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSync} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="youtube-link" placeholder="Paste a YouTube video link to sync..." className="pl-9" />
                </div>
                <Button type="submit">
                    <Youtube className="mr-2 h-4 w-4" />
                    Sync
                </Button>
            </form>
            <div className="flex items-center gap-2">
                 <Button onClick={handleToggleScreenShare} variant="outline" className="w-full sm:w-auto">
                    <ScreenShare className="mr-2 h-4 w-4" />
                    {isSharingScreen ? "Stop Sharing" : "Share Screen"}
                </Button>
                 <Button onClick={switchToGalleryView} variant="outline" className="w-full sm:w-auto" disabled={mode === 'gallery'}>
                    <UserSquare className="mr-2 h-4 w-4" />
                    Gallery View
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
