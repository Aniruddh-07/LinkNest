import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const participants = [
  { name: "Alice", avatar: "https://placehold.co/40x40.png?text=A", hint: "woman smiling" },
  { name: "Bob", avatar: "https://placehold.co/40x40.png?text=B", hint: "man portrait" },
  { name: "Charlie", avatar: "https://placehold.co/40x40.png?text=C", hint: "person glasses" },
  { name: "You", avatar: "https://placehold.co/40x40.png?text=Y", hint: "user avatar" },
];

export function ParticipantList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Participants</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((p) => (
            <div key={p.name} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={p.avatar} data-ai-hint={p.hint} />
                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{p.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
