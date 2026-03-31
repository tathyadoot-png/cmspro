// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";

// export default function ChatPanel({ workshopId }: any) {

//   const [messages, setMessages] = useState<any[]>([]);
//   const [text, setText] = useState("");

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {

//     const res = await api.get(`/messages/workshop/${workshopId}`);

//     setMessages(res.data.data || []);
//   };

//   const send = async () => {

//     await api.post("/messages", {
//       workshopId,
//       message: text
//     });

//     setText("");

//     fetchMessages();
//   };

//   return (

//     <div className="border rounded p-3">

//       <h2 className="font-semibold mb-2">
//         Chat
//       </h2>

//       <div className="space-y-1 mb-2 max-h-40 overflow-auto">

//         {messages.map((m: any) => (
//           <div key={m._id}>
//             <b>{m.sender?.name}</b>: {m.message}
//           </div>
//         ))}

//       </div>

//       <div className="flex gap-2">

//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="border flex-1 p-1"
//         />

//         <button
//           onClick={send}
//           className="bg-blue-600 text-white px-3"
//         >
//           Send
//         </button>

//       </div>

//     </div>
//   );
// }



"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

export default function ChatPanel({ workshopId }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [workshopId]);

  // Scroll to bottom whenever messages update
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
      console.error("Chat fetch error:", err);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    try {
      await api.post("/messages", {
        workshopId,
        message: text,
      });
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl flex flex-col h-[500px] overflow-hidden">
      
      {/* Dark Header */}
      <div className="bg-[#1A1A1A] px-8 py-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Team Comms</h2>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-0.5 italic">Encrypted Channel</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          <svg className="text-rose-500" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initiate conversation...</p>
          </div>
        ) : (
          messages.map((m: any) => (
            <div key={m._id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1 ml-1">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">
                  {m.sender?.name}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">

  {m.type === "TASK_EVENT" ? (
    <>
      ⚡ {m.message}
      {m.metadata?.assignedTo?.name && (
        <> to <span className="font-bold text-rose-600">{m.metadata.assignedTo.name}</span></>
      )}
      {m.metadata?.assignedBy?.name && (
        <> by <span className="font-bold">{m.metadata.assignedBy.name}</span></>
      )}
    </>
  ) : (
    m.message
  )}

</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white border-t border-gray-100">
        <div className="relative flex items-center gap-3 bg-gray-50 border border-gray-200 p-1.5 rounded-2xl focus-within:border-rose-500/50 focus-within:ring-4 focus-within:ring-rose-500/5 transition-all">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent px-4 py-2 text-xs font-bold text-slate-700 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="bg-[#1A1A1A] text-white p-2.5 rounded-xl hover:bg-rose-600 disabled:opacity-20 disabled:hover:bg-[#1A1A1A] transition-all group"
          >
            <svg 
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}