"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/ModeToggle";
import { cn } from "@/lib/utils";
import { Menu, SquarePen } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hook";
import NewChatModal from "./NewChatModal";
import ChatRoomList from "./ChatRoomList";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const chatRooms = useAppSelector((state) => state.chatRoom);
  
  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#f0f4f9] dark:bg-[#282a2c] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((c) => !c)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="p-4 space-y-2">
        <Button
          className="w-full justify-start hover:!bg-zinc-600 cursor-pointer"
          variant="ghost"
          disabled={!auth.isAuthenticated}
          onClick={() => setModalOpen(true)}
        >
          <SquarePen />
          <span className={cn("", collapsed && "hidden")}> New Chat</span>
        </Button>
        <NewChatModal open={modalOpen} setOpen={setModalOpen} />
      </div>

      <div
        id="chatroom-scrollable"
        className="flex-1 overflow-y-auto p-2"
        style={{ minHeight: 0 }} 
      >
        <div className={cn("text-gray-500", collapsed && "hidden")}>
          <div className="mb-2">Recent</div>
          {!auth.isAuthenticated ? (
            <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-lg text-center">
              <div className="font-semibold mb-1">
                Sign in to start saving your chats
              </div>
              <div className="text-xs mb-2">
                Once you're signed in, you can access your recent chats here.
              </div>
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          ) : (
            <ChatRoomList />
          )}
        </div>
      </div>

      <div className="mt-auto p-4 flex justify-center">
        <ModeToggle />
      </div>
    </aside>
  );
}
