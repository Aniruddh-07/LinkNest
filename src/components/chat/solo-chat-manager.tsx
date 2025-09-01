
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
        <div className="fixed bottom-0 right-4 flex items-end gap-4 z-[100]">
            {openChats.map((partner) => (
                <SoloChatBox
                    key={partner.email}
                    friend={partner}
                    onClose={closeSoloChat}
                />
            ))}
        </div>
    );
}
