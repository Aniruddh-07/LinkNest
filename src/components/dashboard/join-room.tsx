"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";

export function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = React.useState("");

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/dashboard/rooms/${roomCode.trim()}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join an Existing Room</CardTitle>
        <CardDescription>
          Enter the 6-character code to join a room.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJoinRoom} className="flex gap-2">
          <Input
            placeholder="e.g., a1b2c3"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            maxLength={6}
            className="flex-1"
          />
          <Button type="submit">
            <LogIn className="mr-2 h-4 w-4" />
            Join
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
