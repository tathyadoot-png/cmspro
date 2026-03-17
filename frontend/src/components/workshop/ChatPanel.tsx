"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket"; // 👈 path adjust करो

export default function ChatPanel({ workshopId }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!workshopId) return;

    socket.emit("join-workshop", workshopId);

    const handleMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("new-message", handleMessage);

    return () => {
      socket.off("new-message", handleMessage);
    };
  }, [workshopId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      workshopId,
      message: text,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            {m.message}
          </div>
        ))}
      </div>

      <div className="border-t p-2 flex">
        <input
          className="flex-1 border p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white px-3"
        >
          Send
        </button>
      </div>
    </div>
  );
}