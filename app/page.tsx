"use client";
import { useState } from "react";
import { useAppSelector } from "@/store/hook";
import NewChatModal from "@/components/Dashboard/NewChatModal";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

export default function Home() {
  const auth = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Gemini Frontend Clone Assignment
      </h1>
      {auth.isAuthenticated ? (
        <>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Click <span className="font-semibold">New Chat</span> to start a new
            conversation.
          </p>
          <Button onClick={() => setModalOpen(true)} className="mb-4">
            <SquarePen /> New Chat
          </Button>
          <NewChatModal open={modalOpen} setOpen={setModalOpen} />
        </>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Please sign in to create and save your chats.
        </p>
      )}
    </div>
  );
}
