"use client";

import { ParticipantList } from "@/components/room/participant-list";
import { MediaSync } from "@/components/room/media-sync";
import { FileShare } from "@/components/room/file-share";
import { WalkieTalkie } from "@/components/room/walkie-talkie";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/context/RoomContext";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DoorOpen, Trash2 } from "lucide-react";

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const { getRoomById, leaveRoom } = useRooms();

  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const room = getRoomById(roomId);

  if (!room) {
    // Optionally, show a "Room not found" message or redirect
    return <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Room not found.</h1>
    </div>;
  }

  const roomName = room.name;

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
        <Button variant="outline" onClick={() => leaveRoom(roomId)}>
          {room.isHost ? <Trash2 className="mr-2 h-4 w-4" /> : <DoorOpen className="mr-2 h-4 w-4" />}
          {room.isHost ? 'Delete Room' : 'Leave Room'}
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
