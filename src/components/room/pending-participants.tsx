
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRooms, type PendingUser } from "@/context/RoomContext";
import { Check, UserPlus, X } from "lucide-react";


interface PendingParticipantsProps {
  pendingUsers: PendingUser[];
  onApprove: (name: string) => void;
  onDecline: (name: string) => void;
}

export function PendingParticipants({ pendingUsers, onApprove, onDecline }: PendingParticipantsProps) {
  if (pendingUsers.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5" />
          Join Requests
        </CardTitle>
        <CardDescription>
          Approve or decline users waiting to join.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingUsers.map((user) => (
          <div key={user.name} className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} data-ai-hint={user.hint} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-medium flex-1 truncate">{user.name}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => onApprove(user.name)}>
                <Check className="h-4 w-4" />
                <span className="sr-only">Accept</span>
              </Button>
              <Button variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => onDecline(user.name)}>
                <X className="h-4 w-4" />
                 <span className="sr-only">Decline</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
