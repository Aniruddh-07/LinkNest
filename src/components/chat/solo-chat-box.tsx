
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRooms, type Friend, type ChatMessage } from "@/context/RoomContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface SoloChatBoxProps {
    friend: Friend;
    onClose: (email: string) => void;
}

export function SoloChatBox({ friend, onClose }: SoloChatBoxProps) {
    const { 
        userProfile,
        soloChatMessages,
        addSoloMessage,
    } = useRooms();

    const [inputValue, setInputValue] = useState("");
    const messages = soloChatMessages[friend.email] || [];
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (scrollViewport) {
                scrollViewport.scrollTop = scrollViewport.scrollHeight;
            }
        }
      }, [messages]);

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage: ChatMessage = {
            user: userProfile.name,
            text: inputValue,
            avatar: "https://placehold.co/40x40.png",
            hint: "user avatar",
        };

        addSoloMessage(friend.email, newMessage);
        setInputValue("");
    }

    return (
        <Card className="w-80 h-[28rem] flex flex-col shadow-2xl rounded-t-lg">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatar} data-ai-hint={friend.hint} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{friend.name}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onClose(friend.email)}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-4 space-y-4">
                        {messages.map((msg, index) => (
                             <div key={index} className={cn("flex items-start gap-3", msg.user === userProfile.name ? 'flex-row-reverse' : '')}>
                                <Avatar className="h-8 w-8">
                                   <AvatarImage src={msg.avatar} data-ai-hint={msg.hint} />
                                   <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                               </Avatar>
                               <div className={cn("rounded-lg px-3 py-2 text-sm max-w-[85%]", msg.user === userProfile.name ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                 <p>{msg.text}</p>
                               </div>
                             </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-2 border-t">
                 <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                    <Input 
                        placeholder="Type a message..." 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoComplete="off"
                    />
                    <Button type="button" variant="ghost" size="icon"><Mic className="h-4 w-4" /></Button>
                    <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
                </form>
            </CardFooter>
        </Card>
    );
}
