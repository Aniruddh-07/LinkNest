
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRooms, type Participant } from "@/context/RoomContext";
import { Users, MoreHorizontal, Mic, MicOff, Video, VideoOff, ShieldCheck, UserX, ShieldQuestion } from "lucide-react";


interface ParticipantListProps {
  isHost?: boolean;
  participants: Participant[];
  onRemove: (name: string) => void;
  onToggleMute: (name: string) => void;
  onToggleCamera: (name: string) => void;
  onMakeHost: (name: string) => void;
}

export function ParticipantList({ isHost = false, participants, onRemove, onToggleMute, onToggleCamera, onMakeHost }: ParticipantListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Participants ({participants.length})</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((p) => (
            <div key={p.name} className="flex items-center gap-4 group">
              <Avatar>
                <AvatarImage src={p.avatar} data-ai-hint={p.hint} />
                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-medium flex-1 truncate">{p.name} {p.name === 'You' && '(You)'}</p>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                {p.isHost && <ShieldCheck className="h-4 w-4 text-primary" title="Host" />}
                {p.isMuted && <MicOff className="h-4 w-4" title="Muted" />}
                {p.isCameraOff && <VideoOff className="h-4 w-4" title="Camera Off" />}
              </div>

              {isHost && p.name !== 'You' && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onToggleMute(p.name)}>
                        {p.isMuted ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />} 
                        {p.isMuted ? 'Unmute' : 'Mute'} Mic
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleCamera(p.name)}>
                        {p.isCameraOff ? <Video className="mr-2 h-4 w-4" /> : <VideoOff className="mr-2 h-4 w-4" />}
                        {p.isCameraOff ? 'Start' : 'Stop'} Camera
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMakeHost(p.name)}>
                        {p.isHost ? <ShieldQuestion className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        {p.isHost ? 'Revoke Host' : 'Make Host'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onRemove(p.name)}>
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
