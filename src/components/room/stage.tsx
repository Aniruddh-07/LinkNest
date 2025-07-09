
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Youtube, Play, Pause, Link, Loader2, ScreenShare, UserSquare } from "lucide-react";
import type { Participant } from "./participant-list";
import { useToast } from "@/hooks/use-toast";

// --- Sub-components for different Stage modes ---

const GalleryView = ({ participants }: { participants: Participant[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/40 h-full">
        {participants.map(p => (
            <div key={p.name} className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                 <Image src="https://placehold.co/640x360.png" layout="fill" objectFit="cover" alt={`${p.name}'s video feed`} data-ai-hint="person video call" />
                 <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm font-medium">{p.name}</div>
            </div>
        ))}
    </div>
);

const YouTubeView = ({ videoUrl }: { videoUrl: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <Image src={videoUrl} layout="fill" objectFit="cover" alt="Video placeholder" data-ai-hint="youtube player" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button size="icon" variant="secondary" className="h-16 w-16 rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8" />}
                </Button>
            </div>
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const isSharingScreen = !!screenStream;
  const { toast } = useToast();

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('youtube-link') as HTMLInputElement;
    const link = input.value;
    if (!link) return;

    setIsSyncing(true);
    setTimeout(() => {
        setYoutubeUrl("https://placehold.co/1280x720.png"); 
        setMode('youtube');
        setIsSyncing(false);
    }, 1500)
  }

  const stopScreenShare = useCallback(() => {
      if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
          setMode('gallery');
      }
  }, [screenStream]);


  const handleToggleScreenShare = async () => {
    if (isSharingScreen) {
        stopScreenShare();
    } else {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });
            
            // Listen for the user to stop sharing from the browser's native UI
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                stopScreenShare();
            });
            
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
  }

  useEffect(() => {
      // Cleanup effect to stop the stream when the component unmounts
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
                    <Input name="youtube-link" placeholder="Paste a YouTube video link to sync..." className="pl-9" disabled={isSyncing}/>
                </div>
                <Button type="submit" disabled={isSyncing}>
                    {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Youtube className="mr-2 h-4 w-4" />}
                    Sync
                </Button>
            </form>
            <div className="flex items-center gap-2">
                 <Button onClick={handleToggleScreenShare} variant="outline" className="w-full sm:w-auto">
                    <ScreenShare className="mr-2 h-4 w-4" />
                    {isSharingScreen ? "Stop Sharing" : "Share Screen"}
                </Button>
                 <Button onClick={() => { stopScreenShare(); setMode('gallery'); }} variant="outline" className="w-full sm:w-auto" disabled={mode === 'gallery'}>
                    <UserSquare className="mr-2 h-4 w-4" />
                    Gallery View
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
