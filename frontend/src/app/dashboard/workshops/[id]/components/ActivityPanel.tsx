"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

export default function ActivityPanel({ workshopId }: any) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!workshopId) return;

    fetchActivity();

    // 🔥 join socket room
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
      const res = await api.get(`/audit/workshop/${workshopId}`);
      setActivities(res.data.data || []);
    } catch (err) {
      console.error("Error fetching workshop activities", err);
    }
  };

  // 🔥 ACTION TEXT GENERATOR (FIXED)
  const getActionText = (a: any) => {
    const title = a.targetId?.title || "task";

    switch (a.actionType) {
      case "TASK_CREATED":
        return `created task "${title}"`;

      case "TASK_STARTED":
        return `started task "${title}"`;

      case "TASK_SUBMITTED":
        return `submitted task "${title}"`;

      case "TASK_APPROVED":
        return `approved task "${title}"`;

      case "REVISION_REQUESTED":
        return `requested revision for "${title}"`;

   case "TASK_STATUS_CHANGED":
  return `changed status to "${a.newValue || "N/A"}"`; // ✅ FIX

      default:
        return a.actionType;
    }
  };

  // 🔥 OPTIONAL: STATUS COLOR
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-emerald-600";
      case "IN_PROGRESS":
        return "text-blue-600";
      case "IN_REVIEW":
        return "text-amber-600";
      case "CHANGES_REQUESTED":
        return "text-rose-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#1A1A1A] p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight">
            Workshop Activity
          </h3>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">
            Live Feed
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              No Activity Yet
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {activities.map((a, index) => {
              const status = a.metadata?.newStatus;

              return (
                <div key={a._id} className="flex gap-4">
                  
                  {/* Dot */}
                  <div className="mt-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {a.userId?.name || "System"}
                    </p>

                    <p className="text-xs text-slate-600">
                      {getActionText(a)}{" "}
                      
                      {/* 🔥 STATUS BADGE */}
                      {status && (
                        <span
                          className={`ml-1 font-bold ${getStatusColor(status)}`}
                        >
                          ({status})
                        </span>
                      )}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t text-center">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
          End of Logs
        </p>
      </div>
    </div>
  );
}