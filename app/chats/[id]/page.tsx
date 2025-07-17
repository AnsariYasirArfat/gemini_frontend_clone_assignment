"use client";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { useState } from "react";
import MessageList from "@/components/ChatRoom/MessageList";
import ChatInput from "@/components/ChatRoom/ChatInput";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  ChatRoom,
  Message,
  updateChatroomMessages,
} from "@/store/reducers/chatRoomSlice";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/constants/localStorage";
import Link from "next/link";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import TypingIndicator from "@/components/ChatRoom/TypingIndicator";

const MESSAGES_PER_PAGE = 20;

export default function ChatRoomPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const chatRoom = useAppSelector((state) =>
    state.chatRoom.chatRooms.find((room) => room.id === id)
  ) as ChatRoom | undefined;
  const [chatRooms, setChatRooms] = useLocalStorage<ChatRoom[]>(
    LOCALSTORAGE_KEYS.CHATROOMS,
    []
  );
  const [typing, setTyping] = useState(false);

  const allMessages = chatRoom?.messages || [];

  const {
    displayedItems: paginatedMessages,
    hasMore,
    isLoading,
    loadMore,
  } = useInfiniteScroll<Message>({
    items: allMessages,
    itemsPerPage: MESSAGES_PER_PAGE,
    direction: "up",
  });

  const handleSend = (text: string, image?: string) => {
    if (!chatRoom || typing) return;
    const userMsg: Message = {
      id: uuidv4(),
      sender: "user",
      text,
      image,
      timestamp: new Date().toISOString(),
      page: 1,
    };

    const updatedMessages = [...(chatRoom.messages || []), userMsg];
    setTyping(true);

    dispatch(
      updateChatroomMessages({
        chatRoomId: chatRoom.id,
        messages: updatedMessages,
      })
    );
    setChatRooms(
      chatRooms.map((room) =>
        room.id === chatRoom.id ? { ...room, messages: updatedMessages } : room
      )
    );

    const aiDelay = 1200 + Math.floor(Math.random() * 800); 
    setTimeout(() => {
      const aiMsg: Message = {
        id: uuidv4(),
        sender: "ai",
        text: `Thanks for your message: "${text}". Let me take a moment to look into it and get back to you.`,
        timestamp: new Date().toISOString(),
        page: 1,
      };
      const finalMessages = [...updatedMessages, aiMsg];

      dispatch(
        updateChatroomMessages({
          chatRoomId: chatRoom.id,
          messages: finalMessages,
        })
      );
      setChatRooms(
        chatRooms.map((room) =>
          room.id === chatRoom.id ? { ...room, messages: finalMessages } : room
        )
      );
      setTyping(false);
    }, aiDelay);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (!chatRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="text-2xl font-semibold text-gray-400 mb-4">
          Chatroom not found
        </div>
        <div className="text-gray-500 mb-6">
          The chatroom you are looking for does not exist or was deleted.
        </div>
        <Link href="/" passHref>
          <button className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <div className="flex-1 min-h-0 flex flex-col">
        <MessageList
          messages={paginatedMessages}
          onCopy={handleCopy}
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
        {typing && (
          <div className="pb-1 max-w-[760px] w-full mx-auto">
            <TypingIndicator text="Gemini is thinking" />
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} loading={typing} />
    </div>
  );
}
