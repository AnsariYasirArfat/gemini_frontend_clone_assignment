'use client'
import { ModeToggle } from "@/components/common/ModeToggle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to Gemini Frontend Clone Assignment</h1>
      {/* Here you will render the chat window or login warning */}
    </div>
  );
}
