
"use client";

import { useRooms } from "@/context/RoomContext";
import { SoloChatBox } from "./solo-chat-box";
import { useMemo } from "react";
import type { Friend, Participant } from "@/context/RoomContext";

export function SoloChatManager() {
    const { friends, participants, activeSoloChats, closeSoloChat, userProfile } = useRooms();

    const openChats = useMemo(() => {
        if (activeSoloChats.length === 0) return [];

        const allUsersMap = new Map<string, Friend | Participant>();

        friends.forEach(f => allUsersMap.set(f.email, f));

        Object.values(participants).flat().forEach(p => {
            if (!allUsersMap.has(p.email) && p.email !== userProfile.email) {
                allUsersMap.set(p.email, p);
            }
        });

        return activeSoloChats
            .map(email => allUsersMap.get(email))
            .filter((p): p is Friend => !!p);

    }, [activeSoloChats, friends, participants, userProfile.email]);

    if (openChats.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 right-0 h-0 w-0">
            {openChats.map((partner, index) => (
                <SoloChatBox
                    key={partner.email}
                    friend={partner}
                    onClose={closeSoloChat}
                    defaultPosition={{ x: -(index * 336 + 16), y: -448 }}
                />
            ))}
        </div>
    );
}
