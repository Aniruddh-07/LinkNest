
"use client";

import { ParticipantList } from "@/components/room/participant-list";
import { Stage } from "@/components/room/stage";
import { FileShare } from "@/components/room/file-share";
import { WalkieTalkie } from "@/components/room/walkie-talkie";
import { Badge } from "@/components/ui/badge";
import { useRooms, type DataType } from "@/context/RoomContext";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DoorOpen, Trash2, File as FileIcon, ImageIcon, Video as VideoIcon, MessageSquare, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingParticipants } from "@/components/room/pending-participants";
import { Chat } from "@/components/room/chat";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";


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
  const { 
    getRoomById, deleteRoom, sharedData, deleteSharedItem,
    participants, pendingUsers, approveUser, declineUser, removeParticipant,
    toggleMute, toggleCamera, makeHost
  } = useRooms();
  const { toast } = useToast();

  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const room = getRoomById(roomId);

  const currentParticipants = participants[roomId] || [];
  const currentPendingUsers = pendingUsers[roomId] || [];

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

  const handleApprove = (userEmail: string) => {
    approveUser(roomId, userEmail);
  }

  const handleDecline = (userEmail: string) => {
    declineUser(roomId, userEmail);
  }

  const handleRemove = (userEmail: string) => {
    removeParticipant(roomId, userEmail);
  }

  const handleToggleMute = (userEmail: string) => {
    toggleMute(roomId, userEmail);
  }
  
  const handleToggleCamera = (userEmail: string) => {
    toggleCamera(roomId, userEmail);
  }
  
  const handleMakeHost = (userEmail: string) => {
    makeHost(roomId, userEmail);
  }

  const handleFileDelete = (itemId: string) => {
    deleteSharedItem(itemId);
    toast({
      title: "File Deleted",
      description: "The file has been removed from the room.",
    });
  }

  const handleDownloadItem = (itemName: string) => {
    toast({
        title: "Download Started",
        description: `"${itemName}" will begin downloading shortly.`,
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
          <Stage participants={currentParticipants} />
          <WalkieTalkie />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          {room.isHost && <PendingParticipants pendingUsers={currentPendingUsers} onApprove={handleApprove} onDecline={handleDecline} />}
          <Tabs defaultValue="participants" className="w-full flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="participants" className="flex-1 mt-6 overflow-y-auto">
                  <ParticipantList 
                    isHost={!!room.isHost} 
                    participants={currentParticipants}
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
                                        <div className="flex items-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 shrink-0"
                                                onClick={() => handleDownloadItem(item.name)}
                                            >
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">Download</span>
                                            </Button>
                                            {room.isHost && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                                                    onClick={() => handleFileDelete(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            )}
                                        </div>
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
