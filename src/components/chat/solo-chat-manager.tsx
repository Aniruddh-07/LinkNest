
"use client";

import { useRooms } from "@/context/RoomContext";
import { SoloChatBox } from "./solo-chat-box";
import { useMemo } from "react";
import type { Friend } from "@/context/RoomContext";

export function SoloChatManager() {
    const { userProfile, friends, participants, activeSoloChats, closeSoloChat } = useRooms();

    // Combine friends and all unique participants into one list for chat
    const potentialChatPartners = useMemo(() => {
        const partners = new Map<string, Friend>();
        
        friends.forEach(f => {
            partners.set(f.email, f);
        });

        // Add participants from all rooms, avoiding duplicates and self
        Object.values(participants).flat().forEach(p => {
            if (p.email !== userProfile.email && !partners.has(p.email)) {
                partners.set(p.email, {
                    name: p.name,
                    email: p.email,
                    avatar: p.avatar,
                    hint: p.hint,
                });
            }
        });

        return Array.from(partners.values());
    }, [friends, participants, userProfile.email]);
    
    const openChats = useMemo(() => 
        potentialChatPartners.filter(p => activeSoloChats.includes(p.email)),
        [potentialChatPartners, activeSoloChats]
    );
    
    if (openChats.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 right-4 z-50 flex items-end gap-4 pointer-events-none">
             {openChats.map((partner, index) => (
                 <div key={partner.email} className="pointer-events-auto" style={{ transform: `translateX(-${index * 15}%)`}}>
                    <SoloChatBox 
                        friend={partner}
                        onClose={closeSoloChat}
                    />
                </div>
            ))}
        </div>
    )
}
