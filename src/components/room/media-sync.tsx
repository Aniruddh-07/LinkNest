
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Youtube, Play, Pause, Link, Loader2 } from "lucide-react";

export function MediaSync() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
    }, 1500)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Media Sync</CardTitle>
        <Youtube className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSync} className="flex gap-2 mb-4">
            <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Paste a YouTube video link..." className="pl-9"/>
            </div>
            <Button type="submit" disabled={isSyncing}>
                {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Sync
            </Button>
        </form>

        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <Image src="https://placehold.co/1280x720.png" layout="fill" objectFit="cover" alt="Video placeholder" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button size="icon" variant="secondary" className="h-16 w-16 rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8" />}
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
