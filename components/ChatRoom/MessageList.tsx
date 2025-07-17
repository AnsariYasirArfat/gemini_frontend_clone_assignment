"use client";
import { Message } from "@/store/reducers/chatRoomSlice";
import { Copy } from "lucide-react";
import { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface MessageListProps {
  messages: Message[];
  onCopy: (text: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function MessageList({
  messages,
  onCopy,
  loadMore,
  hasMore,
  isLoading,
}: MessageListProps) {
  const SCROLLABLE_ID = "chat-message-scrollable";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      id={SCROLLABLE_ID}
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          isLoading && (
            <div className="flex justify-center py-2 text-xs text-gray-400">
              Loading older messages...
            </div>
          )
        }
        scrollThreshold="200px"
        inverse={true}
        scrollableTarget={SCROLLABLE_ID}
        className="flex flex-col-reverse max-w-[760px] mx-auto"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex justify-center  mb-4 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative  max-w-[80%] px-5 py-3 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-[#333537] to-[#424548] text-white rounded-3xl rounded-tr-md"
                  : "bg-transparent text-gray-100 border rounded-3xl rounded-tl-md"
              } shadow-md`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="uploaded"
                  className="mb-2 rounded-lg max-w-xs max-h-40 object-cover"
                />
              )}
              <span className="block break-words">{msg.text}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                <button
                  className="ml-2 p-1 rounded hover:bg-zinc-700 transition"
                  onClick={() => onCopy(msg.text)}
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
