
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

export interface UserProfile {
  name: string;
  email: string;
}

export interface Label {
    id: string;
    name: string;
}

export type DataType = "Image" | "Video" | "File" | "Chat";

export interface SharedData {
    id: string;
    type: DataType;
    name: string;
    room: string;
    roomId: string;
    date: Date;
    size: string;
}

export interface Friend {
  name: string;
  email: string;
  avatar: string;
  hint: string;
}

interface RoomContextType {
  rooms: Room[]; // Rooms the user has joined
  allRooms: Room[]; // All rooms in the "database"
  addRoom: (roomDetails: Omit<Room, 'id' | 'isHost'>) => Room;
  removeFromJoined: (roomId: string) => void;
  deleteRoom: (roomId: string) => void;
  getRoomById: (id: string) => Room | undefined;
  checkRoomPassword: (roomId: string, pass: string) => boolean;
  joinRoom: (room: Room) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  labels: Label[];
  addLabel: (name: string) => void;
  updateLabel: (labelId: string, newName: string) => void;
  deleteLabel: (labelId: string) => void;
  roomLabelAssignments: Record<string, string>;
  assignLabelToRoom: (roomId: string, labelId: string | null) => void;
  sharedData: SharedData[];
  addSharedItem: (item: Omit<SharedData, 'id'>) => void;
  deleteSharedItem: (itemId: string) => void;
  deleteAllSharedData: () => void;
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  removeFriend: (email: string) => void;
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
const initialJoinedRooms = initialAllRooms.filter(r => r.id === 'a1b2c3' || r.id === 'g7h8i9' || r.id === 'j1k2l3');

const initialUserProfile: UserProfile = {
  name: "User",
  email: "user@example.com",
};

const initialLabels: Label[] = [
    { id: "lbl-1", name: "Work" },
    { id: "lbl-2", name: "Fun" },
]

const initialAssignments: Record<string, string> = {
    "a1b2c3": "lbl-1",
    "g7h8i9": "lbl-1",
    "j1k2l3": "lbl-2",
};

const initialSharedData: SharedData[] = [
    { id: "1", type: "Image", name: "moodboard.png", room: "Design Team", roomId: "a1b2c3", date: new Date(2024, 6, 10), size: "2.5MB" },
    { id: "2", type: "Chat", name: "Chat History Excerpt", room: "Design Team", roomId: "a1b2c3", date: new Date(2024, 6, 10), size: "5KB" },
    { id: "3", type: "File", name: "requirements.docx", room: "Project Phoenix", roomId: "g7h8i9", date: new Date(2024, 6, 8), size: "1.2MB" },
];

const initialFriends: Friend[] = [
  { name: "Alice", email: "alice@example.com", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
  { name: "Bob", email: "bob@example.com", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
];


export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [allRooms, setAllRooms] = useState<Room[]>(initialAllRooms);
  const [rooms, setRooms] = useState<Room[]>(initialJoinedRooms); // Joined rooms
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [roomLabelAssignments, setRoomLabelAssignments] = useState<Record<string, string>>(initialAssignments);
  const [sharedData, setSharedData] = useState<SharedData[]>(initialSharedData);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);

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

  const removeFromJoined = (roomId: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    // Also remove from assignments
    setRoomLabelAssignments(prev => {
        const newAssignments = {...prev};
        delete newAssignments[roomId];
        return newAssignments;
    });
    router.push("/dashboard");
  };

  const deleteRoom = (roomId: string) => {
    // A host is deleting the room, remove from everywhere
    setAllRooms((prev) => prev.filter((room) => room.id !== roomId));
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    setSharedData((prev) => prev.filter((item) => item.roomId !== roomId));
    setRoomLabelAssignments(prev => {
        const newAssignments = {...prev};
        delete newAssignments[roomId];
        return newAssignments;
    });
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

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const addLabel = (name: string) => {
    const newLabel: Label = {
        id: `lbl-${Math.random().toString(36).substring(2, 8)}`,
        name,
    };
    setLabels(prev => [...prev, newLabel]);
  }

  const updateLabel = (labelId: string, newName: string) => {
    setLabels(prev => prev.map(label => label.id === labelId ? { ...label, name: newName } : label));
  };

  const deleteLabel = (labelId: string) => {
    setLabels(prev => prev.filter(label => label.id !== labelId));
    // Unassign rooms that had this label
    setRoomLabelAssignments(prev => {
        const newAssignments = {...prev};
        Object.keys(newAssignments).forEach(roomId => {
            if (newAssignments[roomId] === labelId) {
                delete newAssignments[roomId];
            }
        });
        return newAssignments;
    });
  };

  const assignLabelToRoom = (roomId: string, labelId: string | null) => {
    setRoomLabelAssignments(prev => {
        const newAssignments = {...prev};
        if (labelId === null) {
            delete newAssignments[roomId];
        } else {
            newAssignments[roomId] = labelId;
        }
        return newAssignments;
    });
  }

  const addSharedItem = useCallback((item: Omit<SharedData, 'id'>) => {
    const newItem: SharedData = {
      ...item,
      id: Math.random().toString(36).substring(2, 8),
    };
    setSharedData(prev => [newItem, ...prev]);
  }, []);

  const deleteSharedItem = useCallback((itemId: string) => {
    setSharedData(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const deleteAllSharedData = useCallback(() => {
    setSharedData([]);
  }, []);

  const addFriend = useCallback((friend: Friend) => {
    setFriends(prev => [...prev, friend]);
  }, []);

  const removeFriend = useCallback((email: string) => {
    setFriends(prev => prev.filter(f => f.email !== email));
  }, []);


  return (
    <RoomContext.Provider value={{ 
        rooms, 
        allRooms, 
        addRoom, 
        removeFromJoined, 
        deleteRoom, 
        getRoomById, 
        checkRoomPassword, 
        joinRoom, 
        userProfile, 
        updateUserProfile,
        labels,
        addLabel,
        updateLabel,
        deleteLabel,
        roomLabelAssignments,
        assignLabelToRoom,
        sharedData,
        addSharedItem,
        deleteSharedItem,
        deleteAllSharedData,
        friends,
        addFriend,
        removeFriend
    }}>
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
