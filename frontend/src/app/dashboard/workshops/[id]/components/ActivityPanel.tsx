"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

export default function ActivityPanel({ workshopId }: any) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!workshopId) return;

    fetchActivity();

    // join socket room
    socket.emit("join-workshop", workshopId);

    socket.on("NEW_ACTIVITY", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.off("NEW_ACTIVITY");
    };
  }, [workshopId]);

  const fetchActivity = async () => {
    try {
      const res = await api.get(`/activity/workshop/${workshopId}`);
      setActivities(res.data.data || []);
    } catch (err) {
      console.error("Error fetching workshop activities", err);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl flex flex-col h-full overflow-hidden">
      
      {/* Dark Header Section */}
      <div className="bg-[#1A1A1A] p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight">Workshop Activity</h3>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Live Feed</p>
        </div>
        <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Real-time</span>
        </div>
      </div>

      {/* Activity Timeline Body */}
      <div className="p-6 overflow-y-auto max-h-[600px] bg-white custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
              <svg className="text-slate-300" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">System standby: No logs</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((a, index) => (
              <div key={a._id} className="relative flex gap-4 group">
                
                {/* Timeline Connector Line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-[9px] top-6 w-[2px] h-[calc(100%+1.5rem)] bg-gray-50 group-hover:bg-rose-100 transition-colors" />
                )}

                {/* Status Indicator */}
                <div className="relative z-10 pt-1">
                  <div className="w-[20px] h-[20px] rounded-full bg-white border-2 border-gray-100 flex items-center justify-center group-hover:border-rose-500 transition-all duration-300 shadow-sm">
                    <div className="w-[6px] h-[6px] rounded-full bg-gray-300 group-hover:bg-rose-500 transition-colors" />
                  </div>
                </div>

                {/* Content Bubble */}
                <div className="flex-1 pb-1">
                  <div className="bg-gray-50/50 group-hover:bg-rose-50/30 p-4 rounded-2xl border border-transparent group-hover:border-rose-100 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        {a.userId?.name || "System"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {a.message.split("'").map((part: string, i: number) => 
                        i % 2 === 1 ? <span key={i} className="font-bold text-slate-900">'{part}'</span> : part
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-4 bg-slate-50 border-t border-gray-100 text-center">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
          End of Activity Log
        </p>
      </div>
    </div>
  );
}