"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export function CreateRoom() {
  const router = useRouter();

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/dashboard/rooms/${newRoomId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Room</CardTitle>
        <CardDescription>
          Start a new session and invite others to join.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleCreateRoom}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </CardContent>
    </Card>
  );
}
