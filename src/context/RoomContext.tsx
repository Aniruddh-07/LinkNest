"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface Room {
  id: string;
  name: string;
}

interface RoomContextType {
  rooms: Room[];
  addRoom: (room: Room) => void;
  getRoomById: (id: string) => Room | undefined;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

const initialRooms: Room[] = [
  { id: "a1b2c3", name: "Design Team" },
  { id: "d4e5f6", name: "Dev Sync" },
  { id: "g7h8i9", name: "Project Phoenix" },
];

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  const addRoom = (room: Room) => {
    if (!rooms.some((r) => r.id === room.id)) {
      setRooms((prevRooms) => [...prevRooms, room]);
    }
  };

  const getRoomById = (id: string) => {
    return rooms.find((room) => room.id === id);
  };

  return (
    <RoomContext.Provider value={{ rooms, addRoom, getRoomById }}>
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
