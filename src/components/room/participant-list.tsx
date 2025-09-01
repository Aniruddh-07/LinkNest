
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRooms, type Participant } from "@/context/RoomContext";
import { Users, MoreHorizontal, Mic, MicOff, Video, VideoOff, ShieldCheck, UserX, MessageSquare } from "lucide-react";


interface ParticipantListProps {
  isHost?: boolean;
  participants: Participant[];
  onRemove: (email: string) => void;
  onToggleMute: (email: string) => void;
  onToggleCamera: (email: string) => void;
  onMakeHost: (email: string) => void;
}

export function ParticipantList({ isHost = false, participants, onRemove, onToggleMute, onToggleCamera, onMakeHost }: ParticipantListProps) {
  const { userProfile, openSoloChat } = useRooms();
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Participants ({participants.length})</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((p) => (
            <div key={p.email} className="flex items-center gap-4 group">
              <Avatar>
                <AvatarImage src={p.avatar} data-ai-hint={p.hint} />
                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-medium flex-1 truncate">{p.name} {p.email === userProfile.email && '(You)'}</p>
              
              <div className="flex items-center gap-2 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                {p.email !== userProfile.email && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openSoloChat(p.email)}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}
                {p.isHost && <ShieldCheck className="h-4 w-4 text-primary" title="Host" />}
                {p.isMuted && <MicOff className="h-4 w-4" title="Muted" />}
                {p.isCameraOff && <VideoOff className="h-4 w-4" title="Camera Off" />}
              </div>

              {isHost && p.email !== userProfile.email && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onToggleMute(p.email)}>
                        {p.isMuted ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />} 
                        {p.isMuted ? 'Unmute' : 'Mute'} Mic
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleCamera(p.email)}>
                        {p.isCameraOff ? <Video className="mr-2 h-4 w-4" /> : <VideoOff className="mr-2 h-4 w-4" />}
                        {p.isCameraOff ? 'Start' : 'Stop'} Camera
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMakeHost(p.email)}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {p.isHost ? 'Revoke Host' : 'Make Host'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onRemove(p.email)}>
                          <UserX className="mr-2 h-4 w-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
