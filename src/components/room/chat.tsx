
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Smile } from "lucide-react";

interface Message {
    user: string;
    text: string;
    avatar: string;
    hint: string;
}

const initialMessages: Message[] = [
  { user: "Alice", text: "Hey everyone! 👋", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
  { user: "Bob", text: "Hi Alice! What's up?", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
  { user: "You", text: "Getting ready for the presentation.", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
  { user: "Charlie", text: "Same here. Good luck!", avatar: "https://placehold.co/40x40.png", hint: "person glasses" },
  { user: "Alice", text: "You too! Let's nail this.", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      user: "You",
      text: inputValue,
      avatar: "https://placehold.co/40x40.png",
      hint: "user avatar",
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Chat</CardTitle>
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-6 pt-2">
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                 <Avatar className="h-9 w-9">
                    <AvatarImage src={msg.avatar} data-ai-hint={msg.hint} />
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${msg.user === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {msg.user !== 'You' && <p className="font-semibold text-xs pb-1">{msg.user}</p>}
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
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
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
