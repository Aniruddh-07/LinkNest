
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface Room {
  id: string;
  name: string;
  type: "public" | "private";
  password?: string;
  isHost?: boolean;
  tags?: string[];
}

interface RoomContextType {
  rooms: Room[]; // Rooms the user has joined
  allRooms: Room[]; // All rooms in the "database"
  addRoom: (roomDetails: Omit<Room, 'id' | 'isHost'>) => Room;
  leaveRoom: (roomId: string) => void;
  deleteRoom: (roomId: string) => void;
  getRoomById: (id: string) => Room | undefined;
  checkRoomPassword: (roomId: string, pass: string) => boolean;
  joinRoom: (room: Room) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Mock database of all rooms
const initialAllRooms: Room[] = [
  { id: "a1b2c3", name: "Design Team", type: "public", isHost: true, tags: ["work", "design"] },
  { id: "d4e5f6", name: "Dev Sync", type: "private", password: "password", isHost: false },
  { id: "g7h8i9", name: "Project Phoenix", type: "public", isHost: false, tags: ["work", "dev"] },
  { id: "j1k2l3", name: "Weekend Gamers", type: "public", isHost: false, tags: ["gaming", "fun"] },
  { id: "m4n5o6", name: "Study Group", type: "public", isHost: false, tags: ["study", "education"] },
];

// Initially, user has joined a subset of rooms
const initialJoinedRooms = initialAllRooms.filter(r => r.id === 'a1b2c3' || r.id === 'g7h8i9');


export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [allRooms, setAllRooms] = useState<Room[]>(initialAllRooms);
  const [rooms, setRooms] = useState<Room[]>(initialJoinedRooms); // Joined rooms

  const addRoom = useCallback((roomDetails: Omit<Room, 'id' | 'isHost'>): Room => {
    const newRoom: Room = {
      ...roomDetails,
      id: Math.random().toString(36).substring(2, 8).toLowerCase(),
      isHost: true,
    };
    
    setAllRooms((prev) => [...prev, newRoom]);
    setRooms((prev) => [...prev, newRoom]);
    return newRoom;
  }, []);

  const joinRoom = (room: Room) => {
    if (!rooms.some((r) => r.id === room.id)) {
      setRooms((prevRooms) => [...prevRooms, { ...room, isHost: false }]);
    }
    router.push(`/dashboard/rooms/${room.id}`);
  };

  const leaveRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    router.push("/dashboard");
  };

  const deleteRoom = (roomId: string) => {
    // A host is deleting the room, remove from everywhere
    setAllRooms((prev) => prev.filter((room) => room.id !== roomId));
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    router.push("/dashboard");
  }

  const getRoomById = (id: string) => {
    // Check joined rooms first to get correct isHost status
    const joinedRoom = rooms.find((room) => room.id === id);
    if (joinedRoom) return joinedRoom;
    return allRooms.find((room) => room.id === id);
  };

  const checkRoomPassword = (roomId: string, pass: string) => {
    const room = allRooms.find((room) => room.id === id);
    return room?.type === 'private' && room.password === pass;
  }

  return (
    <RoomContext.Provider value={{ rooms, allRooms, addRoom, leaveRoom, deleteRoom, getRoomById, checkRoomPassword, joinRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
};
