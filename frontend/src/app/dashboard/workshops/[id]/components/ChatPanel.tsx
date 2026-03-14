"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ChatPanel({ workshopId }: any) {

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {

    const res = await api.get(`/messages/workshop/${workshopId}`);

    setMessages(res.data.data || []);
  };

  const send = async () => {

    await api.post("/messages", {
      workshopId,
      message: text
    });

    setText("");

    fetchMessages();
  };

  return (

    <div className="border rounded p-3">

      <h2 className="font-semibold mb-2">
        Chat
      </h2>

      <div className="space-y-1 mb-2 max-h-40 overflow-auto">

        {messages.map((m: any) => (
          <div key={m._id}>
            <b>{m.sender?.name}</b>: {m.message}
          </div>
        ))}

      </div>

      <div className="flex gap-2">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border flex-1 p-1"
        />

        <button
          onClick={send}
          className="bg-blue-600 text-white px-3"
        >
          Send
        </button>

      </div>

    </div>
  );
}