"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { ChatRoom, createChatroom } from "@/store/reducers/chatRoomSlice";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/constants/localStorage";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SpinnerLoader from "../common/SpinnerLoader";
import { useRouter } from "next/navigation";

const chatroomSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type ChatroomForm = z.infer<typeof chatroomSchema>;

interface NewChatModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeDrawer?: () => void;
}

export default function NewChatModal({ open, setOpen,closeDrawer }: NewChatModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [chatRooms, setChatRooms] = useLocalStorage<ChatRoom[]>(
    LOCALSTORAGE_KEYS.CHATROOMS,
    []
  );
  const [loading, setLoading] = useState(false);

  const form = useForm<ChatroomForm>({
    resolver: zodResolver(chatroomSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (data: ChatroomForm) => {
    setLoading(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const newChatRoom: ChatRoom = {
        id: uuidv4(),
        title: data.title.trim(),
        createdAt: now,
        lastUpdated: now,
        messages: [],
      };
      dispatch(createChatroom(newChatRoom));
      setChatRooms([newChatRoom, ...chatRooms]);
      toast.success("Chatroom created!");
      form.reset();
      setLoading(false);
      setOpen(false);
      if (closeDrawer) closeDrawer();
      router.push(`/chats/${newChatRoom.id}`);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Enter title"
            {...form.register("title")}
            disabled={loading}
            autoFocus
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
          <DialogFooter className="sm:gap-4">
            <DialogClose asChild>
              <Button type="button" variant="destructive" disabled={loading}>
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <SpinnerLoader />
                  {"Creating..."}
                </span>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
