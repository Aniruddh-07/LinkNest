
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

export interface Participant {
  name: string;
  avatar: string;
  hint: string;
  isHost: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
}

export interface PendingUser {
  name: string;
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
  participants: Record<string, Participant[]>;
  pendingUsers: Record<string, PendingUser[]>;
  approveUser: (roomId: string, userName: string) => void;
  declineUser: (roomId: string, userName: string) => void;
  removeParticipant: (roomId: string, userName: string) => void;
  toggleMute: (roomId: string, userName: string) => void;
  toggleCamera: (roomId: string, userName: string) => void;
  makeHost: (roomId: string, userName: string) => void;
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

const initialParticipants: Record<string, Participant[]> = {
  "a1b2c3": [
    { name: "You", avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: true, isMuted: false, isCameraOff: false },
    { name: "Alice", avatar: "https://placehold.co/40x40.png", hint: "woman smiling", isHost: false, isMuted: false, isCameraOff: false },
  ],
  "g7h8i9": [
    { name: "You", avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: true, isMuted: false, isCameraOff: false },
    { name: "Bob", avatar: "https://placehold.co/40x40.png", hint: "man portrait", isHost: false, isMuted: true, isCameraOff: false },
    { name: "Charlie", avatar: "https://placehold.co/40x40.png", hint: "person glasses", isHost: false, isMuted: false, isCameraOff: true },
  ],
  "j1k2l3": [
    { name: "You", avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: true, isMuted: false, isCameraOff: false },
  ],
  "d4e5f6": [ // joined private room
    { name: "You", avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: false, isMuted: false, isCameraOff: false },
  ],
};

const initialPendingUsers: Record<string, PendingUser[]> = {
  "a1b2c3": [
    { name: "David", avatar: "https://placehold.co/40x40.png", hint: "man glasses" },
    { name: "Eve", avatar: "https://placehold.co/40x40.png", hint: "woman smiling portrait" },
  ]
};


export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [allRooms, setAllRooms] = useState<Room[]>(initialAllRooms);
  const [rooms, setRooms] = useState<Room[]>(initialJoinedRooms); // Joined rooms
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [roomLabelAssignments, setRoomLabelAssignments] = useState<Record<string, string>>(initialAssignments);
  const [sharedData, setSharedData] = useState<SharedData[]>(initialSharedData);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [participants, setParticipants] = useState<Record<string, Participant[]>>(initialParticipants);
  const [pendingUsers, setPendingUsers] = useState<Record<string, PendingUser[]>>(initialPendingUsers);

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

  const approveUser = useCallback((roomId: string, userName: string) => {
    setPendingUsers(prev => {
      const roomPending = prev[roomId] || [];
      const userToApprove = roomPending.find(u => u.name === userName);
      if (!userToApprove) return prev;

      const newPending = { ...prev, [roomId]: roomPending.filter(u => u.name !== userName) };
      
      setParticipants(prevParts => {
        const roomParticipants = prevParts[roomId] || [];
        const newParticipant: Participant = { ...userToApprove, isHost: false, isMuted: false, isCameraOff: false };
        return { ...prevParts, [roomId]: [...roomParticipants, newParticipant] };
      });

      return newPending;
    });
  }, []);

  const declineUser = useCallback((roomId: string, userName: string) => {
    setPendingUsers(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(u => u.name !== userName)
    }));
  }, []);

  const removeParticipant = useCallback((roomId: string, userName: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(p => p.name !== userName)
    }));
  }, []);

  const toggleMute = useCallback((roomId: string, userName: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(p => p.name === userName ? { ...p, isMuted: !p.isMuted } : p)
    }));
  }, []);

  const toggleCamera = useCallback((roomId: string, userName: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(p => p.name === userName ? { ...p, isCameraOff: !p.isCameraOff } : p)
    }));
  }, []);

  const makeHost = useCallback((roomId: string, userName: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(p => {
        if(p.name === 'You' && p.isHost) {
            // Demote current user if making another user a host
             return { ...p, isHost: false };
        }
        if (p.isHost) return { ...p, isHost: false }; // Demote current host
        if (p.name === userName) return { ...p, isHost: true }; // Promote new host
        return p;
      })
    }));
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
        removeFriend,
        participants,
        pendingUsers,
        approveUser,
        declineUser,
        removeParticipant,
        toggleMute,
        toggleCamera,
        makeHost
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
