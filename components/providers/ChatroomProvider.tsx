"use client";
import { useRehydrateChatRooms } from "@/hooks/useRehydrateChatRooms";
import { useSelector } from "react-redux";

export default function ChatroomProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  useRehydrateChatRooms(isAuthenticated);
  return <>{children}</>;
}
