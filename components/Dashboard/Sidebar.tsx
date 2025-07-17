"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/ModeToggle";
import { cn } from "@/lib/utils";
import { Menu, SquarePen, Search } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hook";
import NewChatModal from "./NewChatModal";
import ChatRoomList from "./ChatRoomList";
import ChatRoomListSkeleton from "./ChatRoomListSkeleton";

interface SidebarProps {
  closeDrawer?: () => void;
  isDrawer?: boolean;
}

export default function Sidebar({ closeDrawer, isDrawer }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);

  const handleNav = (cb?: () => void) => {
    if (cb) cb();
    if (isDrawer && closeDrawer) closeDrawer();
  };

  return (
    <aside
      className={cn(
        "flex flex-col gap-2 sm:gap-4 p-4 h-[100svh] bg-[#f0f4f9] dark:bg-[#282a2c] transition-all duration-300 ",
        collapsed ? "w-16 " : "w-64 "
      )}
    >
      <div
        className={cn(
          "flex items-center",
          collapsed ? "justify-center " : "justify-between"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNav(() => setCollapsed((c) => !c))}
          className={` flex justify-center items-center hover:!bg-zinc-400/20`}
        >
          <Menu size={20} />
        </Button>
        <Link
          href="/search"
          className={cn(
            "p-2 rounded-full hover:bg-zinc-400/20 transition-colors",
            collapsed && "hidden"
          )}
          onNavigate={() => handleNav()}
        >
          <Search size={16} />
        </Link>
      </div>

      <div
        className={cn(
          "flex items-center",
          collapsed ? "justify-center " : "justify-between"
        )}
      >
        <Button
          className={cn(
            "w-full  hover:!bg-zinc-400/20 cursor-pointer",
            collapsed ? "justify-center " : "justify-start"
          )}
          variant="ghost"
          disabled={!auth.isAuthenticated}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <SquarePen />
          <span className={cn("", collapsed && "hidden")}> New Chat</span>
        </Button>
        <NewChatModal
          open={modalOpen}
          setOpen={setModalOpen}
          closeDrawer={closeDrawer}
        />
      </div>

      <div
        id="chatroom-scrollable"
        className="flex-1 overflow-y-auto p-2"
        style={{ minHeight: 0 }}
      >
        <div
          className={cn(
            "text-gray-700 dark:text-gray-300",
            collapsed && "hidden"
          )}
        >
          <div className="mb-2">Recent</div>
          {loading ? (
            <ChatRoomListSkeleton count={8} />
          ) : !auth.isAuthenticated ? (
            <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-lg text-center">
              <div className="font-semibold mb-1">
                Sign in to start saving your chats
              </div>
              <div className="text-xs mb-2">
                Once you're signed in, you can access your recent chats here.
              </div>
              <Link
                href="/login"
                className="text-blue-600 hover:underline"
                onNavigate={() => handleNav()}
              >
                Sign in
              </Link>
            </div>
          ) : (
            <ChatRoomList onRoomClick={handleNav} />
          )}
        </div>
      </div>

      <div className="mt-auto p-4 flex justify-start">
        <ModeToggle />
      </div>
    </aside>
  );
}
