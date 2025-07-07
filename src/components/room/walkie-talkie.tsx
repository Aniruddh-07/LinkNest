"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Video } from "lucide-react";

export function WalkieTalkie() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Comms</CardTitle>
        <Video className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <Image
              src="https://placehold.co/600x400.png"
              layout="fill"
              objectFit="cover"
              alt="Camera view placeholder"
              data-ai-hint="webcam view"
              className="opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground/50"/>
            </div>
          </div>
          <Button
            className="w-full h-12 group active:bg-primary/90"
          >
            <Mic className="mr-2 h-5 w-5 transition-transform group-active:scale-110" />
            Push to Talk
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
