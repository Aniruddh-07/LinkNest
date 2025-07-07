
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Tag } from "lucide-react";
import { useRooms } from "@/context/RoomContext";

export function CreateRoom() {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState("");
  const router = useRouter();
  const { addRoom } = useRooms();

  const handleCreateRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    if (roomType === "private" && !password.trim()) return;

    const newRoom = addRoom({
      name: roomName,
      type: roomType,
      password: roomType === 'private' ? password : undefined,
      tags: roomType === 'public' ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
    });
    
    // Reset state and close dialog
    setRoomName("");
    setRoomType("public");
    setPassword("");
    setTags("");
    setOpen(false);

    router.push(`/dashboard/rooms/${newRoom.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Room</CardTitle>
          <CardDescription>
            Start a new session and invite others to join.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Room
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateRoom}>
          <DialogHeader>
            <DialogTitle>Create a new room</DialogTitle>
            <DialogDescription>
              Set up your room's details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="My Awesome Room"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Room Type</Label>
              <RadioGroup
                value={roomType}
                onValueChange={(value: "public" | "private") =>
                  setRoomType(value)
                }
                className="flex items-center gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="r-public" />
                  <Label htmlFor="r-public" className="font-normal">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="r-private" />
                  <Label htmlFor="r-private" className="font-normal">Private</Label>
                </div>
              </RadioGroup>
            </div>
            {roomType === "private" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={roomType === "private"}
                  placeholder="••••••••"
                />
              </div>
            )}
             {roomType === "public" && (
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. gaming, study, fun"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Separate tags with a comma.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
