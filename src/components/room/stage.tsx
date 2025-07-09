
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Youtube, Play, Pause, Link, Loader2, ScreenShare, UserSquare } from "lucide-react";

// Mock data, same as participant-list
const participants = [
  { name: "Alice", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
  { name: "Bob", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
  { name: "Charlie", avatar: "https://placehold.co/40x40.png", hint: "person glasses" },
  { name: "You", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
];

const GalleryView = () => (
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

const ScreenShareView = () => (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center">
         <Image src="https://placehold.co/1280x720.png" layout="fill" objectFit="contain" alt="Screen share placeholder" data-ai-hint="desktop screen code" />
    </div>
)


export function Stage() {
  const [mode, setMode] = useState<'gallery' | 'youtube' | 'screenshare'>('gallery');
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('youtube-link') as HTMLInputElement;
    const link = input.value;
    if (!link) return;

    setIsSyncing(true);
    setTimeout(() => {
        // In a real app, you'd validate the link and get video info
        setYoutubeUrl("https://placehold.co/1280x720.png"); 
        setMode('youtube');
        setIsSyncing(false);
    }, 1500)
  }

  const handleToggleScreenShare = () => {
    const nextState = !isSharingScreen;
    setIsSharingScreen(nextState);
    if (nextState) {
        setMode('screenshare');
    } else {
        setMode('gallery');
    }
  }

  const renderContent = () => {
      switch(mode) {
          case 'youtube':
              return youtubeUrl ? <YouTubeView videoUrl={youtubeUrl} /> : <GalleryView />;
          case 'screenshare':
              return <ScreenShareView />;
          case 'gallery':
          default:
              return <GalleryView />;
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
                 <Button onClick={() => setMode('gallery')} variant="outline" className="w-full sm:w-auto" disabled={mode === 'gallery'}>
                    <UserSquare className="mr-2 h-4 w-4" />
                    Gallery View
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
