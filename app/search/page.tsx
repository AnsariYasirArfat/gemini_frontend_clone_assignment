"use client";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { useDebounce } from "@/hooks/useDebounce";
import SearchBar from "@/components/Search/SearchBar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import SearchListSkeleton from "@/components/Search/SearchListSkeleton";
import SearchChatRoomList from "@/components/Search/SearchChatRoomList";

const ITEMS_PER_PAGE = 10;

export default function SearchPage() {
  const chatRooms = useAppSelector((state) => state.chatRoom.chatRooms);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const [filteredRooms, setFilteredRooms] = useState(chatRooms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setFilteredRooms(
        chatRooms.filter((room) =>
          room.title.toLowerCase().includes(debouncedQuery.toLowerCase())
        )
      );
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [debouncedQuery, chatRooms]);

  const { displayedItems, hasMore, loadMore } = useInfiniteScroll({
    items: filteredRooms,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <div className="flex flex-col items-center flex-1 w-full min-h-0 px-4">
      <div className="w-full flex-1 min-h-0 flex flex-col max-w-[760px]">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold py-8">Search</h1>
        <SearchBar
          value={query}
          loading={loading}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Recent</div>
          {loading ? (
            <SearchListSkeleton count={5} />
          ) : filteredRooms.length === 0 ? (
            <div className="text-zinc-400">No chats found.</div>
          ) : (
            <SearchChatRoomList
              rooms={displayedItems}
              hasMore={hasMore}
              loadMore={loadMore}
              loader={<SearchListSkeleton count={2} />}
              scrollableTarget="search-scrollable"
            />
          )}
        </div>
      </div>
    </div>
  );
}
