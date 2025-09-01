
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

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
  email: string;
  avatar: string;
  hint: string;
  isHost: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
}

export interface PendingUser {
  name: string;
  email: string;
  avatar: string;
  hint: string;
}

export interface ChatMessage {
  user: string;
  text: string;
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
  approveUser: (roomId: string, userEmail: string) => void;
  declineUser: (roomId: string, userEmail: string) => void;
  removeParticipant: (roomId: string, userEmail: string) => void;
  toggleMute: (roomId: string, userEmail: string) => void;
  toggleCamera: (roomId: string, userEmail: string) => void;
  makeHost: (roomId: string, userEmail: string) => void;
  messages: Record<string, ChatMessage[]>;
  addMessage: (roomId: string, message: ChatMessage) => void;
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

const getInitialParticipants = (user: UserProfile | null): Record<string, Participant[]> => {
    if (!user) return {};
    return {
        "a1b2c3": [
            { name: user.name, email: user.email, avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: true, isMuted: false, isCameraOff: false },
            { name: "Alice", email: "alice@example.com", avatar: "https://placehold.co/40x40.png", hint: "woman smiling", isHost: false, isMuted: false, isCameraOff: false },
        ],
        "g7h8i9": [
            { name: user.name, email: user.email, avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: true, isMuted: false, isCameraOff: false },
            { name: "Bob", email: "bob@example.com", avatar: "https://placehold.co/40x40.png", hint: "man portrait", isHost: false, isMuted: true, isCameraOff: false },
            { name: "Charlie", email: "charlie@example.com", avatar: "https://placehold.co/40x40.png", hint: "person glasses", isHost: false, isMuted: false, isCameraOff: true },
        ],
        "j1k2l3": [
            { name: user.name, email: user.email, avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: true, isMuted: false, isCameraOff: false },
        ],
        "d4e5f6": [
            { name: user.name, email: user.email, avatar: "https://placehold.co/40x40.png", hint: "user avatar", isHost: false, isMuted: false, isCameraOff: false },
        ],
    };
};

const initialPendingUsers: Record<string, PendingUser[]> = {
  "a1b2c3": [
    { name: "David", email: "david@example.com", avatar: "https://placehold.co/40x40.png", hint: "man glasses" },
    { name: "Eve", email: "eve@example.com", avatar: "https://placehold.co/40x40.png", hint: "woman smiling portrait" },
  ]
};

const initialMessages: Record<string, ChatMessage[]> = {
    "a1b2c3": [
        { user: "Alice", text: "Hey everyone! 👋 Just finished the first draft of the moodboard. Let me know what you think.", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
        { user: "Test User", text: "Awesome, I'll take a look now!", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
    ]
}


export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: "User", email: "user@example.com" });
  
  const [allRooms, setAllRooms] = useState<Room[]>(initialAllRooms);
  const [rooms, setRooms] = useState<Room[]>(initialJoinedRooms); // Joined rooms
  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [roomLabelAssignments, setRoomLabelAssignments] = useState<Record<string, string>>(initialAssignments);
  const [sharedData, setSharedData] = useState<SharedData[]>(initialSharedData);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [participants, setParticipants] = useState<Record<string, Participant[]>>({});
  const [pendingUsers, setPendingUsers] = useState<Record<string, PendingUser[]>>(initialPendingUsers);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(initialMessages);

  useEffect(() => {
    if (user) {
      const profile = {
        name: user.displayName || 'Test User',
        email: user.email || 'test@example.com',
      };
      setUserProfile(profile);
      setParticipants(getInitialParticipants(profile));
    }
  }, [user]);

  const addRoom = useCallback((roomDetails: Omit<Room, 'id' | 'isHost'>): Room => {
    const newRoom: Room = {
      ...roomDetails,
      id: Math.random().toString(36).substring(2, 8).toLowerCase(),
      isHost: true,
    };
    
    setAllRooms((prev) => [...prev, newRoom]);
    setRooms((prev) => [...prev, newRoom]);

    const me: Participant = {
        name: userProfile.name,
        email: userProfile.email,
        avatar: "https://placehold.co/40x40.png",
        hint: "user avatar",
        isHost: true,
        isMuted: false,
        isCameraOff: false,
    };
    setParticipants(prev => ({
        ...prev,
        [newRoom.id]: [me]
    }));

    return newRoom;
  }, [userProfile.name, userProfile.email]);

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

  const updateUserProfileContext = (profile: UserProfile) => {
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

  const approveUser = useCallback((roomId: string, userEmail: string) => {
    setPendingUsers(prevPending => {
      const roomPending = prevPending[roomId] || [];
      const userToApprove = roomPending.find(u => u.email === userEmail);

      if (!userToApprove) {
        return prevPending;
      }

      setParticipants(prevParticipants => {
        const roomParticipants = prevParticipants[roomId] || [];
        if (roomParticipants.some(p => p.email === userEmail)) {
          return prevParticipants;
        }
        const newParticipant: Participant = { ...userToApprove, isHost: false, isMuted: false, isCameraOff: false };
        return { ...prevParticipants, [roomId]: [...roomParticipants, newParticipant] };
      });

      return { ...prevPending, [roomId]: roomPending.filter(u => u.email !== userEmail) };
    });
  }, []);

  const declineUser = useCallback((roomId: string, userEmail: string) => {
    setPendingUsers(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(u => u.email !== userEmail)
    }));
  }, []);

  const removeParticipant = useCallback((roomId: string, userEmail: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(p => p.email !== userEmail)
    }));
  }, []);

  const toggleMute = useCallback((roomId: string, userEmail: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(p => p.email === userEmail ? { ...p, isMuted: !p.isMuted } : p)
    }));
  }, []);

  const toggleCamera = useCallback((roomId: string, userEmail: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(p => p.email === userEmail ? { ...p, isCameraOff: !p.isCameraOff } : p)
    }));
  }, []);

  const makeHost = useCallback((roomId: string, userEmail: string) => {
    setParticipants(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(p => 
        p.email === userEmail ? { ...p, isHost: !p.isHost } : p
      )
    }));
  }, []);

  const addMessage = useCallback((roomId: string, message: ChatMessage) => {
    setMessages(prev => {
        const roomMessages = prev[roomId] || [];
        return { ...prev, [roomId]: [...roomMessages, message] };
    });
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
        updateUserProfile: updateUserProfileContext,
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
        makeHost,
        messages,
        addMessage,
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
