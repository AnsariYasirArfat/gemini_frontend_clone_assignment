"use client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAppSelector } from "@/store/hook";
import { ChatRoom } from "@/store/reducers/chatRoomSlice";
import SpinnerLoader from "../common/SpinnerLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function ChatRoomList() {
  const chatRooms = useAppSelector(
    (state) => state.chatRoom.chatRooms
  ) as ChatRoom[];
  const { displayedItems, hasMore, isLoading, loadMore } =
    useInfiniteScroll<ChatRoom>({
      items: chatRooms,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  return (
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
          <Link
            key={room.id}
            href={`/chats/${room.id}`}
            className="block p-2 rounded-full hover:bg-zinc-600 cursor-pointer transition truncate whitespace-nowrap"
          >
            {room.title}
          </Link>
        ))}
      </div>
    </InfiniteScroll>
  );
}
