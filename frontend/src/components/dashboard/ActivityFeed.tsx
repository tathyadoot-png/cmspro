"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

type Activity = {
  _id: string;
  message: string;
  createdAt?: string;
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/activity");
      setActivities(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActivities();
    socket.on("NEW_ACTIVITY", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });
    return () => {
      socket.off("NEW_ACTIVITY");
    };
  }, []);

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.15em] mt-1">Live Updates</p>
        </div>
        <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="p-8 overflow-y-auto max-h-[450px] space-y-8 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No recent updates</p>
          </div>
        ) : (
          activities.map((a, index) => (
            <div key={a._id} className="relative flex gap-6 group">
              
              {/* Timeline Connector Line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-[11px] top-6 w-[2px] h-[calc(100%+2rem)] bg-gray-50 group-hover:bg-rose-100 transition-colors" />
              )}

              {/* Status Dot */}
              <div className="relative z-10">
                <div className="w-[24px] h-[24px] rounded-full bg-white border-2 border-gray-100 flex items-center justify-center group-hover:border-rose-500 transition-colors duration-300 shadow-sm">
                  <div className="w-[8px] h-[8px] rounded-full bg-gray-300 group-hover:bg-rose-500 transition-colors" />
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 pb-2">
                <div className="bg-gray-50/50 group-hover:bg-rose-50/30 p-4 rounded-2xl border border-transparent group-hover:border-rose-100 transition-all duration-300">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {/* Styling the 'message' to bold names automatically if they exist */}
                    {a.message.split("'").map((part, i) => 
                      i % 2 === 1 ? <span key={i} className="font-bold text-slate-900">'{part}'</span> : part
                    )}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <svg className="text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just Now"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50/30 border-t border-gray-100 text-center">
        <button className="text-[11px] font-black text-gray-400 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors">
          Clear All Logs
        </button>
      </div>
    </div>
  );
}