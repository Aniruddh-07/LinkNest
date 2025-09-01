
"use client";

import { useRooms } from "@/context/RoomContext";
import { SoloChatBox } from "./solo-chat-box";

export function SoloChatManager() {
    const { friends, activeSoloChats, closeSoloChat } = useRooms();

    const openChats = friends.filter(f => activeSoloChats.includes(f.email));
    
    return (
        <div className="fixed bottom-0 right-4 flex items-end gap-4 z-50">
            {openChats.map(friend => (
                <SoloChatBox 
                    key={friend.email}
                    friend={friend}
                    onClose={closeSoloChat}
                />
            ))}
        </div>
    )
}
