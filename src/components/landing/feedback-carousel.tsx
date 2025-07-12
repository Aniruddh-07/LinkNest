
"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const feedbackData = [
  {
    name: "Alex Johnson",
    handle: "@alexj",
    avatar: "https://placehold.co/48x48.png",
    hint: "man smiling",
    feedback: "LinkNest has transformed how our team collaborates. The synchronized media playback is a game-changer for our remote design reviews. Absolutely seamless!"
  },
  {
    name: "Samantha Lee",
    handle: "@samanthacodes",
    avatar: "https://placehold.co/48x48.png",
    hint: "woman glasses",
    feedback: "As a developer, I appreciate the simplicity and power of LinkNest. Setting up a private room for a quick sync is effortless. The walkie-talkie feature is surprisingly useful."
  },
  {
    name: "Michael Chen",
    handle: "@mikechen",
    avatar: "https://placehold.co/48x48.png",
    hint: "man portrait",
    feedback: "Our study group uses LinkNest daily. We can share files, watch lectures together, and chat without juggling multiple apps. It's been essential for our productivity."
  },
  {
    name: "Jessica Williams",
    handle: "@jessw",
    avatar: "https://placehold.co/48x48.png",
    hint: "woman portrait",
    feedback: "I love how easy it is to just jump into a room and start sharing. No complicated setups, no accounts needed for guests. It's collaboration made simple and effective."
  },
  {
    name: "David Rodriguez",
    handle: "@daverod",
    avatar: "https://placehold.co/48x48.png",
    hint: "person smiling",
    feedback: "The real-time communication tools are top-notch. It feels like we're all in the same room, even when we're miles apart. A fantastic tool for any remote team."
  }
];

export function FeedbackCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {feedbackData.map((item, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col aspect-[4/3] items-start justify-between p-6">
                    <p className="text-muted-foreground text-left leading-relaxed flex-grow">&ldquo;{item.feedback}&rdquo;</p>
                    <div className="flex items-center gap-4 pt-6">
                        <Avatar>
                            <AvatarImage src={item.avatar} data-ai-hint={item.hint} />
                            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.handle}</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
