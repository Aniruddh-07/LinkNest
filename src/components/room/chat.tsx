
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Smile, Bot } from "lucide-react";
import { chatAssistant } from "@/ai/flows/chat-assistant-flow";

interface Message {
    user: string;
    text: string;
    avatar: string;
    hint: string;
}

const initialMessages: Message[] = [
  { user: "Alice", text: "Hey everyone! 👋", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
  { user: "Bob", text: "Hi Alice! What's up?", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
  { user: "You", text: "Getting ready for the presentation. /a please summarize our goals.", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAssistantThinking) return;

    const userMessageText = inputValue;

    const newMessage: Message = {
      user: "You",
      text: userMessageText,
      avatar: "https://placehold.co/40x40.png",
      hint: "user avatar",
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue("");
    
    // Check if the message triggers the assistant
    if (userMessageText.trim().toLowerCase().startsWith("/a")) {
        setIsAssistantThinking(true);
        try {
          // Create a version of the history for the AI, stripping the command from the last message
          const aiHistory = updatedMessages.map((m, index) => {
              if (index === updatedMessages.length - 1) { // If it's the last message
                  return { user: m.user, text: m.text.replace(/^\/a\s*/i, "") }; // Remove /a and leading space
              }
              return { user: m.user, text: m.text };
          });

          const assistantInput = {
            history: aiHistory,
          };
          const response = await chatAssistant(assistantInput);
          
          const assistantMessage: Message = {
            user: "Assistant",
            text: response.reply,
            avatar: "https://placehold.co/40x40.png",
            hint: "robot assistant",
          };
          setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
          console.error("AI Assistant error:", error);
          const errorMessage: Message = {
            user: "Assistant",
            text: "Sorry, I'm having trouble connecting. Please try again later.",
            avatar: "https://placehold.co/40x40.png",
            hint: "robot error",
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsAssistantThinking(false);
        }
    }
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
                  {(msg.user !== 'You') && 
                    <p className={`font-semibold text-xs pb-1 ${msg.user === 'Assistant' ? 'text-primary' : ''} flex items-center gap-1`}>
                      {msg.user === 'Assistant' && <Bot className="h-3 w-3" />}
                      {msg.user}
                    </p>}
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {isAssistantThinking && (
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="robot assistant" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-3 py-2 text-sm max-w-[80%] bg-muted">
                  <p className="font-semibold text-xs pb-1 text-primary flex items-center gap-1"><Bot className="h-3 w-3" /> Assistant</p>
                  <p className="flex items-center gap-1">
                    <span className="animate-pulse">...</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="relative">
          <Input 
            placeholder="Type a message... (use /a to talk to AI)" 
            className="pr-20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAssistantThinking}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled>
              <Smile className="h-4 w-4" />
            </Button>
            <Button type="submit" variant="ghost" size="icon" className="h-8 w-8" disabled={isAssistantThinking}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
