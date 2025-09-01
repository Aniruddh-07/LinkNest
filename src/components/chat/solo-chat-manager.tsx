
"use client";

import { useRooms } from "@/context/RoomContext";
import { SoloChatBox } from "./solo-chat-box";
import { useMemo } from "react";

export function SoloChatManager() {
    const { friends, participants, activeSoloChats, closeSoloChat } = useRooms();

    // Combine friends and all unique participants into one list for chat
    const potentialChatPartners = useMemo(() => {
        const partners = new Map<string, {name: string, email: string, avatar: string, hint: string}>();
        
        friends.forEach(f => {
            partners.set(f.email, f);
        });

        Object.values(participants).flat().forEach(p => {
            if (!partners.has(p.email)) {
                partners.set(p.email, p);
            }
        });

        return Array.from(partners.values());
    }, [friends, participants]);
    
    const openChats = potentialChatPartners.filter(p => activeSoloChats.includes(p.email));
    
    if (openChats.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
             {openChats.map((partner, index) => (
                 <div key={partner.email} className="absolute bottom-0 right-4 pointer-events-auto" style={{ right: `${index * 21}rem`}}>
                    <SoloChatBox 
                        friend={partner}
                        onClose={closeSoloChat}
                        defaultPosition={{x: -250 * index, y: 0}}
                    />
                </div>
            ))}
        </div>
    )
}
