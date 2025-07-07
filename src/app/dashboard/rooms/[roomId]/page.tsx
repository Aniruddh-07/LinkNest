"use client";

import { ParticipantList } from "@/components/room/participant-list";
import { MediaSync } from "@/components/room/media-sync";
import { FileShare } from "@/components/room/file-share";
import { WalkieTalkie } from "@/components/room/walkie-talkie";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/context/RoomContext";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DoorOpen } from "lucide-react";

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const { getRoomById } = useRooms();

  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const room = getRoomById(roomId);
  const roomName = room ? room.name : "Room";

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{roomName}</h1>
          <Badge
            variant="outline"
            className="text-lg font-mono tracking-widest"
          >
            {roomId}
          </Badge>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <DoorOpen className="mr-2 h-4 w-4" />
          Leave Room
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <MediaSync />
          <FileShare />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <ParticipantList />
          <WalkieTalkie />
        </div>
      </div>
    </div>
  );
}
