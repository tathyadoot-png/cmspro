"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

export default function TaskComments({ taskId }: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchComments();
    socket.emit("joinTask", taskId);
    socket.on("NEW_COMMENT", (comment) => {
      if (comment.taskId === taskId) setComments(prev => [comment, ...prev]);
    });
    return () => { socket.off("NEW_COMMENT"); };
  }, [taskId]);

  const fetchComments = async () => {
    const res = await api.get(`/task-comments/${taskId}`);
    setComments(res.data.data);
  };

  const sendComment = async () => {
    if (!message) return;
    await api.post("/task-comments", { taskId, message });
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[450px]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {comments.map((c: any) => (
          <div key={c._id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-white transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{c.userId?.name}</span>
              <span className="text-[8px] text-slate-400 italic">verified operator</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{c.message}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-400 transition-all">
        <input 
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          className="bg-transparent px-4 py-2 text-sm flex-1 outline-none font-medium"
        />
        <button onClick={sendComment} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
          SEND
        </button>
      </div>
    </div>
  );
}