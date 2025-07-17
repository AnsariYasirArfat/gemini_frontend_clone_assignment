"use client";
import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { ChatRoom, deleteChatroom } from "@/store/reducers/chatRoomSlice";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/constants/localStorage";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function ChatRoomList({ onRoomClick }: { onRoomClick?: () => void }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const chatRooms = useAppSelector(
    (state) => state.chatRoom.chatRooms
  ) as ChatRoom[];
  const [localChatRooms, setLocalChatRooms] = useLocalStorage<ChatRoom[]>(
    LOCALSTORAGE_KEYS.CHATROOMS,
    []
  );
  const { displayedItems, hasMore, isLoading, loadMore } =
    useInfiniteScroll<ChatRoom>({
      items: chatRooms,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    await new Promise((res) => setTimeout(res, 1200));
    dispatch(deleteChatroom(selectedId));
    setLocalChatRooms(localChatRooms.filter((room) => room.id !== selectedId));
    setDeleting(false);
    setModalOpen(false);
    setSelectedId(null);
    toast.success("Chatroom deleted!");
    router.replace("/");
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedId(null);
    setDeleting(false);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={displayedItems.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          isLoading && (
            <div className="flex justify-center py-2">
              <Loader2 className="w-8 h-5 animate-spin text-neutral-500" />
            </div>
          )
        }
        scrollThreshold="0.9"
        scrollableTarget="chatroom-scrollable"
        style={{ overflow: "visible" }}
      >
        <div className="space-y-2">
          {displayedItems.map((room) => (
            <div key={room.id} className="flex items-center group p-2 rounded-full hover:bg-zinc-400/20 ">
              <Link
                href={`/chats/${room.id}`}
                onClick={onRoomClick}
                className="flex-1 block p-1 cursor-pointer transition truncate whitespace-nowrap"
              >
                {room.title}
              </Link>
              <button
                onClick={() => openDeleteModal(room.id)}
                className="ml-2 p-2 rounded-full hover:text-red-300 hover:bg-zinc-500  transition-colors text-zinc-400 lg:opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete chat room"
                tabIndex={0}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      <ConfirmModal
        open={modalOpen}
        title="Delete Chatroom"
        description="Are you sure you want to delete this chatroom? This action cannot be undone."
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
