
"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Smile } from "lucide-react";
import { useParams } from "next/navigation";
import { useRooms, type ChatMessage } from "@/context/RoomContext";

export function Chat() {
  const [inputValue, setInputValue] = useState("");
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const { getRoomById, addSharedItem, messages, addMessage, userProfile } = useRooms();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const roomMessages = messages[roomId] || [];

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [roomMessages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessageText = inputValue;

    const newMessage: ChatMessage = {
      user: userProfile.name,
      text: userMessageText,
      avatar: "https://placehold.co/40x40.png", // This should probably come from user profile
    };

    addMessage(roomId, newMessage);
    setInputValue("");
    
    // Log the chat to data management
    const room = getRoomById(roomId);
    if (room) {
        addSharedItem({
            type: 'Chat',
            name: `Chat: ${userMessageText.substring(0, 30)}...`,
            room: room.name,
            roomId: room.id,
            date: new Date(),
            size: '<1KB',
        });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Chat</CardTitle>
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-6 pt-2">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {roomMessages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                    No messages yet. Start the conversation!
                </div>
            ) : roomMessages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.user === userProfile.name ? 'flex-row-reverse' : ''}`}>
                 <Avatar className="h-9 w-9">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${msg.user === userProfile.name ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {(msg.user !== userProfile.name) && 
                    <p className={`font-semibold text-xs pb-1`}>
                      {msg.user}
                    </p>}
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="relative">
          <Input 
            placeholder="Type a message..." 
            className="pr-20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled>
              <Smile className="h-4 w-4" />
            </Button>
            <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
