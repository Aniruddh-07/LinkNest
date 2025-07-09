import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, MoreHorizontal, MicOff, VideoOff, ShieldCheck, UserX } from "lucide-react";

const participants = [
  { name: "You", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
  { name: "Alice", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
  { name: "Bob", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
  { name: "Charlie", avatar: "https://placehold.co/40x40.png", hint: "person glasses" },
];

interface ParticipantListProps {
  isHost?: boolean;
}

export function ParticipantList({ isHost = false }: ParticipantListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Participants</CardTitle>
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
              <p className="font-medium flex-1 truncate">{p.name}</p>
              {isHost && p.name !== 'You' && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <MicOff className="mr-2 h-4 w-4" /> Mute Mic
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <VideoOff className="mr-2 h-4 w-4" /> Stop Camera
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Make Host
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
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
