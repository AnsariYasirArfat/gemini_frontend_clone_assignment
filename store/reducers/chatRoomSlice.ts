import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  image?: string;
  timestamp: string;
  page: number;
}

export interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  messages: Message[];
}

interface ChatRoomState {
  chatRooms: ChatRoom[];
}

const initialState: ChatRoomState = {
  chatRooms: [],
};

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {
    rehydrateChatRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.chatRooms = action.payload;
    },
    createChatroom: (state, action: PayloadAction<ChatRoom>) => {
      state.chatRooms.unshift(action.payload);
    },
    updateChatroomMessages: (
      state,
      action: PayloadAction<{ chatRoomId: string; messages: Message[] }>
    ) => {
      const { chatRoomId, messages } = action.payload;
      const room = state.chatRooms.find((r) => r.id === chatRoomId);
      if (room) {
        room.messages = messages;
        room.lastUpdated = new Date().toISOString();
      }
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      state.chatRooms = state.chatRooms.filter(room => room.id !== action.payload);
    },
  },
});

export const { rehydrateChatRooms, createChatroom, updateChatroomMessages, deleteChatroom } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
