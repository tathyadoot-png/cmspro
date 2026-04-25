"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

export default function ChatPanel({ workshopId }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workshopId) fetchMessages();
  }, [workshopId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/workshop/${workshopId}`);
      setMessages(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    try {
      await api.post("/messages", { workshopId, message: text });
      setText("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 flex flex-col h-[600px] my-5 overflow-hidden shadow-sm transition-all">
      
      {/* 1. COMPACT HEADER */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Team Comms</h2>
        </div>
        <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">
          ID: {workshopId?.slice(-4).toUpperCase()}
        </span>
      </div>

      {/* 2. CHAT AREA */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-white custom-scrollbar"
      >
        {messages.length === 0 ? (
          <p className="text-[10px] text-center mt-10 text-slate-300 font-bold uppercase tracking-widest">No messages</p>
        ) : (
          messages.map((m: any) => {
            const isSystem = m.type === "TASK_EVENT";
            return (
              <div key={m._id} className={`flex flex-col ${isSystem ? 'items-center py-1' : ''}`}>
                {!isSystem && (
                  <div className="flex items-end gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-900">{m.sender?.name}</span>
                    <span className="text-[8px] text-slate-400 font-medium">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                
                <div className={`
                  ${isSystem 
                    ? 'text-[9px] font-bold text-indigo-500 bg-indigo-50/50 px-4 py-1 rounded-full border border-indigo-100/50 italic tracking-tight' 
                    : 'bg-slate-50 text-slate-700 p-3 rounded-2xl rounded-tl-none border border-slate-100 max-w-[90%]'
                  }
                `}>
                  <p className="text-[11px] leading-snug font-medium">
                    {isSystem && <span className="mr-1.5 font-bold">◈</span>}
                    {m.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. MINIMAL INPUT */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-2xl focus-within:border-indigo-400 transition-all">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-3 py-1.5 text-[11px] font-medium text-slate-700 outline-none"
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="bg-indigo-600 text-white h-8 w-8 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-30 active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}