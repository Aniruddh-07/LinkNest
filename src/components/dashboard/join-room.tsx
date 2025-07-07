"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, KeyRound } from "lucide-react";
import { useRooms } from "@/context/RoomContext";

export function JoinRoom() {
  const router = useRouter();
  const { toast } = useToast();
  const { rooms: joinedRooms, getRoomById, checkRoomPassword, joinRoom } = useRooms();

  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [roomToJoin, setRoomToJoin] = useState<any | null>(null);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCode.trim();
    if (!code) return;

    // Check if user has already joined
    if (joinedRooms.some(r => r.id === code)) {
      router.push(`/dashboard/rooms/${code}`);
      return;
    }
    
    const room = getRoomById(code);

    if (!room) {
      toast({
        variant: "destructive",
        title: "Room not found",
        description: "The room code you entered is invalid.",
      });
      return;
    }

    if (room.type === "private") {
      setRoomToJoin(room);
      setIsPasswordDialogOpen(true);
    } else {
      joinRoom(room);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomToJoin) return;
    
    const isCorrect = checkRoomPassword(roomToJoin.id, password);

    if (isCorrect) {
      joinRoom(roomToJoin);
      setIsPasswordDialogOpen(false);
      setPassword("");
      setRoomToJoin(null);
    } else {
      toast({
        variant: "destructive",
        title: "Incorrect Password",
        description: "The password for this private room is incorrect.",
      });
    }
  };

  return (
    <>
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

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader>
              <DialogTitle>Password Required</DialogTitle>
              <DialogDescription>
                This room is private. Please enter the password to join.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="room-password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="room-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Join Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
