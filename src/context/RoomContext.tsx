"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  type: "public" | "private";
  password?: string;
  isHost?: boolean;
}

interface RoomContextType {
  rooms: Room[]; // Rooms the user has joined
  allRooms: Room[]; // All rooms in the "database"
  addRoom: (roomDetails: Omit<Room, 'id' | 'isHost'>) => Room;
  leaveRoom: (roomId: string) => void;
  getRoomById: (id: string) => Room | undefined;
  checkRoomPassword: (roomId: string, pass: string) => boolean;
  joinRoom: (room: Room) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Mock database of all rooms
const initialAllRooms: Room[] = [
  { id: "a1b2c3", name: "Design Team", type: "public", isHost: true },
  { id: "d4e5f6", name: "Dev Sync", type: "private", password: "password", isHost: false },
  { id: "g7h8i9", name: "Project Phoenix", type: "public", isHost: false },
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
    const roomToRemove = getRoomById(roomId);
    if (roomToRemove?.isHost) {
      // If host, delete the room from everywhere
      setAllRooms((prev) => prev.filter((room) => room.id !== roomId));
    }
    // Always remove from joined list
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    router.push("/dashboard");
  };

  const getRoomById = (id: string) => {
    return allRooms.find((room) => room.id === id);
  };

  const checkRoomPassword = (roomId: string, pass: string) => {
    const room = getRoomById(roomId);
    return room?.type === 'private' && room.password === pass;
  }

  return (
    <RoomContext.Provider value={{ rooms, allRooms, addRoom, leaveRoom, getRoomById, checkRoomPassword, joinRoom }}>
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
