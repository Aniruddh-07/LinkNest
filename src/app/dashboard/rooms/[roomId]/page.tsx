import { ParticipantList } from "@/components/room/participant-list";
import { MediaSync } from "@/components/room/media-sync";
import { FileShare } from "@/components/room/file-share";
import { WalkieTalkie } from "@/components/room/walkie-talkie";
import { Badge } from "@/components/ui/badge";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Room</h1>
        <Badge variant="outline" className="text-lg font-mono tracking-widest">{params.roomId}</Badge>
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
