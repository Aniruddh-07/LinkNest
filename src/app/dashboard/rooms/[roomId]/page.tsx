
"use client";

import { ParticipantList, type Participant } from "@/components/room/participant-list";
import { Stage } from "@/components/room/stage";
import { FileShare } from "@/components/room/file-share";
import { WalkieTalkie } from "@/components/room/walkie-talkie";
import { Badge } from "@/components/ui/badge";
import { useRooms, type DataType } from "@/context/RoomContext";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DoorOpen, Trash2, File as FileIcon, ImageIcon, Video as VideoIcon, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingParticipants, type PendingUser } from "@/components/room/pending-participants";
import { Chat } from "@/components/room/chat";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";


// Initial mock data
const initialParticipants: Participant[] = [
  { name: "You", avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: true, isMuted: false, isCameraOff: false },
  { name: "Alice", avatar: "https://placehold.co/40x40.png", hint: "woman smiling", isHost: false, isMuted: false, isCameraOff: false },
  { name: "Bob", avatar: "https://placehold.co/40x40.png", hint: "man portrait", isHost: false, isMuted: true, isCameraOff: false },
  { name: "Charlie", avatar: "https://placehold.co/40x40.png", hint: "person glasses", isHost: false, isMuted: false, isCameraOff: true },
];

const initialPendingUsers: PendingUser[] = [
  { name: "David", avatar: "https://placehold.co/40x40.png", hint: "man glasses" },
  { name: "Eve", avatar: "https://placehold.co/40x40.png", hint: "woman smiling portrait" },
];

const dataTypeIcons: Record<DataType, React.ElementType> = {
    Image: ImageIcon,
    Video: VideoIcon,
    File: FileIcon,
    Chat: MessageSquare,
};

const DataIcon = ({type}: {type: DataType}) => {
    const Icon = dataTypeIcons[type] || FileIcon;
    return <Icon className="h-5 w-5 text-muted-foreground" />
}

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const { getRoomById, deleteRoom, sharedData, deleteSharedItem } = useRooms();
  const { toast } = useToast();

  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const room = getRoomById(roomId);

  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(initialPendingUsers);

  if (!room) {
    return <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Room not found.</h1>
    </div>;
  }

  const roomName = room.name;
  const roomFiles = sharedData.filter(item => item.roomId === roomId && item.type !== 'Chat');

  const handleLeave = () => {
    router.push('/dashboard');
  }
  
  const handleDelete = () => {
    deleteRoom(roomId);
  }

  const handleApprove = (name: string) => {
    const userToApprove = pendingUsers.find(u => u.name === name);
    if (!userToApprove) return;

    setPendingUsers(prev => prev.filter(u => u.name !== name));
    setParticipants(prev => [...prev, { ...userToApprove, isHost: false, isMuted: false, isCameraOff: false }]);
  }

  const handleDecline = (name: string) => {
    setPendingUsers(prev => prev.filter(u => u.name !== name));
  }

  const handleRemove = (name: string) => {
    setParticipants(prev => prev.filter(p => p.name !== name));
  }

  const handleToggleMute = (name: string) => {
    setParticipants(prev => prev.map(p => p.name === name ? { ...p, isMuted: !p.isMuted } : p));
  }
  
  const handleToggleCamera = (name: string) => {
    setParticipants(prev => prev.map(p => p.name === name ? { ...p, isCameraOff: !p.isCameraOff } : p));
  }
  
  const handleMakeHost = (name: string) => {
    setParticipants(prev => prev.map(p => {
      // Demote current host if making another user a host
      if(p.isHost) {
        return { ...p, isHost: false };
      }
      if(p.name === name) {
        return { ...p, isHost: true }
      }
      return p;
    }));
  }

  const handleFileDelete = (itemId: string) => {
    deleteSharedItem(itemId);
    toast({
      title: "File Deleted",
      description: "The file has been removed from the room.",
    });
  }


  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{roomName}</h1>
          <Badge
            variant="outline"
            className="text-lg font-mono tracking-widest"
          >
            {roomId}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleLeave}>
                <DoorOpen className="mr-2 h-4 w-4" />
                Leave Room
            </Button>
            {room.isHost && (
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Room
                </Button>
            )}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3 flex-1 min-h-0">
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <Stage participants={participants} />
          <WalkieTalkie />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          {room.isHost && <PendingParticipants pendingUsers={pendingUsers} onApprove={handleApprove} onDecline={handleDecline} />}
          <Tabs defaultValue="participants" className="w-full flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="participants" className="flex-1 mt-6 overflow-y-auto">
                  <ParticipantList 
                    isHost={!!room.isHost} 
                    participants={participants}
                    onRemove={handleRemove}
                    onToggleMute={handleToggleMute}
                    onToggleCamera={handleToggleCamera}
                    onMakeHost={handleMakeHost}
                  />
              </TabsContent>
              <TabsContent value="chat" className="flex-1 mt-6 overflow-y-auto">
                  <Chat />
              </TabsContent>
              <TabsContent value="files" className="flex-1 mt-6 overflow-y-auto">
                <div className="flex flex-col gap-6">
                    <FileShare />
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium px-6">Shared Files</h3>
                        {roomFiles.length > 0 ? (
                            <div className="space-y-3 px-6 pb-6">
                                {roomFiles.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg border group">
                                        <DataIcon type={item.type} />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Shared on {format(item.date, "LLL dd, y")} &bull; {item.size}
                                            </p>
                                        </div>
                                        {room.isHost && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 shrink-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleFileDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No files have been shared in this room yet.</p>
                        )}
                    </div>
                </div>
              </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
